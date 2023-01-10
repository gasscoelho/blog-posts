---
title: Prefixing the Commit Messages with Git Hooks
slug: prefixing-the-commit-messages-with-git-hooks
description: Automate your commit messages with hooks
release_date: '2022-04-16'
image: https://raw.githubusercontent.com/gasscoelho/blog-posts/main/posts/prefixing-the-commit-messages-with-git-hooks/hook-wall.jpg
image_credits: Photo by <strong><a target="_blank" rel="noopener noreferrer" href="https://unsplash.com/@hdbernd?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Bernd Dittrich</a></strong> on <strong><a target="_blank" rel="noopener noreferrer" href="https://unsplash.com/s/photos/hook?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></strong>
---

When working on projects it’s really common to have a tool to manage your tasks. With that in mind, you might get asked to prefix your commit messages using the ticket number — which by the way, it’s an excellent practice because makes it easier to track commits in the future.

But imagine the pain to do it for every commit? Maybe you forget to prefix and then will have to use some additional command like a `git amend` to edit your message or even a `git rebase` depending on the scenario.

So in this post, you will learn how to automate this process with Git hook.

## What are Git Hooks?

Git hooks are shell scripts that are automatically executed before or after an event such as commit or push. With hooks, you are able to customize some git features by triggering custom actions.

Here are some of the most used hooks:

- **pre-commit:** executed every time when you do a `git commit` command. This is useful to run tests or checks on your code before it is committed to the repository. For example, you might use this hook to run your application tests, check for syntax errors, or verify that your code adheres to a certain coding style. If any issues are found, the hook can prevent the commit from occurring, which can help ensure that only high-quality code is committed to the repository.
- **prepare-commit-msg**: executed after the `pre-commit` hook and allows you to edit the commit message that is displayed in the text editor. This can be useful for automatically modifying the commit message provided by the user. For example, you might set up this hook to add the ticket number to the beginning of the commit message if it is not already present. This can help you track commits and their associated tickets more easily.
- **commit-msg:** pretty similar to the `prepare-commit-msg` hook but it’s called after the user enters a commit message. This is useful to enforce certain conventions for commit messages. For example, you might set up this hook to check the commit message for a certain formatting. If the commit message does not meet the specified standards, the hook can prevent the commit from occurring.
- **post-commit:** executed right after the `commit-msg` hook and it’s mainly used for notifications purposes. For example, you might set up this hook to send an email to team members or posts a message in a chat channel whenever a commit is made. This can help keep team members informed about changes to the repository.

> Click [here](https://git-scm.com/docs/githooks) to see the list of all the available hooks in git.

## Using prepare-commit-msg hook

Git provides a couple of hooks examples as soon as the repository is initialized. You can find the samples under the `.git/hooks` folder — Keep in mind this is a hidden folder so you might need to adjust your settings to be able to see it.

Adding a little more context, this hook is an executable file that Git will call right after the commit. It takes a single argument — the `filename` that contains the commit message.

Behind the scenes Git will do something like this:

```bash
$ .git/hooks/prepare-commit-msg .git/COMMIT_EDITMSG
```

_You don’t need to worry about the command above, it was shown just to help you to understand the final code that I'll share in this post later._

Before getting the sample code, go to the `.git/hooks` and rename the `prepare-commit-msg.sample` to just `prepare-commit-msg` — if you wish, you can create a copy first and leave the `.sample` version as a backup.

> By default, Git hooks are not enabled. In order to use a hook, you need to rename the corresponding sample file so that it no longer has a .sample extension. This will tell Git to execute the hook when the corresponding event occurs. 

### Sample code

*.git/hooks/prepare-commit-msg*

```powershell
#!/bin/bash

# COMMIT_EDITMSG
FILE=$1

# get file content
MESSAGE=$(cat $FILE)

# extract ticket identifier from branch name
TICKET=$(git rev-parse --abbrev-ref HEAD | grep -Eo '^(\w+(\/|-))?(\w+[-_])?[0-9]+' | grep -Po '(?<=\/|_|-).*' | tr "[:lower:]" "[:upper:]")

# get branch prefix e.g., feature, release, support, etc
BRANCH_PREFIX=$(git rev-parse --abbrev-ref HEAD | grep -Eoi '^(feature)' | tr "[:upper:]" "[:lower:]")

# identify auto-generated git messages
REGEX="(Merge branch '|Merge pull request #)"
IS_AUTOMATED_GIT_MESSAGE=$([[ $MESSAGE =~ $REGEX ]] && echo "true" || echo "false")

# the prefix will not be appended if:
#    1. the current branch is not a feature branch
#    2. the message was auto-generated by git
#    3. the current branch does not follow a name convention for a ticket branch e.g., feature/<ticket>-<number>
#    4. the message already contains the ticket identifier
if [[ $BRANCH_PREFIX != "feature" || $IS_AUTOMATED_GIT_MESSAGE = true || $TICKET == "" || "$MESSAGE" == "$TICKET"* ]];then
  exit 0;
fi

# write the new message to the COMMIT_EDITMSG file
echo "$TICKET: $MESSAGE" > $FILE
```

### Understanding the code

The `$1` will take the first argument (in this case `.git/COMMIT_EDITMSG`) and save it in the `FILE` variable.

```bash
FILE=$1
```

The `cat $FILE` command will get the output of the `.git/COMMIT_EDITMSG` file and save it in the `MESSAGE` variable. — in other words, the variable will receive the commit message.

```bash
MESSAGE=$(cat $FILE)
```

The `TICKET` variable is a little more complex because it involves a combination of a few commands in order to get the ticket number. 

```bash
TICKET=$(git rev-parse --abbrev-ref HEAD | grep -Eo '^(\w+(\/|-))?(\w+[-_])?[0-9]+' | grep -Po '(?<=\/|_|-).*' | tr "[:lower:]" "[:upper:]")
```

So let’s split it into 3 parts:

1. The first part uses a command to retrieve the current branch name. So consider you are working at `feature/abc-1234` — the command below would return `feature/abc-1234`

```bash
git rev-parse --abbrev-ref HEAD
```

2. The second part uses two `grep` commands to retrieve the ticket number from the branch name.
Some helpful information:
   1. `grep` is a Linux command used to search for text and strings in a given file.
   2. The `E` parameter is used to interpret a Regex expression and the `o` parameter to print out only what is matched. You can append them and use them like `-Eo`.
   3. The second `grep` command is using the `-P` parameter, which makes grep use the Perl dialect. This is required because of the "Positive lookbehind" regex expression being used.
    
   Since the goal of this post is not to dive into regex, I will skip the thorough explanation about them. However, keep in mind that the first group of regex is used to remove unwanted patterns from the branch name and the second group is responsible for retrieving only the ticket number that comes after the `/`, `-`, or `_` characters.
    
    ```markdown
    # Regex1
    command: grep -Eo '^(\w+(\/|-))?(\w+[-_])?[0-9]+'
    result:  feature/xyz-1234-v2 will output feature/xyz-1234
    
    # Regex2
    command: grep -Po '(?<=\/|_|-).*'
    result:  feature/xyz-1234 will output xyz-1234
    ```

    The test for the first regex (part 1) can be found at this [link](https://regexr.com/75tvl), while the test for the second regex (part 2) can be found at this other [link](https://regexr.com/75u0a).
    
2. The `tr` command in UNIX is a command-line utility for translating or deleting characters. In this example, I’m converting from lower to upper case.

```markdown
tr "[:lower:]" "[:upper:]"
```

Additionally, the `BRANCH_PREFIX` variable is self-explanatory, it's used to identify the type of the branch such as feature, bugfix, hotfix, etc. In short, it uses the `git rev-parse --abbrev-ref HEAD` command to get the banch name. This value is then passed through `grep`, which filters for lines that contain the string "feature" and ignores case with the `-i` flag. The `tr` command then converts any uppercase characters to lowercase.

```bash
BRANCH_PREFIX=$(git rev-parse --abbrev-ref HEAD | grep -Eoi '^(feature)' | tr "[:upper:]" "[:lower:]")
```

The `IS_AUTOMATED_GIT_MESSAGE` is used to identify if the message was auto-generated by git, such as merge commit messages (_Merge 'branch name' into ..._).

```bash
REGEX="(Merge branch '|Merge pull request #)"
IS_AUTOMATED_GIT_MESSAGE=$([[ $MESSAGE =~ $REGEX ]] && echo "true" || echo "false")
```

Finally, the last condition will define some rules for applying the prefix in the message:
- the current branch should be a feature branch
- the message should not be an auto-generated by git
- the current branch should follow a name convention for a ticket branch e.g., feature/&lt;ticket&gt;-&lt;number&gt;
- the message should not contain the ticket identifier e.g., if the message was already given a ticket number then the prefix will not happen (_git commit -m "ABC-123: Inital commit"_)

```bash
if [[ $BRANCH_PREFIX != "feature" || $IS_AUTOMATED_GIT_MESSAGE = true || $TICKET == "" || "$MESSAGE" == "$TICKET"* ]];then
  exit 0;
fi
```

You might want to adjust some of the logic like regex expression or the `if` condition, and mainly the appended message to fit your requirements.

### Conclusion

In conclusion, using git hooks can greatly improve the efficiency and organization of your version control workflow. The prepare-commit-msg hook is just one example of the powerful automation capabilities that git hooks offer. By leveraging these tools, you can save time and effort on tasks such as prefixing commit messages with ticket numbers or enforcing commit message guidelines for your team.

Git hooks can be used to automate a wide range of tasks, from running tests and linting code to deploying code changes. With the ability to customize your git hook scripts, the possibilities are endless. These hooks can greatly improve the value of your project by streamlining your workflow and ensuring that best practices are followed. Don't hesitate to explore the potential of git hooks and see how they can benefit your team.