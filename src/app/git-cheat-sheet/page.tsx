"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface GitCommand {
  command: string;
  description: string;
  example: string;
}

interface GitSection {
  title: string;
  entries: GitCommand[];
}

const sections: GitSection[] = [
  {
    title: "Setup & Config",
    entries: [
      { command: "git config --global user.name \"Name\"", description: "Set your global username for commits", example: "git config --global user.name \"John Doe\"" },
      { command: "git config --global user.email \"email\"", description: "Set your global email for commits", example: "git config --global user.email \"john@example.com\"" },
      { command: "git config --list", description: "List all Git configuration settings", example: "git config --list" },
      { command: "git config --global core.editor \"code\"", description: "Set default text editor for Git", example: "git config --global core.editor \"vim\"" },
      { command: "git config --global init.defaultBranch main", description: "Set default branch name for new repos", example: "git config --global init.defaultBranch main" },
      { command: "git config --global alias.<name> \"<cmd>\"", description: "Create a shortcut alias for a Git command", example: "git config --global alias.co \"checkout\"" },
    ],
  },
  {
    title: "Creating Repos",
    entries: [
      { command: "git init", description: "Initialize a new Git repository in the current directory", example: "cd my-project && git init" },
      { command: "git init <directory>", description: "Create a new repo in the specified directory", example: "git init my-new-project" },
      { command: "git clone <url>", description: "Clone a remote repository to your local machine", example: "git clone https://github.com/user/repo.git" },
      { command: "git clone <url> <directory>", description: "Clone a repo into a specific folder name", example: "git clone https://github.com/user/repo.git my-folder" },
      { command: "git clone --depth 1 <url>", description: "Shallow clone with only the latest commit", example: "git clone --depth 1 https://github.com/user/repo.git" },
      { command: "git clone --branch <branch> <url>", description: "Clone a specific branch from a repository", example: "git clone --branch develop https://github.com/user/repo.git" },
    ],
  },
  {
    title: "Basic Snapshotting",
    entries: [
      { command: "git add <file>", description: "Add a file to the staging area", example: "git add index.html" },
      { command: "git add .", description: "Stage all changes in the current directory", example: "git add ." },
      { command: "git add -A", description: "Stage all changes including deletions", example: "git add -A" },
      { command: "git add -p", description: "Interactively stage parts of files (hunks)", example: "git add -p" },
      { command: "git commit -m \"<message>\"", description: "Commit staged changes with a message", example: "git commit -m \"Add login feature\"" },
      { command: "git commit -am \"<message>\"", description: "Stage tracked files and commit in one step", example: "git commit -am \"Fix typo in header\"" },
      { command: "git commit --amend", description: "Modify the most recent commit", example: "git commit --amend -m \"Updated commit message\"" },
      { command: "git status", description: "Show the working tree status", example: "git status" },
      { command: "git status -s", description: "Show status in short format", example: "git status -s" },
      { command: "git diff", description: "Show unstaged changes in working directory", example: "git diff" },
      { command: "git diff --staged", description: "Show changes staged for the next commit", example: "git diff --staged" },
      { command: "git diff <branch1> <branch2>", description: "Show differences between two branches", example: "git diff main develop" },
      { command: "git rm <file>", description: "Remove a file from tracking and working directory", example: "git rm old-file.txt" },
      { command: "git rm --cached <file>", description: "Remove a file from staging but keep it locally", example: "git rm --cached secrets.env" },
      { command: "git mv <old> <new>", description: "Rename or move a file and stage the change", example: "git mv old-name.js new-name.js" },
    ],
  },
  {
    title: "Branching & Merging",
    entries: [
      { command: "git branch", description: "List all local branches", example: "git branch" },
      { command: "git branch -a", description: "List all local and remote branches", example: "git branch -a" },
      { command: "git branch <name>", description: "Create a new branch", example: "git branch feature-login" },
      { command: "git branch -d <name>", description: "Delete a branch (safe, prevents unmerged deletion)", example: "git branch -d feature-login" },
      { command: "git branch -D <name>", description: "Force delete a branch even if unmerged", example: "git branch -D experimental" },
      { command: "git branch -m <new>", description: "Rename the current branch", example: "git branch -m new-branch-name" },
      { command: "git checkout <branch>", description: "Switch to an existing branch", example: "git checkout develop" },
      { command: "git checkout -b <branch>", description: "Create and switch to a new branch", example: "git checkout -b feature-signup" },
      { command: "git switch <branch>", description: "Switch to an existing branch (modern)", example: "git switch develop" },
      { command: "git switch -c <branch>", description: "Create and switch to a new branch (modern)", example: "git switch -c feature-dashboard" },
      { command: "git merge <branch>", description: "Merge a branch into the current branch", example: "git merge feature-login" },
      { command: "git merge --no-ff <branch>", description: "Merge with a merge commit even if fast-forward possible", example: "git merge --no-ff feature-login" },
      { command: "git merge --abort", description: "Abort an in-progress merge and restore pre-merge state", example: "git merge --abort" },
      { command: "git rebase <branch>", description: "Reapply commits on top of another base branch", example: "git rebase main" },
      { command: "git rebase --abort", description: "Abort an in-progress rebase", example: "git rebase --abort" },
      { command: "git rebase --continue", description: "Continue rebase after resolving conflicts", example: "git rebase --continue" },
      { command: "git cherry-pick <commit>", description: "Apply a specific commit to the current branch", example: "git cherry-pick a1b2c3d" },
    ],
  },
  {
    title: "Sharing & Updating",
    entries: [
      { command: "git remote -v", description: "List all remote repositories with URLs", example: "git remote -v" },
      { command: "git remote add <name> <url>", description: "Add a new remote repository", example: "git remote add origin https://github.com/user/repo.git" },
      { command: "git remote remove <name>", description: "Remove a remote repository", example: "git remote remove origin" },
      { command: "git remote rename <old> <new>", description: "Rename a remote repository", example: "git remote rename origin upstream" },
      { command: "git fetch", description: "Download objects and refs from remote without merging", example: "git fetch origin" },
      { command: "git fetch --all", description: "Fetch from all configured remotes", example: "git fetch --all" },
      { command: "git fetch --prune", description: "Fetch and remove deleted remote tracking branches", example: "git fetch --prune" },
      { command: "git pull", description: "Fetch and merge changes from remote branch", example: "git pull origin main" },
      { command: "git pull --rebase", description: "Fetch and rebase instead of merge", example: "git pull --rebase origin main" },
      { command: "git push", description: "Push committed changes to the remote repository", example: "git push origin main" },
      { command: "git push -u <remote> <branch>", description: "Push and set upstream tracking branch", example: "git push -u origin feature-login" },
      { command: "git push --force", description: "Force push (overwrites remote history, use with caution)", example: "git push --force origin feature-branch" },
      { command: "git push --tags", description: "Push all local tags to the remote", example: "git push --tags" },
      { command: "git push <remote> --delete <branch>", description: "Delete a remote branch", example: "git push origin --delete feature-old" },
    ],
  },
  {
    title: "Inspection & Comparison",
    entries: [
      { command: "git log", description: "Show the commit history", example: "git log" },
      { command: "git log --oneline", description: "Show commit history in compact one-line format", example: "git log --oneline" },
      { command: "git log --graph", description: "Show commit history with ASCII branch graph", example: "git log --graph --oneline --all" },
      { command: "git log --author=\"<name>\"", description: "Filter commit history by author", example: "git log --author=\"John\"" },
      { command: "git log -n <number>", description: "Show only the last n commits", example: "git log -n 5" },
      { command: "git log --since=\"<date>\"", description: "Show commits after a specific date", example: "git log --since=\"2024-01-01\"" },
      { command: "git log -p <file>", description: "Show commit history with diffs for a file", example: "git log -p README.md" },
      { command: "git show <commit>", description: "Show details and diff of a specific commit", example: "git show a1b2c3d" },
      { command: "git blame <file>", description: "Show who last modified each line of a file", example: "git blame index.html" },
      { command: "git shortlog -sn", description: "Show commit count per author sorted by count", example: "git shortlog -sn" },
      { command: "git reflog", description: "Show history of HEAD changes (useful for recovery)", example: "git reflog" },
      { command: "git bisect start", description: "Start binary search to find a buggy commit", example: "git bisect start" },
      { command: "git bisect bad", description: "Mark the current commit as bad during bisect", example: "git bisect bad" },
      { command: "git bisect good <commit>", description: "Mark a commit as good during bisect", example: "git bisect good a1b2c3d" },
      { command: "git bisect reset", description: "End the bisect session and return to original branch", example: "git bisect reset" },
    ],
  },
  {
    title: "Stashing",
    entries: [
      { command: "git stash", description: "Save uncommitted changes and clean working directory", example: "git stash" },
      { command: "git stash save \"<message>\"", description: "Stash changes with a descriptive message", example: "git stash save \"work in progress on login\"" },
      { command: "git stash list", description: "List all stashed changesets", example: "git stash list" },
      { command: "git stash pop", description: "Apply the most recent stash and remove it from list", example: "git stash pop" },
      { command: "git stash apply", description: "Apply the most recent stash but keep it in list", example: "git stash apply" },
      { command: "git stash apply stash@{n}", description: "Apply a specific stash by index", example: "git stash apply stash@{2}" },
      { command: "git stash drop", description: "Remove the most recent stash from list", example: "git stash drop" },
      { command: "git stash drop stash@{n}", description: "Remove a specific stash by index", example: "git stash drop stash@{1}" },
      { command: "git stash clear", description: "Remove all stashed entries", example: "git stash clear" },
      { command: "git stash branch <branch>", description: "Create a new branch from a stash", example: "git stash branch feature-from-stash" },
    ],
  },
  {
    title: "Undoing Changes",
    entries: [
      { command: "git restore <file>", description: "Discard changes in working directory (modern)", example: "git restore index.html" },
      { command: "git restore --staged <file>", description: "Unstage a file while keeping changes (modern)", example: "git restore --staged index.html" },
      { command: "git checkout -- <file>", description: "Discard changes in working directory (classic)", example: "git checkout -- index.html" },
      { command: "git reset <file>", description: "Unstage a file while keeping changes", example: "git reset README.md" },
      { command: "git reset --soft HEAD~1", description: "Undo last commit but keep changes staged", example: "git reset --soft HEAD~1" },
      { command: "git reset --mixed HEAD~1", description: "Undo last commit and unstage changes", example: "git reset --mixed HEAD~1" },
      { command: "git reset --hard HEAD~1", description: "Undo last commit and discard all changes", example: "git reset --hard HEAD~1" },
      { command: "git reset --hard <commit>", description: "Reset branch to a specific commit (destructive)", example: "git reset --hard a1b2c3d" },
      { command: "git revert <commit>", description: "Create a new commit that undoes a previous commit", example: "git revert a1b2c3d" },
      { command: "git revert HEAD", description: "Revert the most recent commit", example: "git revert HEAD" },
      { command: "git clean -f", description: "Remove untracked files from working directory", example: "git clean -f" },
      { command: "git clean -fd", description: "Remove untracked files and directories", example: "git clean -fd" },
      { command: "git clean -n", description: "Dry run: show what would be removed", example: "git clean -n" },
    ],
  },
  {
    title: "Tags",
    entries: [
      { command: "git tag", description: "List all tags in the repository", example: "git tag" },
      { command: "git tag <name>", description: "Create a lightweight tag at the current commit", example: "git tag v1.0.0" },
      { command: "git tag -a <name> -m \"<msg>\"", description: "Create an annotated tag with a message", example: "git tag -a v1.0.0 -m \"Release version 1.0.0\"" },
      { command: "git tag -a <name> <commit>", description: "Tag a specific commit", example: "git tag -a v0.9.0 a1b2c3d" },
      { command: "git tag -d <name>", description: "Delete a local tag", example: "git tag -d v1.0.0" },
      { command: "git push origin <tag>", description: "Push a specific tag to remote", example: "git push origin v1.0.0" },
      { command: "git push --tags", description: "Push all local tags to the remote", example: "git push --tags" },
      { command: "git push origin --delete <tag>", description: "Delete a remote tag", example: "git push origin --delete v1.0.0" },
      { command: "git show <tag>", description: "Show information about a tag", example: "git show v1.0.0" },
    ],
  },
];

export default function GitCheatSheet() {
  const [search, setSearch] = useState("");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(sections.map((s) => s.title))
  );

  const filteredSections = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return sections;

    return sections
      .map((section) => ({
        ...section,
        entries: section.entries.filter(
          (entry) =>
            entry.command.toLowerCase().includes(query) ||
            entry.description.toLowerCase().includes(query) ||
            entry.example.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.entries.length > 0);
  }, [search]);

  const totalMatches = useMemo(() => {
    return filteredSections.reduce((sum, s) => sum + s.entries.length, 0);
  }, [filteredSections]);

  const totalCommands = useMemo(() => {
    return sections.reduce((sum, s) => sum + s.entries.length, 0);
  }, []);

  const handleCopy = useCallback(async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    }
  }, []);

  const toggleSection = useCallback((title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedSections(new Set(sections.map((s) => s.title)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  return (
    <ToolLayout
      title="Git Cheat Sheet"
      description="Essential Git commands quick reference. Search, browse, and copy commands for setup, branching, merging, stashing, undoing changes, and more."
      relatedTools={["regex-cheat-sheet", "diff-checker", "slug-generator"]}
    >
      {/* Search input */}
      <div className="mb-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands, descriptions, or examples..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {search
              ? `${totalMatches} ${totalMatches === 1 ? "result" : "results"} found`
              : `${totalCommands} commands across ${sections.length} categories`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:text-blue-200"
            >
              Expand all
            </button>
            <span className="text-xs text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:text-blue-200"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* No results */}
      {filteredSections.length === 0 && (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No commands found</p>
          <p className="mt-1 text-sm">Try a different search term</p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {filteredSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);

          return (
            <div
              key={section.title}
              className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between bg-gray-50 dark:bg-gray-950 px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h2>
                  <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                    {section.entries.length}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Section content */}
              {isExpanded && (
                <div>
                  {/* Desktop table */}
                  <div className="hidden sm:block">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/50">
                          <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                            Command
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                            Description
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                            Example
                          </th>
                          <th className="w-16 px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {section.entries.map((entry, idx) => (
                          <tr
                            key={idx}
                            className="group transition-colors hover:bg-blue-50 dark:bg-blue-950 dark:hover:bg-blue-950/50"
                          >
                            <td className="px-4 py-2.5">
                              <code className="rounded bg-blue-50 dark:bg-blue-950 px-2 py-0.5 font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                                {entry.command}
                              </code>
                            </td>
                            <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">
                              {entry.description}
                            </td>
                            <td className="px-4 py-2.5">
                              <code className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                {entry.example}
                              </code>
                            </td>
                            <td className="px-4 py-2.5">
                              <button
                                onClick={() => handleCopy(entry.command)}
                                className="rounded px-2 py-1 text-xs text-gray-400 dark:text-gray-500 opacity-0 transition-all hover:bg-blue-100 dark:bg-blue-900 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 group-hover:opacity-100"
                                title="Copy command"
                              >
                                {copiedCommand === entry.command ? (
                                  <span className="text-green-600 dark:text-green-400">Copied!</span>
                                ) : (
                                  "Copy"
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-800 sm:hidden">
                    {section.entries.map((entry, idx) => (
                      <div key={idx} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <code className="rounded bg-blue-50 dark:bg-blue-950 px-2 py-0.5 font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                            {entry.command}
                          </code>
                          <button
                            onClick={() => handleCopy(entry.command)}
                            className="shrink-0 rounded px-2 py-1 text-xs text-gray-400 dark:text-gray-500 hover:bg-blue-100 dark:bg-blue-900 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400"
                          >
                            {copiedCommand === entry.command ? (
                              <span className="text-green-600 dark:text-green-400">Copied!</span>
                            ) : (
                              "Copy"
                            )}
                          </button>
                        </div>
                        <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300">
                          {entry.description}
                        </p>
                        <code className="mt-1 block font-mono text-xs text-gray-500 dark:text-gray-400">
                          {entry.example}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What Is Git?
        </h2>
        <p className="mb-3">
          Git is the most widely used distributed version control system in the world.
          Created by Linus Torvalds in 2005 for Linux kernel development, Git tracks
          changes in source code and enables multiple developers to collaborate on
          projects of any size. It is the foundation of platforms like GitHub, GitLab,
          and Bitbucket.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How to Use This Git Cheat Sheet
        </h2>
        <p className="mb-3">
          This cheat sheet organizes essential Git commands into logical categories.
          Use the <strong>search bar</strong> to quickly find any command by name,
          description, or example. Click <strong>Copy</strong> on any command to
          copy it to your clipboard. Expand or collapse sections to focus on the
          commands you need.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Git Workflow Basics
        </h2>
        <p className="mb-3">
          A typical Git workflow involves creating a branch for a new feature
          (<code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">git checkout -b feature</code>),
          making changes, staging them
          (<code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">git add .</code>),
          committing
          (<code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">git commit -m &quot;message&quot;</code>),
          pushing to a remote
          (<code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">git push</code>),
          and then creating a pull request to merge your changes back into the main branch.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Git Branching Strategies
        </h2>
        <p className="mb-3">
          Common branching strategies include <strong>Git Flow</strong> (with develop,
          feature, release, and hotfix branches), <strong>GitHub Flow</strong> (simple
          feature branches merged to main), and <strong>Trunk-Based Development</strong> (short-lived
          branches with frequent merges). Choose the strategy that best fits your
          team size and release cadence.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Tips for Using Git Effectively
        </h2>
        <ul className="mb-3 list-disc space-y-1 pl-5">
          <li>Write clear, descriptive commit messages that explain <em>why</em> a change was made.</li>
          <li>Commit early and commit often &mdash; small commits are easier to review and revert.</li>
          <li>Use branches for every feature, bugfix, or experiment.</li>
          <li>Pull frequently to stay up to date and reduce merge conflicts.</li>
          <li>Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">git stash</code> to save work in progress before switching branches.</li>
          <li>Always review changes with <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">git diff</code> before committing.</li>
          <li>Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">.gitignore</code> to exclude build artifacts, dependencies, and sensitive files.</li>
          <li>Learn <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">git reflog</code> &mdash; it can save you when things go wrong.</li>
        </ul>
      </div>
    </ToolLayout>
  );
}
