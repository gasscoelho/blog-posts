---
title: Write Better Commit Messages
slug: write-better-commit-messages
description: A specification for adding human and machine-readable meaning to commit messages
release_date: '2021-02-26'
image: https://raw.githubusercontent.com/gasscoelho/blog-posts/main/posts/write-better-commit-messages/git-tree.jpg
---

## Introduction

If you don't care about writing good commit messages or just don't think that's important, it's probably because you had never spent a lot of time trying to find a commit using the `git log` command or related tools. You might think there's no reason to worry about it if you work alone, or if it's a personal project, but what happens when you work with a team or contribute to open-source projects, or simply needs to find an old commit?

To better highlight the importance of commit messages, below are a few points that describe few difficults when the messages are not well-written:
- Others (especially new team members) may have difficulty understanding the purpose of a commit and how it fits int othe overall project.
- It may be harder to understand the evolution of a project over time, because the commit messages don't provide a clear context of the changes that were made.
- It might be harder to find a commit that introduced a particular bug since the commit messsage provided don't give enough context.

In general, good commit messages are important not only for others who may be collaborating on the project but also for you, to keep track of all commits and to be aware of what were the changes made so far in the project. 

The commit message needs to be semantic, because these are categorized into meaningful types, indicating the essence of the commit., and it needs to be conventional because these are formatted by a consistent structure and well-known types for both developers and tools.

Most programming languages have well-established conventions, in this post, I'll address the Angular commit messages. But keep in mind that these principles can be applied to commit messages in any programming language.

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
- Description: a concise description of the change being made

**body**: optional line that introduces the motivation behind the changes or just describing slightly more detailed information.

**footer**: optional line that mentions consequences that stems from the change, such as announcing a breaking change, linking closed issues, mentioning contributors and etc.

Below are some examples on how to use them:

```text
feat(authentication): add support for OAuth2

This change adds support for OAuth2 authentication to the application. This allows users to log in using their Google, Facebook, or other OAuth2 provider accounts, in addition to the existing username/password login option.

See #456 for more details
```

```text
chore: update dependency versions

This change updates the versions of several dependencies in the project. The updates include security and bug fix patches, as well as some performance improvements.

BREAKING CHANGE: this change introduces a breaking change to the API. Please see the documentation for more information.
```

## Common Types

### 👷‍♂️ build

The build type (formerly known as chore) is used to identify **development** changes related to the build system (involving scripts, configurations, or tools) and package dependencies. (ex: bump a dependency in _package.json_)

```text
build: bump dependency versions in package.json
```

### 💚 ci

The ci type is used to identify **development** changes related to the continuous integration configuration files and scripts.

```text
ci: update Travis CI configuration
```

### 📝 docs

The docs type is used to identify documentation changes related to the project. (ex: changes in README.md)

```text
docs: update README with installation instructions
```

### ✨ feat

The feat type is used to identify **production** changes related to new backward-compatible abilities or functionality. (ex: add a new feature)

```text
feat: add support for filtering search results
```

### 🐛 fix

The fix type is used to identify **production** changes related to backward-compatible bug fixes. (ex: fix a bug)

```text
fix: repair broken image links on user profile page

This change addresses an issue where the user profile page was displaying broken image links for some users. The issue was caused by a bug in the code that was generating the links, which has now been repaired.

Closes #234
```

### ⚡ perf

The perf type is used to identify **production** changes related to backward-compatible performance improvements. (ex: code change that improves performances)

```text
perf: optimize SQL query for customer data analysis

This change optimizes the SQL query used for customer data analysis by adding indexes to the relevant tables and reworking the query structure to take advantage of these indexes. The optimization reduces the runtime of the query by approximately 50%, allowing for faster analysis of customer data.
```

### ♻ refactor

The refactor type is used to identify **development** changes related to modifying the codebase, which neither adds a feature nor fixes a bug. (ex: removing redundant code, simplifying the code, renaming variables, etc.)

```text
refactor: improve error handling in API route
```

### 🎨 style

The style type is used to identify **development** changes related to styling the codebase, regardless of the meaning. (ex: indentations, semi-colons, quotes, trailing commas, etc.)

```text
style: update naming conventions for database tables
```

### ✅ test

The test type is used to identify **development** changes related to tests. (ex: adding missing tests or correcting existing tests)

```text
test: add integration tests for data pipeline

This change adds integration tests for the data pipeline to ensure that data is being correctly extracted, transformed, and loaded into the target database. The tests cover a variety of scenarios, including handling of invalid input data, edge cases, and performance testing.
```

## Alternatives

Nowadays companies tend to use task management tools (such as [Jira](https://www.atlassian.com/software/jira), [TFS/Azure DevOps](https://www.atlassian.com/software/jira)) to keep track of the work. Usually, the task is described in tickets containing all the clarifications about the requirements. Each ticket will have a unique ID that can be used in our commit messages. Let's say you were assigned to a ticket with an ID of **ABC-123**, when the time to commit your changes comes, use that ID as the scope of your message, for example:

_CORGI-34: add support for internationalization_<br></br>
_CORGI-109: optimize database query for improved performance_

This will help you and your team to keep track of the publishes that are happening in the version control system.

Last but not least, you can also use emojis in commit messages to improve readability and quickly understand the purpose of a commit. Using emojis can also help to standardize commit messages within a team or project. For choosing the right emoji, [Gitmoji](https://gitmoji.dev/) is a helpful resource that provides a guide specifically for commit messages with emojis.

## Why Use Conventional Commits

<br></br>
- **Automatically generating CHANGELOGs**: Conventional commit messages follow a standardized structure, which makes it easier for tools to parse and understand the messages. This allows tools like conventional-changelog to automatically generate a CHANGELOG for a project based on the commit messages. This can save time and effort compared to manually writing and maintaining a CHANGELOG.
- **Automatically determining a semantic version bump**: The semantic versioning system uses a version number of the form MAJOR.MINOR.PATCH, where each part represents a different level of change. By following a convention for commit messages, it's possible for tools to automatically determine the appropriate level of version bump based on the types of changes that were made. For example, a commit with a feat type might trigger a MINOR version bump, while a commit with a fix type might trigger a PATCH version bump.
- **Communicating the nature of changes**: By following a standardized structure for commit messages, it's easier for developers (and other stakeholders) to quickly understand the purpose and context of a commit. This can be especially helpful when working with a large codebase or when working on a team with many contributors.
- **Triggering build and publish processes**: Some teams use continuous integration (CI) systems to automatically build and test code changes. By including certain keywords or types in commit messages, it's possible to trigger these CI processes based on the nature of the changes. For example, a commit with a release type might trigger a release build and publish process.
- **Making it easier for people to contribute**: By following a standardized structure for commit messages, it's easier for new contributors (or even just casual observers) to understand the history of a project and how it has evolved over time. This can make it easier for people to understand the context of a change and how it fits into the overall project.

## Conclusion

To summarize, improving your commit messages will not help only you but also other developers who will be working on the project. In general, it will make you a better collaborator.