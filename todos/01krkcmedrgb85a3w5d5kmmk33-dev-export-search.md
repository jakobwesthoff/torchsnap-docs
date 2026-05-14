# Export Interface: search

Path: `development/gadget-sdk/interfaces/search/`

Gadget → Host export. Core search functionality:
- `entries() -> list<catalog-entry>` — static catalog for global search
- `search(query, matched-prefix) -> search-response` — dynamic search
- `execute(entry, action-id) -> result<post-action, string>` — run an action
- Search response variants: `nothing`, `results(list<scored-entry>)`, `custom-ui(view-response)`, `inline-ui(view-response)`
- Action IDs: `open`, `copy`, `reveal`, `open-with`, `delete`, `open-settings`, `custom(string)`
- Post-action variants: `nothing`, `dismiss`, `keep-open`
- Icon types: `hero-icon`, `data-url`, `asset-icon`, `emoji`
