# Admin Panel: Gallery CMS + Google Forms Hosting

## Why both a native registration system AND Google Forms

You mentioned wanting the ability to (a) register users into a real database, and (b) also host Google Forms the council already uses. These aren't contradictory — different events will want different things:
- Events with a native flow (simple headcount events, workshops) → use the `events`/`registrations` tables from `08-AUTH-BACKEND-DATABASE.md` directly, no Google Form needed.
- Events where the council already has a built-out Google Form (with custom questions, file uploads for team submissions, etc.) → embed it instead of rebuilding it. `events.google_form_url` (from the schema) is the switch: if it's set, the event page renders an embedded form instead of the native "Register" button.

## Google Form embed component

```jsx
function EmbeddedGoogleForm({ formUrl }) {
  // formUrl should be the Google Form's "Send" > embed HTML src, e.g.:
  // https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true
  return (
    <div className="w-full rounded-xl overflow-hidden border border-ocean-700 bg-space-900/60 backdrop-blur">
      <iframe
        src={formUrl}
        title="Event Registration Form"
        width="100%"
        height="900"
        loading="lazy"
        style={{ border: 0 }}
      >
        Loading…
      </iframe>
    </div>
  );
}
```

Notes:
- Google Forms **must** be embedded with `?embedded=true` appended to the form's public URL, otherwise Google blocks framing.
- Wrap in the glassmorphism card style from `04-DESIGN-SYSTEM-COLOR-TYPE.md` so it feels native to the site, not a bare iframe.
- Google Forms responses stay in the council's own Google account/Sheet — the site's database won't have those registrants, so the admin dashboard's "registrant list" should clearly label which events are "tracked on-site" vs. "tracked via Google Form — check the linked Sheet," so nobody thinks a form-based event's numbers are missing from the site.

## Admin panel (`/admin`) — pages needed

1. **Events manager** — list/create/edit events; toggle `registration_open`; set either a native registration or paste a Google Form embed URL.
2. **Gallery manager** — per fest year: create an album, drag-and-drop upload photos (uploads to Supabase Storage bucket `gallery/{year}/{album_id}/`, writes rows to `gallery_photos`), reorder via `sort_order`, delete.
3. **Registrants** — per event, table of registrants (name, roll no., email, phone, status), CSV export button (only for natively-tracked events; Google Form events link out to the Sheet instead).
4. **Admin users** — `super_admin` only: promote/demote `council_admin` roles.

## Upload constraints (gallery photos)

- Client-side: restrict to `image/jpeg`, `image/png`, `image/webp`; max 8MB per file; resize/compress client-side before upload (e.g. `browser-image-compression`) to keep storage costs and page-load weight down.
- Server-side (critical — never trust client-side checks alone): re-validate MIME type and file size on the Supabase Storage policy / upload handler, and strip EXIF metadata on upload (location data in phone photos is a real privacy leak for a public gallery).
- Generate a compressed web-display version + keep the original for archive — serve the compressed version site-wide, link "View full size" if needed.
