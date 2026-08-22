# google-apps-script

Backs the contact form and the email signup. Two payload types, two tabs:

- `message`   → Messages
- `subscribe` → Subscribers

`api/message.js` and `api/subscribe.js` post here through `api/_relay.js`.

**This has nothing to do with the LUT.** Selling it is handled entirely by
`api/lut-download.js`, which verifies the Stripe session and streams the file.
An earlier version mailed the `.cube` from here, which meant granting Drive and
Gmail scopes to a script that otherwise only needs a spreadsheet — it was more
permission and more moving parts than a five-dollar file is worth.

## Applying a change

1. script.google.com → the project
2. Paste `Code.gs`, save
3. **Deploy → Manage deployments → ✏️ → Version: New version**

Step 3 is not optional. Saving alone leaves the `/exec` URL serving the old
code, and the failure is silent.

Health check: load the `/exec` URL. `portfolio webhook alive` means the current
code is deployed.
