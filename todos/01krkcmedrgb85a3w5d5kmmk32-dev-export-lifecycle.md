# Export Interface: lifecycle

Path: `development/gadget-sdk/interfaces/lifecycle/`

Gadget → Host export. Every gadget must implement:
- `enable() -> result<_, string>` — called on gadget activation, after SQL migrations
- `disable()` — called on deactivation, store drops after
- `on-setting-changed(key, value)` — reactive setting updates
