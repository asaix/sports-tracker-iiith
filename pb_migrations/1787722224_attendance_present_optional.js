/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // a `required` bool in PocketBase rejects `false` ("Cannot be blank"), which
  // would make Absent unstorable. Presence is conveyed by the record existing.
  const collection = app.findCollectionByNameOrId("attendance");
  const field = collection.fields.getById(collection.fields.find((f) => f.name === "present").id);

  field.required = false;

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("attendance");
  const field = collection.fields.getById(collection.fields.find((f) => f.name === "present").id);

  field.required = true;

  return app.save(collection);
})
