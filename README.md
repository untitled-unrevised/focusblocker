# FocusBlocker

FocusBlocker is a small browser extension for maintaining a local list of sites
you do not want to visit.

This public repository intentionally contains no preset sites, schedules,
machine policy, account names, deployment configuration, or user data. Your
block list is created after installation and remains in the browser's local
extension storage.

## Install for development

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Choose `extension/manifest.json`.

### Chromium browsers

1. Open the browser's extensions page.
2. Enable developer mode.
3. Select **Load unpacked** and choose the `extension` directory.

## Use

Open the toolbar popup, enter a domain such as `example.com`, and select
**Block site**. The extension blocks that domain and its subdomains. Remove an
entry from the popup to allow it again.

## Development

Run the test suite with:

```bash
node --test
```

See [PRIVACY.md](PRIVACY.md) for the data-handling summary.
