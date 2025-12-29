---
description: Run validation agents after implementing features
---

# Validate Recent Changes

Run dev-ops and db-ops agents **in parallel** to validate recent code changes.

## Instructions

Execute both agents simultaneously:

### dev-ops Agent

- Run `pnpm check` to auto-fix formatting and lint issues
- Run `pnpm test` to validate changes
- Run `pnpm build` to ensure production build works
- Report any errors with specific file paths and line numbers

### db-ops Agent

- Check `src/db/schema.ts` for any pending schema changes
- If schema was modified, run `pnpm db:generate` to create migrations
- Report migration status and any actions needed

## Expected Output

Provide a summary table:

| Agent   | Check          | Status               |
| ------- | -------------- | -------------------- |
| dev-ops | Format & Lint  | Pass/Fail            |
| dev-ops | Tests          | Pass/Fail/Skipped    |
| dev-ops | Build          | Pass/Fail            |
| db-ops  | Schema Changes | Yes/No               |
| db-ops  | Migrations     | Generated/Not Needed |

Report any failures with actionable details.
