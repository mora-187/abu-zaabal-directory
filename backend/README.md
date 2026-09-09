# Abu Zaabal Directory - Backend Foundation (Ahmed)

This part owns the shared backend foundation and the main groups/categories endpoints.
It is intentionally designed to integrate with the database part without defining a duplicate `Provider` model.

## Responsibilities covered

- Express application setup
- JSON middleware
- CORS
- Environment configuration
- MongoDB connection
- Health endpoint
- Main groups endpoint
- Categories endpoint, optionally filtered by main group
- Basic 404 handling
- Basic shared 500 error response

## Install

```bash
npm install
```

Copy `.env.example` to `.env` and update values for your machine.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/abu_zaabal_directory
```

> `27017` is MongoDB's normal default. A developer whose local MongoDB uses a different port should change only their local `.env` file.

## Run

Development:

```bash
npm run dev
```

Production-style local run:

```bash
npm start
```

## Endpoints

### Health

`GET /api/health`

Example response:

```json
{
  "status": "ok"
}
```

### Main groups

`GET /api/groups`

Example response shape:

```json
{
  "results": [],
  "total": 0
}
```

### Categories

All categories:

`GET /api/categories`

Categories for one main group:

`GET /api/categories?group=اسم المجموعة`

Example response shape:

```json
{
  "group": null,
  "results": [],
  "total": 0
}
```

## Integration notes

- This part does **not** define `src/models/Provider.js`. The database branch owns the official Provider schema/model.
- Groups/categories are read directly from the `providers` MongoDB collection, so these endpoints work after the database seed/import is completed.
- The canonical environment variable is `MONGODB_URI`.
- The canonical local database name is `abu_zaabal_directory`.
- `src/config/db.js` is aligned with the database part's connection configuration.
- Later feature branches should pull the latest `develop` before adding routes/controllers instead of replacing `src/app.js`, `src/index.js`, or `package.json` wholesale.
