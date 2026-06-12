# Cloud Database Setup

This app is ready to use Cloudflare D1 as an online database.

## Create The Database

1. Open Cloudflare.
2. Go to Storage & databases.
3. Open D1 SQLite Database.
4. Create a database named `universe_wallpaper_decor`.

## Bind It To The App

1. Go to Workers & Pages.
2. Open the `universe-wallpaper-decor` Pages project.
3. Open Settings.
4. Open Bindings.
5. Add a D1 database binding.
6. Set the variable name to `DB`.
7. Choose the `universe_wallpaper_decor` database.
8. Save.
9. Redeploy the app using `universe-wallpaper-decor-online.zip`.

The app creates the needed tables automatically after the binding is connected.

## What Changes

- Clients and jobs sync online.
- The same data appears on phone and computer.
- If the database is not connected, the app still saves data on the current device.
