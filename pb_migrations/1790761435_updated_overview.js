/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3134596412")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n    COUNT(CASE WHEN attendance.present = true THEN 1 END) AS present_count,\n    COUNT(CASE WHEN attendance.present = false THEN 1 END) AS absent_count\nFROM users\nLEFT JOIN attendance\n    ON attendance.user = users.id\nGROUP BY users.id, users.username\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_NeBN")

  // remove field
  collection.fields.removeById("number255022849")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_VaNe",
    "max": 32,
    "min": 3,
    "name": "username",
    "pattern": "^[a-zA-Z0-9_]+$",
    "presentable": true,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "help": "",
    "hidden": false,
    "id": "number882748043",
    "max": null,
    "min": null,
    "name": "present_count",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "number2826271853",
    "max": null,
    "min": null,
    "name": "absent_count",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3134596412")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n    COUNT(attendance.id) AS simple_attendance\nFROM users\nLEFT JOIN attendance\n    ON attendance.user = users.id\nGROUP BY users.id, users.username\n"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
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
  }))

  // add field
  collection.fields.addAt(2, new Field({
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
  }))

  // remove field
  collection.fields.removeById("_clone_VaNe")

  // remove field
  collection.fields.removeById("number882748043")

  // remove field
  collection.fields.removeById("number2826271853")

  return app.save(collection)
})
