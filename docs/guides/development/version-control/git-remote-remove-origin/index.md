---
slug: git-remote-remove-origin
title: "How to Remove a Remote Git"
title_meta: "Guide to Removing Git Remote"
description: 'How to remove a Git remote from a repository.'
keywords: ['git remote remove origin','git remove remote','git remove origin','git delete remote','git remove upstream','remove remote origin','remove remote git','how to remove remote origin git','git remote delete','git remove remote repository']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Martin Heller"]
published: 2023-05-02
modified_by:
  name: Linode
external_resources:
- '[DelftStack: Remove a Git Remote URL](https://www.delftstack.com/howto/git/how-to-remove-a-git-remote-url/)'
- '[Stack Overflow: How to remove remote origin from a Git repository](https://stackoverflow.com/questions/16330404/how-to-remove-remote-origin-from-a-git-repository)'
- '[GitHub Docs: Managing remote repositories](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)'
---

A remote Git repository can be on a server, a Git cloud service (such as GitHub, GitLab, or Bitbucket), or on another developer's machine. That enables many possible workflows for teams. One common workflow involves using a server repository as the "authorized" repository. Only reviewed, well-tested code is committed to it, often through a pull request issued from a developer's repository.

## What is a Git Remote?

A Git remote simply references a remote repository. Typically, there is at least one Git remote in a repository, named *origin*. Sometimes there are additional Git remotes in a repository, for example *upstream*. The term upstream generally refers to a repository from which another repository is derived, usually by cloning.

Create a remote in a local repository using the `git remote add` command, for example:

```command
git remote add origin https://github.com/user/repo.git
```

In this example, the first parameter, `origin`, is the name of the remote. The second parameter, `https://github.com/user/repo.git`, is the URL of the remote repository.

List the remotes in a repository using the `git remote -v` command, where the `-v` flag is short for `--verbose`. This instructs the `git remote` command to include the remote URL in the list. For example, use the `git remote -v` command in a folder containing the TensorFlow repository:

```command
cd repos/tensorflow/
git remote -v
```

This produces output such as:

```output
origin	https://github.com/tensorflow/tensorflow.git (fetch)
origin	https://github.com/tensorflow/tensorflow.git (push)
```

## How to Remove a Git Remote

There are three steps to remove a Git remote, with an optional verification step to confirm the removal.

1.  First, open a terminal and change into the directory that holds your repository:

    ```command
    cd repos/tensorflow/
    ```

1.  Second, list the remotes:

    ```command
    git remote -v
    ```

    ```output
    origin	https://github.com/tensorflow/tensorflow.git (fetch)
    origin	https://github.com/tensorflow/tensorflow.git (push)
    ```

1.  Third, remove the remote/s:

    ```command
    git remote rm origin
    ```

    In current versions of Git there are two forms of the command to remove a remote:  `rm` and `remove`. The `rm` form goes back to the early versions of Git, while the `remove` form was later added as an alias to help Windows users.

    {{< note >}}
The `git remote rm` command simply removes the entries for the remote repository from the `.git/config` file. It does not affect the actual remote repository. There is no need to worry about deleting the remote repository on the server as that cannot be done from a local Git command.
    {{< /note >}}

    There’s only one possible error message after issuing a `git remote rm` command:

    ```output
    fatal: No such remote: '<remote-name>'.
    ```

1.  A fourth, optional step is to confirm that step three worked by repeating step two:

    ```command
    git remote -v
    ```

    This time, the removed remotes should not show up in the list. If all remotes were deleted, there is no output.

{{< note >}}
Alternatively, removing a remote and adding a new remote can be accomplished in one step using the `git remote set-url` command, for example:

```command
git remote set-url origin git@github.com:<github-username>/<repository-name>.git
```
{{< /note >}}

To test this without modifying an established repository, create a new test repository on a Git hosting service (e.g. GitHub). Clone the new test repository to your local machine, then repeat the steps above in the cloned repository. A repository containing nothing but a small **README.md** suffices.

## Conclusion

To summarize, create a remote in a local repository using the `git remote add` command. List remotes using the `git remote -v` command, and remove them using the `git remote rm` command. This easy three- or four-step sequence for removing a remote is immensely helpful for anyone working with Git.