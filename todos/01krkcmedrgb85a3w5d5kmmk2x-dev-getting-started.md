# Developer Getting Started (Hello World)

Path: `development/gadget-sdk/getting-started/`

Step-by-step tutorial to create a minimal gadget:
- Prerequisites: Rust toolchain, `wasm32-wasip2` target
- Scaffold from `gadgets/template/`
- Write a basic `search()` implementation
- Build with `cargo build --release` (no cargo-component needed)
- Package as `.torchsnap` archive
- Install into user gadget directory and test
- Key macros: `define_gadget!`, `impl_noop_messaging!`, `impl_noop_tasks!`
