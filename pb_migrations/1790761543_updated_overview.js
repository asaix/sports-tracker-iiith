/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3134596412")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n\n    COALESCE(att.present_count, 0) AS present_count,\n    COALESCE(att.absent_count, 0) AS absent_count,\n    COALESCE(ext.extra_count, 0) AS extra_count,\n    COALESCE(lv.leave_count, 0) AS leave_count\n\nFROM users\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(CASE WHEN present = true THEN 1 ELSE 0 END) AS present_count,\n        SUM(CASE WHEN present = false THEN 1 ELSE 0 END) AS absent_count\n    FROM attendance\n    GROUP BY user\n) att ON att.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS extra_count\n    FROM extra\n    GROUP BY user\n) ext ON ext.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS leave_count\n    FROM leave\n    GROUP BY user\n) lv ON lv.user = users.id\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_VaNe")

  // remove field
  collection.fields.removeById("number882748043")

  // remove field
  collection.fields.removeById("number2826271853")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_px9s",
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
    "id": "json882748043",
    "maxSize": 1,
    "name": "present_count",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "json2826271853",
    "maxSize": 1,
    "name": "absent_count",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "json2135033026",
    "maxSize": 1,
    "name": "extra_count",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "help": "",
    "hidden": false,
    "id": "json1074601416",
    "maxSize": 1,
    "name": "leave_count",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3134596412")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n    COUNT(CASE WHEN attendance.present = true THEN 1 END) AS present_count,\n    COUNT(CASE WHEN attendance.present = false THEN 1 END) AS absent_count\nFROM users\nLEFT JOIN attendance\n    ON attendance.user = users.id\nGROUP BY users.id, users.username\n"
  }, collection)

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

  // remove field
  collection.fields.removeById("_clone_px9s")

  // remove field
  collection.fields.removeById("json882748043")

  // remove field
  collection.fields.removeById("json2826271853")

  // remove field
  collection.fields.removeById("json2135033026")

  // remove field
  collection.fields.removeById("json1074601416")

  return app.save(collection)
})
