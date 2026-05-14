# Custom Views & Inline Views

Path: `development/gadget-sdk/frontend/views/`

- Custom views: full launcher content replacement (e.g., emoji grid, calculator history)
- Inline views: rendered above the result list (e.g., calculator inline result)
- `GadgetViewProps`, `InlineViewProps` types
- Declaring views in `[frontend.views]` and `[frontend.inline-views]` manifest sections
- How search returns `custom-ui(view-response)` or `inline-ui(view-response)`
- Communication with WASM backend via messaging interface
