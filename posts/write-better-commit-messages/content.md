---
title: Write Better Commit Messages
slug: write-better-commit-messages
description: A specification for adding human and machine-readable meaning to commit messages
release_date: '2021-02-26'
image: https://raw.githubusercontent.com/gasscoelho/blog-posts/main/posts/write-better-commit-messages/git-tree.jpg
---

## Introduction

If you don't care about writing good commit messages or just don't think that's important, it's probably because you had never spent a lot of time trying to find a commit using the git log command or related tools. You also may think there is no reason to worry about that because you work alone, or maybe because it's a personal project, but what happens when you work with a team or contribute to open-source projects, or simply needs to find an old commit?

In general, good commit messages are important not only for others who may be collaborating on the project but also for you, to keep track of all commits and to be aware of what were the changes made so far in the project. 

The commit message needs to be semantic, because these are categorized into meaningful types, indicating the essence of the commit., and it needs to be conventional because these are formatted by a consistent structure and well-known types for both developers and tools.

Most programming languages have well-established conventions, in this post, I'll address the Angular commit messages. But keep in mind you can use it in any programming language.

## Commit Structure

The commit message should be structured as follow:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

It consists of three parts: **header**, **body**, and **footer**.

**header**: required line that simply describes the purpose of the change. It's composed by:

- Type: a short prefix that represents the type of the change
- Scope: optional information (attached to the prefix) that represents the context of the change
- Description: represents a concise description of the actual change

**body**: optional line that introduces the motivation behind the changes or just describing slightly more detailed information.

**footer**: optional line that mentions consequences that stems from the change, such as announcing a breaking change, linking closed issues, mentioning contributors and etc.

## Common Types

### 👷‍♂️ build

The build type (formerly known as chore) is used to identify **development** changes related to the build system (involving scripts, configurations, or tools) and package dependencies. (ex: bump a dependency in _package.json_)

### 💚 ci

The ci type is used to identify **development** changes related to the continuous integration configuration files and scripts.

### 📝 docs

The docs type is used to identify documentation changes related to the project. (ex: changes in README.md)

### ✨ feat

The feat type is used to identify **production** changes related to new backward-compatible abilities or functionality. (ex: add a new feature)

### 🐛 fix

The fix type is used to identify **production** changes related to backward-compatible bug fixes. (ex: fix a bug)

### ⚡ perf

The perf type is used to identify **production** changes related to backward-compatible performance improvements. (ex: code change that improves performances)

### ♻ refactor

The refactor type is used to identify **development** changes related to modifying the codebase, which neither adds a feature nor fixes a bug. (ex: removing redundant code, simplifying the code, renaming variables, etc.)

### 🎨 style

The style type is used to identify **development** changes related to styling the codebase, regardless of the meaning. (ex: indentations, semi-colons, quotes, trailing commas, etc.)

### ✅ test

The test type is used to identify **development** changes related to tests. (ex: adding missing tests or correcting existing tests)

## Alternatives

Nowadays companies tend to use task management tools (such as [Jira](https://www.atlassian.com/software/jira), [TFS/Azure DevOps](https://www.atlassian.com/software/jira)) to keep track of the work. Usually, the task is described in tickets containing all the clarifications about the requirements. Each ticket will have a unique ID that can be used in our commit messages. Let's say you were assigned to a ticket with an ID of **ABC-123**, when the time to commit your changes comes, use that ID as the scope of your message, for example:

_ABC-123: Create a provider to send email notifications_<br></br>
_ABC-123: Remove filter for the Client object_

This will help you and your team to keep track of the publishes that are happening in the version control system.

## Why Use Conventional Commits

<br></br>
- Automatically generating CHANGELOGs.
- Automatically determining a semantic version bump (based on the types of commits landed).
- Communicating the nature of changes to teammates, the public, and other stakeholders.
- Triggering build and publish processes.
- Making it easier for people to contribute to your projects, by allowing them to explore a more structured commit history.

## Bonus

Attaching Emojis to the commit message might improve the readability even more.  Check it out [Gitmoji](https://gitmoji.dev/), an emoji guide for your commit messages.

Work with a team and want to implement the standardization of commit messages? You can do that with a combination of [husky](https://github.com/typicode/husky), [commitlint](https://github.com/conventional-changelog/commitlint), and [commitizen](https://github.com/commitizen/cz-cli)!

## Conclusion

Improving your commit messages will not help only you but also other developers who will be working on the project. In general, it will make you a better collaborator.