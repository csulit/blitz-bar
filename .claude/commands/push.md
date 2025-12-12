---
description: Push commits to remote repository with safety checks
argument-hint: (optional) --force for force push
---

# Push to Remote Repository

Push the current branch to the remote repository safely.

## Instructions

Based on the user's request "$ARGUMENTS", perform a safe git push:

1. **Pre-push checks:**
   - Run `git status` to check for uncommitted changes
   - Run `git log origin/$(git branch --show-current)..HEAD` to see unpushed commits

2. **Handle uncommitted changes (do NOT ask, just do it):**
   - If there are uncommitted changes, automatically run `git add .`
   - Generate a concise commit message by analyzing the staged changes with `git diff --cached --stat`
   - Create the commit WITHOUT any "Co-Authored-By" or "Generated with Claude" lines
   - Keep commit messages clean and professional

3. **Safety rules:**
   - NEVER force push to `main` or `master` unless explicitly confirmed by user
   - If "--force" argument provided, confirm with user before using `git push --force`

4. **Push execution:**
   - If branch has no upstream, use `git push -u origin <branch>`
   - Otherwise use `git push`

5. **Post-push:**
   - Show the result of the push concisely

## Example Commands

- `/push` - Push current branch
- `/push --force` - Force push (with confirmation)
