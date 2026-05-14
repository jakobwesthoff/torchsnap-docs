# Import Interface: settings

Path: `development/gadget-sdk/interfaces/settings/`

Host → Gadget import. Read gadget-scoped settings (JSON values).
- Permission: `permissions.settings = true`
- Settings namespaced under `gadgets.<id>.*` (prefix stripped in WIT)
- Reactive: `on-setting-changed` callback in lifecycle export
- SDK helpers: `get_or`, `get_or_else`
- Default values declared in `[settings]` manifest section
