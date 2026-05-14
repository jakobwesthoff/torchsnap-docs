# Export Interface: messaging

Path: `development/gadget-sdk/interfaces/messaging/`

Gadget → Host export. RPC between frontend and WASM:
- `handle-message(method, payload) -> result<string, string>`
- Used by frontend custom views to communicate with WASM backend
- `impl_noop_messaging!` macro for gadgets without RPC
