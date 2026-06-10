# BOLT RULES - Dalil Tounes

## Supabase Protection Rules

1. **NEVER modify `.env`** - The `.env` file contains the Bolt sandbox URL (`cmfdcwptbkwzcqwjqxfd`) which is intentionally ignored by the app. Do not change it.

2. **NEVER modify `src/lib/supabaseClient.ts`** - This file contains the production guard (`isCorrectProject`) that ensures the app always connects to the production database `kmvjegbtroksjqaqliyv`. Do not remove, bypass, or simplify this guard.

3. **NEVER modify Supabase URLs or keys** - The hardcoded production credentials in `supabaseClient.ts` (lines 3-4) are the single source of truth.

4. **NEVER replace the production database `kmvjegbtroksjqaqliyv`** - All app data (1934+ businesses) lives here. Any other Supabase instance is empty.

5. **NEVER use `cmfdcwptbkwzcqwjqxfd` as a data source** - This is the Bolt sandbox instance. It contains no production data. If this URL appears in any code path that serves data to the UI, it must be removed immediately. Treat it as a negative signal.

6. **NEVER modify `BusinessCard.tsx` without explicit user validation** - This is the core card component used on the Home page and many other pages. Any visual change must be approved before implementation.

## Component Protection Rules

- Do not create new card component variants without explicit approval.
- Do not rename, move, or restructure existing card components.
- Do not change the data source (Supabase table, columns, or filters) of any existing page without explicit approval.

## Workflow

- Always audit before modifying.
- Always confirm the proposed change with the user before coding.
- Always run `npm run build` after any change.
- Never assume a column exists in production - verify first.
