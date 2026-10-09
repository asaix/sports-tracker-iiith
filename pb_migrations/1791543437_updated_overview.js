/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3134596412")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n\n    present_count,\n    absent_count,\n    extra_count,\n    leave_count,\n\n    MAX(\n        COALESCE(att.updated, ''),\n        COALESCE(ext.updated, ''),\n        COALESCE(lv.updated, '')\n    ) AS last_touch\n\nFROM users\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(CASE WHEN present = true THEN 1 ELSE 0 END) AS present_count,\n        SUM(CASE WHEN present = false THEN 1 ELSE 0 END) AS absent_count,\n        MAX(updated) AS updated\n    FROM attendance, (\n        SELECT\n            CASE\n                WHEN d >= date(d, 'start of year', '+11 months', '+29 days')\n                    THEN date(d, 'start of year', '+11 months', '+29 days')\n                WHEN d >= date(d, 'start of year', '+6 months', '+29 days')\n                    THEN date(d, 'start of year', '+6 months', '+29 days')\n                ELSE date(d, 'start of year', '-2 days')\n            END AS start,\n            d AS today\n        FROM (SELECT date('now', '+5 hours', '+30 minutes') AS d)\n    ) sem\n    WHERE substr(date, 1, 10) BETWEEN sem.start AND sem.today\n    GROUP BY user\n) att ON att.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS extra_count,\n        MAX(updated) AS updated\n    FROM extra, (\n        SELECT\n            CASE\n                WHEN d >= date(d, 'start of year', '+11 months', '+29 days')\n                    THEN date(d, 'start of year', '+11 months', '+29 days')\n                WHEN d >= date(d, 'start of year', '+6 months', '+29 days')\n                    THEN date(d, 'start of year', '+6 months', '+29 days')\n                ELSE date(d, 'start of year', '-2 days')\n            END AS start\n        FROM (SELECT date('now', '+5 hours', '+30 minutes') AS d)\n    ) sem\n    WHERE created >= datetime(sem.start, '-5 hours', '-30 minutes')\n    GROUP BY user\n) ext ON ext.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS leave_count,\n        MAX(updated) AS updated\n    FROM leave, (\n        SELECT\n            CASE\n                WHEN d >= date(d, 'start of year', '+11 months', '+29 days')\n                    THEN date(d, 'start of year', '+11 months', '+29 days')\n                WHEN d >= date(d, 'start of year', '+6 months', '+29 days')\n                    THEN date(d, 'start of year', '+6 months', '+29 days')\n                ELSE date(d, 'start of year', '-2 days')\n            END AS start\n        FROM (SELECT date('now', '+5 hours', '+30 minutes') AS d)\n    ) sem\n    WHERE created >= datetime(sem.start, '-5 hours', '-30 minutes')\n    GROUP BY user\n) lv ON lv.user = users.id\n\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_HKJr")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_3WKu",
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
    "viewQuery": "SELECT\n    users.id,\n    users.username,\n\n    present_count,\n    absent_count,\n    extra_count,\n    leave_count,\n\n    MAX(\n        COALESCE(att.updated, ''),\n        COALESCE(ext.updated, ''),\n        COALESCE(lv.updated, '')\n    ) AS last_touch\n\nFROM users\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(CASE WHEN present = true THEN 1 ELSE 0 END) AS present_count,\n        SUM(CASE WHEN present = false THEN 1 ELSE 0 END) AS absent_count,\n        MAX(updated) AS updated\n    FROM attendance\n    GROUP BY user\n) att ON att.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS extra_count,\n        MAX(updated) AS updated\n    FROM extra\n    GROUP BY user\n) ext ON ext.user = users.id\n\nLEFT JOIN (\n    SELECT\n        user,\n        SUM(count) AS leave_count,\n        MAX(updated) AS updated\n    FROM leave\n    GROUP BY user\n) lv ON lv.user = users.id\n"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_HKJr",
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
  collection.fields.removeById("_clone_3WKu")

  return app.save(collection)
})
