---
description: Run validation agents after implementing features
---

# Validate Recent Changes

Run dev-ops, db-ops, and arch-check agents **in parallel** to validate recent code changes.

## Instructions

Execute all three agents simultaneously:

### dev-ops Agent

- Run `pnpm check` to auto-fix formatting and lint issues
- Run `pnpm test` to validate changes
- Run `pnpm build` to ensure production build works
- Report any errors with specific file paths and line numbers

### db-ops Agent

- Check `src/db/schema.ts` for any pending schema changes
- If schema was modified, run `pnpm db:generate` to create migrations
- Report migration status and any actions needed

### arch-check Agent

- Validate data fetching patterns (must use `createServerFn()` + custom hook, not local state + useEffect)
- Check page headings (main pages need `<h1>` with `font-display`)
- Verify import conventions (use `@/*` aliases, not deep relative imports)
- Check font usage conventions
- Report violations with file paths and suggested fixes

## Expected Output

Provide a summary table:

| Agent      | Check              | Status               |
| ---------- | ------------------ | -------------------- |
| dev-ops    | Format & Lint      | Pass/Fail            |
| dev-ops    | Tests              | Pass/Fail/Skipped    |
| dev-ops    | Build              | Pass/Fail            |
| db-ops     | Schema Changes     | Yes/No               |
| db-ops     | Migrations         | Generated/Not Needed |
| arch-check | Data Fetching      | Pass/Fail            |
| arch-check | Page Headings      | Pass/Fail            |
| arch-check | Import Conventions | Pass/Fail            |
| arch-check | Font Usage         | Pass/Fail            |

Report any failures with actionable details.
