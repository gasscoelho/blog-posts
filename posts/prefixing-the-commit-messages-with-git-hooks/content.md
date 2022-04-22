---
title: Prefixing the Commit Messages with Git Hooks
slug: prefixing-the-commit-messages-with-git-hooks
description: Automate your commit messages with hooks
release_date: '2022-04-16'
image: https://raw.githubusercontent.com/gasscoelho/blog-posts/main/posts/prefixing-the-commit-messages-with-git-hooks/hook-wall.jpg
image_credits: Photo by <strong><a target="_blank" rel="noopener noreferrer" href="https://unsplash.com/@hdbernd?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Bernd Dittrich</a></strong> on <strong><a target="_blank" rel="noopener noreferrer" href="https://unsplash.com/s/photos/hook?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></strong>
---

When working on projects it’s really common to have a tool to manage your tasks. With that in mind, you might get asked to prefix your commit messages using the ticket number — which by the way, it’s an excellent practice because makes it easier to track commits in the future.

But imagine the pain to do it for every commit? Maybe you forget to prefix and will have to use a "git amend" to edit your message or even a "git rebase" depending on the scenario. 

In this post, you will learn how to automate this process with Git hook.

## What are Git Hooks?

Git hooks are shell scripts that are automatically executed before or after an event such as commit or push. With hooks, you are able to customize some git features by triggering custom actions.

Here are some of the most used hooks:

- **pre-commit:** executed every time when you do a `git commit`. This is useful to run your application tests before committing or to check for spelling errors.
- **prepare-commit-msg**: executed after the `pre-commit` hook to edit the text editor with a commit message. This is useful to automatically edit the user’s commit message.
- **commit-msg:** pretty similar to the `prepare-commit-msg` hook but it’s called after the user enters a commit message. This is useful to let the user knows if its message doesn’t follow your team’s standards.
- **post-commit:** executed right after the `commit-msg` hook and it’s mainly used for notifications purposes, like sending an email.

> Click [here](https://git-scm.com/docs/githooks) to see the list of all the available hooks in git.

## Using prepare-commit-msg hook

Git provides a couple of examples for the hooks as soon as the repository is initialized. You can find the samples under the `.git/hooks` folder — Keep in mind this is a hidden folder so you might need to adjust your settings to be able to see it.

Considering that the branch name will contain the ticket number, you will set up the `prepare-commit-msg` hook to append the id for you.

As explained before, this hook it’s an executable file that Git will call right after the commit. It takes a single argument — the filename that contains the commit message.

Behind the scenes Git will do something like this:

```bash
$ .git/hooks/prepare-commit-msg .git/COMMIT_EDITMSG
```

_You don’t need to worry about that command, it's just to help you to understand the final code that will be shown in this post._

Before getting the sample code, go to the `.git/hooks` and rename the `prepare-commit-msg.sample` to just `prepare-commit-msg` — if you wish, you can create a copy first and leave the `.sample` version as a backup.

### Sample code

*.git/hooks/prepare-commit-msg*

```bash
#!/bin/sh
FILE=$1
MESSAGE=$(cat $FILE)
TICKET=$(git rev-parse --abbrev-ref HEAD | grep -Eo '^(\w+(\/|-))?(\w+[-_])?[0-9]+' | grep -Po '(?<=\/|_|-).*' | tr "[:lower:]" "[:upper:]")

if [[ $TICKET == "" || "$MESSAGE" == "$TICKET"* ]];then
  exit 0;
fi

echo "$TICKET: $MESSAGE" > $FILE
```

### Understanding the code

The `$1` will take the first argument (in this case `.git/COMMIT_EDITMSG`) and save it in the `FILE` variable.

```bash
FILE=$1
```

The `cat $FILE` will get the output of the `.git/COMMIT_EDITMSG` file and save it in the `MESSAGE` variable. — in other words, the variable will receive the commit message.

```bash
MESSAGE=$(cat $FILE)
```

The `TICKET` variable is a little more complex because it involves a combination of a few commands in order to get the ticket number. 

```bash
TICKET=$(git rev-parse --abbrev-ref HEAD | grep -Eo '^(\w+(\/|-))?(\w+[-_])?[0-9]+' | grep -Po '(?<=\/|_|-).*' | tr "[:lower:]" "[:upper:]")
```

So let’s split it into 3 parts:

1. The first part uses a command to retrieve the current branch. So consider you are working at `feature/xyz-1234` — the command below would return `feature/xyz-1234`

```bash
git rev-parse --abbrev-ref HEAD
```

2. The second part uses two `grep` commands to retrieve the ticket number from the branch name.
Some helpful information:
   1. `grep` is a Linus and Unix command. It is used to search text and strings in a given file.
   2. The `E` parameter is used to interpret a Regex expression and the `o` parameter to print out only what is matched. Note that you can append them and use them like `-Eo`.
   3. Note that in the second `grep` command is using the `P` parameter, which makes grep use the Perl dialect, otherwise you'd probably need to escape the parentheses. — Also this was just required because of the `Positive lookbehind` regex expression that is being used. 
    
   Since the goal of this post is not to dive into regex, I will skip the throughout explanation about them but keep in mind the first group of regex is used to remove unwanted patterns from the branch name and the second group is responsible to retrieve only the ticket number that will come after the `/`, `-`, or `_` characters.
    
    ```markdown
    # Regex1
    command: grep -Eo '^(\w+(\/|-))?(\w+[-_])?[0-9]+'
    result:  feature/xyz-1234-v2 will output feature/xyz-1234
    
    # Regex2
    command: grep -Po '(?<=\/|_|-).*'
    result:  feature/xyz-1234 will output xyz-1234
    ```
    
    In case you want to test/study the regex expressions used in this example, I’d recommend visiting an [online regex](https://regexr.com/) site and testing the two groups to see how they behave. 
    
    Here are some branch names example you can use:
    
    ```
    feature-xyz-1234
    bugfix/xyz-5678
    feature/ABCD-10
    release/ABCD-10
    feature/ABCD-11-v2
    feature/ABCD-11-new
    feature/xyz-5679-update-client-obj
    feature/add-docs
    feature/change-system-color
    ```
    
2. The `tr` command in UNIX is a command-line utility for translating or deleting characters. In this example, I’m converting from lower to upper case.

```markdown
tr "[:lower:]" "[:upper:]"
```

After that, there’s the condition to avoid:

- a redundant ticket number in case the user manually append it in the commit message.
- edit the commit message file in case no Ticket number is found in the commit message.

```bash
if [[ $TICKET == "" || "$MESSAGE" == "$TICKET"* ]];then
  exit 0;
fi
```

Be aware you might adjust some of the logic — like regex expression or if the condition or even the appended message to fit your requirements
