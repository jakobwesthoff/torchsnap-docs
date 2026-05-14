# Import Interface: filesystem

Path: `development/gadget-sdk/interfaces/filesystem/`

Host → Gadget import. Read-only filesystem access.
- Permission: `[permissions.filesystem] read = [...]`
- Methods: `read-file`, `file-exists`, `metadata`
- Glob patterns (`*` single segment, `**` cross-segment)
- Path variable expansion (`${home}`, `${xdg-config}`, etc.)
