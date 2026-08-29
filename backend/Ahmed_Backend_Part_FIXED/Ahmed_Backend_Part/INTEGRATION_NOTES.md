# Integration Ownership Notes

These rules reduce merge conflicts between team branches.

## Ahmed - backend setup
Owns:
- `src/app.js`
- `src/index.js`
- `src/config/db.js`
- `src/routes/categoryRoutes.js`
- `src/controllers/categoryController.js`
- `.env.example`
- the initial backend `package.json`

## Amr - database
Owns:
- `src/models/Provider.js`
- `src/scripts/seed.js`
- `src/scripts/check-data.js`
- `data/providers_final.json`
- `data/categories_final.json`
- database/ERD documentation

When Amr updates his branch after Ahmed is merged, he should keep the backend foundation from `develop` and add database-specific files/scripts rather than replacing the whole backend package/configuration.

## Omar - provider CRUD
Should add:
- provider routes
- provider controllers
- validation/error behavior for provider CRUD

He should import the official Provider model from Amr's database part and should not create a second Provider schema.

## Other backend features
Search and authentication branches should pull the latest `develop` before coding and extend the existing Provider routes/controllers/middleware rather than replacing shared files.
