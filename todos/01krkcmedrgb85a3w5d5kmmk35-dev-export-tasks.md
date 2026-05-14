# Export Interface: tasks

Path: `development/gadget-sdk/interfaces/tasks/`

Gadget → Host export. Scheduled background work:
- `run-task(task-id) -> result<_, string>`
- Tasks declared in `[[tasks]]` manifest section with POSIX cron expressions
- `impl_noop_tasks!` macro for gadgets without scheduled tasks
- Example: calculator's `retention-cleanup` every 30min
