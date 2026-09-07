# Publications dashboard - backend requirements

The central publication dashboard (`/dashboard/publications`) is built and reviewable on the
current admin API. This document lists exactly what the backend has to add so the review-only
parts become real. It is the spec for the follow-up backend PR.

Frontend touch points when each item lands:

- `src/lib/publications/capabilities.ts` - flip the action from `draft` to `api`
- `src/lib/publications/adapter.ts` - read the new field instead of deriving it
- `src/lib/publications/status.ts` - read the stored status instead of deriving it
- `src/redux/features/admin/publications/publicationsDraft.slice.ts` - delete once everything is `api`

## 1. Per-asset status columns

`Story` needs the asset statuses the client asked for, so approvals survive a reload and are
visible to every admin rather than one browser session.

```
content_status   enum(missing, pending, in_progress, ready_for_review, approved, rejected)
cover_status     enum(missing, pending, in_progress, ready_for_review, approved, rejected)
voice_status     enum(missing, pending, in_progress, ready_for_review, approved, rejected)
has_no_voice     boolean default false
published_at     timestamptz null
```

`has_no_voice` covers the client's rule that a publication may intentionally ship without audio,
in which case voice must not block publishing.

The UI currently derives all four from `moderation_status`, `cover_image_url` and `audio_path`
in `derivePublicationStatuses`. Once the columns exist, that function reads them directly and the
derivation becomes the fallback for old rows.

## 2. Split approve-content from publish

Today `POST /admin/moderation/story/{id}/approve` sets `moderation_status = approved`, which is
also what exposes the story in the public feed. That means content approval and publication are
the same call, so the three-approval gate cannot be enforced server-side.

Needed:

- `POST /admin/moderation/story/{id}/approve-content` - sets `content_status = approved` only
- `POST /admin/publications/{id}/publish` - rejects unless `content_status`, `cover_status` and
  (`voice_status` or `has_no_voice`) are approved; sets `published_at` and makes the story public

Until then the workspace uses `approve` as the Publish button and keeps content approval local.

## 3. Per-story cover endpoints

The only cover regeneration that exists is the batch job
`POST /admin/stories/regenerate-covers`, which selects by `limit` and `only_missing_or_default`
and has no `story_id`.

Needed:

- `POST /admin/moderation/story/{id}/regenerate-cover` - queues one story, sets
  `cover_status = in_progress`
- `POST /admin/moderation/story/{id}/cover` (multipart `file`) - replaces that story's cover
- `POST /admin/moderation/story/{id}/approve-cover`

The Story Card tab already renders Regenerate, Replace and Approve; they operate on a local
object URL and the draft store.

## 4. Voice endpoints

`POST /admin/voice-review/{id}/regenerate` exists and is wired. Missing:

- `POST /admin/moderation/story/{id}/audio` (multipart `file`) - replace or upload narration
- `POST /admin/moderation/story/{id}/approve-voice`
- `PATCH /admin/moderation/story/{id}` accepting `has_no_voice`

## 5. Queue payload additions

`GET /admin/moderation/queue` returns `id`, `title`, `story_type`, `author`, `created_at`,
`moderation_status`, `cover_image_url`. The overview needs more, and currently gets it by pulling
one wide page of `GET /admin/voice-review` and merging by id in the browser
(`buildPublicationRows`). That merge should not be permanent.

Add to each queue item:

- `first_name` - the pseudonym. The Author column falls back to the account email without it,
  which is admin-only but is not what the client asked for.
- `audio_path` and `audio_duration_seconds` - so Voice status and Duration stop needing the
  voice-review merge
- `updated_at` - so "sort by last update" covers every publication, not only ones with audio
- `high_intensity` - so the explicit label shows in the list
- `story_text` presence flag (or the text itself) - the "No text" filter matches nothing today
- `content_status`, `cover_status`, `voice_status`, `published_at` once they exist

Also return `created_at` as ISO instead of `"07 Sep 26"`. The frontend parses the short format in
`parseApiDate` purely to make the column sortable.

## 6. Queue query parameters

Type, publication status and missing-asset filters run in the browser on the current page only,
which the toolbar states out loud. Server-side support needed:

- `story_type=confession|meditation|journey`
- `missing=text,cover,voice`
- `publication_status=<ladder value>`
- `sort=submitted_asc|submitted_desc|updated_asc|updated_desc`

## 7. Split `location` into city and country

`Story.location` is one string and `PUT /admin/moderation/story/{id}` accepts only `location`.
The card editor shows City and Country as separate inputs and joins them with `", "` on save
(`joinLocation`), splitting on the last comma when loading (`splitLocation`).

Add `city` and `country` columns, accept both in the PUT, and return both in
`StoryDetailResponse`. Backfill by splitting existing `location` values.

## 8. Admin-only contact details

The workspace has a contact panel, but `StoryDetailResponse.author` is the account email and
nothing else. Whatever contact details the author submits should be returned to admins under an
explicit key, for example:

```
contact: { email, phone, preferred_channel } | null
```

This must never be included in any public response, and must stay out of the story card payload.

## 9. Close the public author-name fallback

Separate from this dashboard but related: in
`app/api/v1/endpoints/routes_user_dashboard.py` (around lines 399-405) the public story detail
builds `author_name` as `story.first_name` then `story.user.profile.true_name` then
`story.user.email`. An empty pseudonym therefore leaks a real name or an email address onto a
public page.

The frontend has a guard - `publicDisplayName` in `src/utils/storyIdentity.utils.ts` drops any
value containing `@` - but that only hides emails, not real names, and only in components that
use it. The fallback chain should stop at `first_name`, with a neutral default such as
"Anonymous".
