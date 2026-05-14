# Import Interface: command

Path: `development/gadget-sdk/interfaces/command/`

Host → Gadget import. Run system processes with argv constraints.
- Permission: `[[permissions.command]]` with per-binary rules
- Argv constraint kinds: `literal`, `enum`, `glob`, `regex`, `path-under`, `any-string`, `rest`
- SDK helpers from `gadget-sdk/src/command.rs`
