# Fork orchestration and independent verification

Read this in full before spawning any background agent/fork for real implementation work.

Whenever a build spawns a background agent/fork for real implementation work, its final report —
"done," "verified," "published," "no errors" — is a **claim to independently check, not a fact to
relay**, even when it was told to run `verify_code`/the audit script itself; re-run the check from
the orchestrating session before telling the requester it's done.

- **Verify against the real, running artifact**, not the fork's description — `getComputedStyle`/
  `getBoundingClientRect` for a layout/color claim, a real simulated interaction for a behavior
  claim, `read_console_messages` for a "no errors" claim. Two real defects were only found this
  way, neither visible from a screenshot: a component not stretching to fill its flex wrapper, and
  a WCAG contrast failure from a background color resolving outside its intended theme scope.
- **The orchestrating session owns publishing, not the fork** — tell every fork not to publish;
  publish only after independently verifying. A fork that publishes anyway risks the requester
  seeing an unverified state if the check gets interrupted.
- **Redirect or stop a fork the moment direction changes mid-flight** — don't let it keep working
  toward an outcome about to be discarded; have it report partial state rather than finish/publish
  moot work.
- **Never run two forks concurrently against the same files** — sequence them, second starts only
  after the first's result is verified and merged.
- **When redesigning an interaction**, check what richer pattern the codebase already uses for a
  comparable decision before reaching for the simplest primitive (a plain toggle communicates only
  "on/off," not "what") — reuse an existing richer pattern for consistency when one exists.
