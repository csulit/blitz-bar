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
   - Verify the current branch tracks a remote

2. **Safety rules:**
   - NEVER force push to `main` or `master` unless explicitly confirmed by user
   - Warn if pushing to a protected branch
   - If there are uncommitted changes, ask if user wants to commit first

3. **Push execution:**
   - If branch has no upstream, use `git push -u origin <branch>`
   - Otherwise use `git push`
   - If "--force" argument provided, confirm with user before using `git push --force`

4. **Post-push:**
   - Show the result of the push
   - Display the remote URL for the branch if applicable

## Example Commands

- `/push` - Push current branch
- `/push --force` - Force push (with confirmation)
