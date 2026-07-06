# TikTok Studio Analytics Clone

A frontend-only clone of the TikTok Studio video analytics section (Overview,
Viewers, Engagement). No real backend/API — every number, chart, and label is
manually editable and updates instantly.

## Stack

React + Vite, Tailwind CSS v4, Recharts, React Router.

## Deploying (Vercel)

A `vercel.json` rewrite is included so client-side routes like `/admin` don't
404 on refresh/direct navigation — it tells Vercel to always serve
`index.html` and let React Router handle the path. Just push/redeploy after
pulling this file; no dashboard settings needed.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## Editing data

Click any number, percentage, or text label — including chart data points
(click a dot to reveal its editable value) — type a new value, then press
Tab/Enter or click away to commit it. Charts and bars re-render immediately.
Editable data lives in memory only; refreshing the page resets it back to
the defaults in `src/data/sampleData.js`.

## Uploading a video (title + thumbnail)

Go to `/admin` (e.g. http://localhost:5173/admin) to add a video title and
thumbnail image. Submitted videos are stored in the browser's localStorage
(key `tt_uploaded_videos`) — no server required — and immediately:

- appear at the top of the Studio sidebar (newest first)
- become selectable; clicking one syncs its title + thumbnail across the
  Overview video info bar, the Retention rate preview, and the Engagement
  "Likes" preview

All other numbers/charts stay independently editable regardless of which
video is selected. Because storage is per-browser, uploads made on one
device/browser won't show up on another — swap in a real backend (e.g.
Firebase/Supabase) via `src/data/videoStore.js` if cross-device sync is
needed later.

## Structure

```
src/
  App.jsx                  router: "/" -> StudioApp, "/admin" -> AdminPage
  components/
    StudioApp.jsx           sidebar + header + tab switcher
    AdminPage.jsx           upload form for title + thumbnail
    Sidebar.jsx             video list, click to select active video
    Header.jsx              tabs, "Updated on" date, avatar
    VideoInfoBar.jsx        caption/thumbnail/icons row (Overview)
    StatRow.jsx             5 clickable metric tabs + values
    AreaTrendChart.jsx      main trend chart (click a dot to edit)
    RetentionChart.jsx      shared retention/likes mini chart + video preview
    VideoPlayPreview.jsx    video thumbnail box (or uploaded image)
    OverviewTab.jsx / ViewersTab.jsx / EngagementTab.jsx
    BarRow.jsx              editable label + bar + percentage
    DualBar.jsx             split bar (e.g. New vs Returning viewers)
    GenderDonut.jsx         donut chart + legend
    Card.jsx                shared card with heading + divider
    Editable.jsx            generic contenteditable primitive
  data/
    sampleData.js           initial values shown on load
    DataContext.jsx         shared editable state + video selection
    videoStore.js           localStorage read/write for uploaded videos
```
