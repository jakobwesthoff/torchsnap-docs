# Import Interface: sql-storage

Path: `development/gadget-sdk/interfaces/sql-storage/`

Host → Gadget import. Per-gadget SQLite database via `sql-handle` resource.
- Permission: `permissions.sql-storage = true` + `[storage.sql]` migrations
- Migrations applied before `enable()`
- Storage path: `<app_data_dir>/gadget-home/<id>/sql/storage.sqlite3`
- SDK helpers from `gadget-sdk/src/sql_storage.rs`
