# Control API

Top-level section with its own page. Path: `control-api/`

- What it is: JSON-RPC 2.0 over Unix domain socket for external automation
- Enabling it via Settings → General → Control API toggle
- Socket path per platform (macOS, Linux)
- Connecting with `socat`
- Protocol: newline-delimited JSON-RPC 2.0
- API methods: `show`, `hide`, `toggle`, `dismiss`, `query`, `status`
- Error codes (protocol and application)
- Multiple client support
- Scripting examples

Source: `torchsnap/docs/control-api.md` has comprehensive content ready to adapt.
