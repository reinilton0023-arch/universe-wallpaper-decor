# GitHub + Cloudflare Setup

Use this package when you want the online database to work across phone and computer.

Cloudflare Direct Upload does not support Pages Functions, so the database API must be deployed from GitHub or Wrangler.

## Files To Upload To GitHub

Upload everything from the `github-cloudflare-project` folder to a new GitHub repository.

The repository root must contain:

- `index.html`
- `manifest.json`
- `sw.js`
- `functions/api/data.js`
- `_routes.json`
- all image/icon files

## Connect GitHub To Cloudflare Pages

1. Open Cloudflare.
2. Go to Workers & Pages.
3. Open Pages.
4. Choose Connect to Git.
5. Select the GitHub repository.
6. Build command: leave empty.
7. Build output directory: `/`
8. Deploy.

## Database Binding

In Cloudflare Pages settings, Production environment:

- Binding type: D1 database
- Variable name: `DB`
- Database: `universe_wallpaper_decor`

After deployment, this URL should show JSON:

`https://universe-wallpaper-decor.pages.dev/api/data`

If it shows JSON, sync is working.


Redeploy trigger for DB binding.
