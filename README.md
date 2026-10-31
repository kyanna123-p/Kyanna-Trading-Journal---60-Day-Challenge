# Trading Challenge OS — cloud synchronization milestone

This is a Supabase-ready implementation, **not a deployed service**. No credentials are bundled.

## Setup
1. Create a Supabase project and run `schema.sql` in its SQL Editor.
2. Under Authentication, enable Email authentication. For testing, email confirmation may be enabled (recommended).
3. In Project Settings > API, copy the project URL and the **publishable/anon** key, **never** the service-role or secret key.
4. Deploy `index.html` to a static HTTPS host (e.g. Cloudflare Pages, Netlify, Vercel). Some browsers restrict authentication/network calls from `file://`.
5. Open the hosted page, navigate to **Settings > Cloud Sync**, enter project URL and publishable key, and sign up or sign in.
6. If you already used the local prototype, export a JSON backup first, then choose **Upload this device** after signing in. On a second device, choose **Download cloud copy**.

## How sync works
- Data stays usable offline in the browser. Cloud synchronization is **explicit/manual** to prevent accidentally overwriting newer work from another device.
- The cloud snapshot is protected with Supabase Row Level Security; each authenticated user can only access their own records.
- Screenshots are uploaded separately to a private Storage bucket, and the snapshot stores private object paths, not base64 images. Signed URLs are created for display on each device.
- Uploads use an optimistic revision check. If another device has uploaded since the last download, the app refuses to overwrite; download and reconcile via JSON backups first.
- No broker credentials are used. Supabase keys are stored in browser localStorage and are public client keys; don't use privileged keys.

## Caveats
- The original app's localStorage size limits still apply before cloud upload. Export backups regularly.
- This first milestone does not offer automatic background sync or merge conflicting edits. Those are future enhancements.
- User-generated chart screenshots may contain sensitive financial information; private bucket and RLS are important.
- Free-tier limits, inactivity policies, and pricing can change.

## Visual redesign
The dashboard now follows the supplied dark purple/teal/gold mockup, with six colored workflow tiles, weekly progress, focus, preparation, review, health, trade table, report card, chart-study gallery, and progress ring. Existing local journal and Supabase cloud-sync implementation are retained.

## Image assets
All visual assets are in `assets/images/` and referenced with relative URLs from `index.html`. Keep that folder next to the HTML when deploying; opening just the HTML file without its assets folder will omit graphics. `club-symbol.svg` is a scalable club (♣), not a leaf. The decorative images are cropped from the approved dashboard concept; replace any asset file with an image of the same filename to change its appearance without editing application code. The chart thumbnails are illustrative only, not actual trade records.

## Visual v2
The reference-inspired presentation is contained in a separate final CSS layer in `index.html`; core data functions and `cloud.js` are unchanged. Graphics live in `assets/images/`. This package includes local-first journaling and optional Supabase integration, but it does not include a deployed cloud service.


## Artwork overlay edition
`assets/backgrounds/neon-atmosphere.webp` is a decoration-only wallpaper derived from the approved artwork, with UI text blurred away and corner motifs retained. The interactive cards, forms, trade journal, report card, chart studies, and cloud files are actual HTML/JS and remain editable. The visual layer is CSS and can be changed without altering saved data. Open `index.html` locally for offline use; cloud sync still requires Supabase setup.
