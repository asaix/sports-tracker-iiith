/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // every record belongs to exactly one user; only that user may see or touch it
  const own = "user = @request.auth.id";

  for (const name of ["attendance", "extra", "leave"]) {
    const collection = app.findCollectionByNameOrId(name);

    collection.listRule = own;
    collection.viewRule = own;
    collection.createRule = own;
    collection.updateRule = own;
    collection.deleteRule = own;

    app.save(collection);
  }
}, (app) => {
  // down: back to superuser-only
  for (const name of ["attendance", "extra", "leave"]) {
    const collection = app.findCollectionByNameOrId(name);

    collection.listRule = null;
    collection.viewRule = null;
    collection.createRule = null;
    collection.updateRule = null;
    collection.deleteRule = null;

    app.save(collection);
  }
})
