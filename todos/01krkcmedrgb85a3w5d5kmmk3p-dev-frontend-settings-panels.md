# Settings Panels

Path: `development/gadget-sdk/frontend/settings-panels/`

- `GadgetSettingsProps` type
- Declaring in `[frontend.settings]` manifest section
- `useGadgetSetting<T>(key)` hook for reading/writing settings
- Settings reactivity: changes propagate to WASM via `on-setting-changed`
