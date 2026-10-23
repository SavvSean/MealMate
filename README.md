# MealMate — Market Station Update

A frontend-only update to the existing **Papa's-inspired** MealMate with Chef tutorial and Supabase.

## Install without losing your cloud connection

1. Back up your current `MealMate` folder (or make a Git commit).
2. Extract `MealMate_Market_Update.zip`.
3. Copy **`index.html`, `styles.css`, `app.js`, and `onboarding.js`** into your existing project folder, replacing these four files only.
4. **Do NOT replace `config.js`, `cloud.js`, or `schema.sql`.** They are deliberately not included in the update ZIP. No new Supabase schema is needed.
5. From the project folder run `py -m http.server 8000` and open `http://localhost:8000`.
6. Hard-refresh (`Ctrl+Shift+R`). Test adding a grocery and watch for `CLOUD SAVED`.
7. If you use GitHub Pages later, deploy the four updated files alongside your unchanged cloud files.

## What changed in Market

- Default view is **To Buy**, with **Bought** and **All** tabs and counts.
- Search within your current week's groceries.
- New weeks open with a clean shopping basket — **no automatic starter data**.
- On an empty week, a **Load beginner grocery plan** button offers the original 12 items *only if you opt in*.
- **Clear bought** removes checked items after confirmation.
- **Manage this week's list** expands to expose **Mark all as To Buy** and **Empty this week's basket** (also confirmation-protected).
- Budget, pricing, individual edit/delete, copy list, and the original station style all remain.
- Previously saved cloud groceries and test entries stay in place until *you* clear them; the update won't silently delete any.

⚠️ **Cloud caution:** MealMate currently saves one JSON state per account; simultaneous edits from multiple tabs/devices can overwrite each other. Reload one device before editing if you were working on another.

## Rename Chef Miso

Open `onboarding.js` and find near the top:

```js
const CHEF_NAME = 'Miso';
```

Change just `Miso` to any name you prefer, e.g. `const CHEF_NAME = 'Basil';`, save and refresh. The tour's welcome line, accessible mascot description, and nameplate update automatically. No database changes needed.

## Data safety and reminders

- This is not a database migration. The existing `kitchen_state` table and Supabase account data remain the same.
- Clearing items via Market is a real deletion and will sync to your cloud account. Confirmation is required.
- The tutorial's "seen" flag is device-local; after an update, press the **?** button to replay.
- If old placeholder groceries remain, use **Market → Manage this week's list → Empty this week's basket** after confirming you don't need those entries.

## Test checklist

- [ ] Sign in and confirm `CLOUD SAVED`.
- [ ] Existing groceries are visible under To Buy / Bought / All.
- [ ] Check off an item; it moves to Bought.
- [ ] Search for an item and clear your search.
- [ ] Add an item, refresh and confirm it persists.
- [ ] Navigate to an empty week and optionally load starter plan.
- [ ] Press **?** and replay the chef tutorial.
