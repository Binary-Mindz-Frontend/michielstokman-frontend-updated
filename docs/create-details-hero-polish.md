# Create / details hero — polish backlog

Shipped in the first pass: public identity fields on create, cover generate-or-upload on create (dashboard Artwork stays), AI `hero_hook`, details hero stack + hook.

These items can wait. They are visual or cleanup, not data.

## Cover collage tape

The client details mock shows tape stickers on the artwork:

- REAL STORIES.
- REAL PEOPLE.
- REAL TRANSFORMATION.

Not implemented. Add overlay assets on the details cover (and possibly listing cards) to match the mock.

## Details hero layout fidelity

Current hero uses the edo title, hearts, and cover column. Closer match to the screenshot:

- Brush-stroke title treatment vs edo display type
- Identity stack typography (italic, stacked, accent red)
- Heart / collage decoration placement
- Hook paragraph length and measure

## Hook length and tone

`hero_hook` is a 2–4 sentence juicy excerpt from the finished story. Tune the prompt if hooks are too short, too long, or too tame compared to the mock paragraph.

## Unused create-form code

- `UnifiedStoryForm` is not mounted on `/create`
- `CreateFormCategoryTabs` is unused
- `UnifiedStoryFormSkeleton` still describes the old single-page form

Delete or re-point after the new wizard is stable.

## Dashboard identity display

Member story detail (`/user-dashboard/stories/[id]`) does not yet show name, location, gender, occupation, age. Public details does. Add a compact identity block when useful for the author.
