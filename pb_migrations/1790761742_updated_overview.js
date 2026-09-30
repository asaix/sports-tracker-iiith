/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3134596412")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n\n    present_count,\n    absent_count,\n    extra_count,\n    leave_count\n\nFROM users\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(CASE WHEN present = true THEN 1 ELSE 0 END) AS present_count,\n        SUM(CASE WHEN present = false THEN 1 ELSE 0 END) AS absent_count\n    FROM attendance\n    GROUP BY user\n) att ON att.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS extra_count\n    FROM extra\n    GROUP BY user\n) ext ON ext.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS leave_count\n    FROM leave\n    GROUP BY user\n) lv ON lv.user = users.id\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_px9s")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_XIjx",
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3134596412")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n\n    COALESCE(att.present_count, 0) AS present_count,\n    COALESCE(att.absent_count, 0) AS absent_count,\n    COALESCE(ext.extra_count, 0) AS extra_count,\n    COALESCE(lv.leave_count, 0) AS leave_count\n\nFROM users\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(CASE WHEN present = true THEN 1 ELSE 0 END) AS present_count,\n        SUM(CASE WHEN present = false THEN 1 ELSE 0 END) AS absent_count\n    FROM attendance\n    GROUP BY user\n) att ON att.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS extra_count\n    FROM extra\n    GROUP BY user\n) ext ON ext.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS leave_count\n    FROM leave\n    GROUP BY user\n) lv ON lv.user = users.id\n"
  }, collection)

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

  // remove field
  collection.fields.removeById("_clone_XIjx")

  return app.save(collection)
})
