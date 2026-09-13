<div align="center">
<h1>IIIT-H Sports Tracker</h1>

If you're a student at IIIT Hyderabad, you can use this website to track your progress towards the sports attendance requirement every semester. You can use this repository to submit pull requests with changes you would like to see on the production site.

[Website link](https://sports-tracker-iiith.fly.dev)

</div>

---

## Contributions

If you can think of a feature that you would like to see added to this website, please submit a pull request. If approved, your changes will be merged into this repository and be visible on the production website. As a token of gratitude, your name, along with a link to a personal site of your choosing will be displayed on the homepage. 


## Running locally

You'll need Node 22+ and the PocketBase **0.40.0** binary for your OS.

1. Clone and install:

   ```bash
   git clone https://github.com/asaix/sports-tracker-iiith.git
   cd sports-tracker-iiith
   npm install
   ```

2. Download PocketBase 0.40.0 from the [releases page](https://github.com/pocketbase/pocketbase/releases/tag/v0.40.0) and put the binary in the project root. Don't commit it.

3. Start PocketBase:

   ```bash
   ./pocketbase serve
   ```

   The schema in `pb_migrations/` and the hooks in `pb_hooks/` are picked up automatically. To browse the data, open http://127.0.0.1:8090/_/ (or whatever your pocketbase binary prints to stdout).

4. In a second terminal, start the app:
   ```bash
   npm run dev
   ```

## Licensing

```
Copyright © 2026 Aditya Sai
Licensed under Elastic License 2.0
```

This code is licensed under ELv2. TLDR: You can copy, modify, fork, and share it (including submitting PRs), but you can't offer it to third parties as a hosted/managed service, and you can't disable or bypass any license-key-gated features. You must keep the ELv2 license attached to any copies and disclose any changes to the original software at the time of distribution. You may not relicense your version under different terms. Violating any of this terminates your license.

[You can read the full license here](LICENSE.md).
