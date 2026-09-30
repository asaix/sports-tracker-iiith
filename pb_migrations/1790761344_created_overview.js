/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "_clone_NeBN",
        "max": 32,
        "min": 3,
        "name": "username",
        "pattern": "^[a-zA-Z0-9_]+$",
        "presentable": true,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "number255022849",
        "max": null,
        "min": null,
        "name": "simple_attendance",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "pbc_3134596412",
    "indexes": [],
    "listRule": null,
    "name": "overview",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n    COUNT(attendance.id) AS simple_attendance\nFROM users\nLEFT JOIN attendance\n    ON attendance.user = users.id\nGROUP BY users.id, users.username\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3134596412");

  return app.delete(collection);
})
