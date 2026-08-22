# google-apps-script

The delivery half of the LUT store. Vercel takes the payment; this mails the
file. Two files, both pasted into the Apps Script editor by hand — there is no
deploy step from this repo.

## Why the scopes are declared explicitly

`Code.gs` reads the `.cube` out of Drive and sends it through Gmail. Apps Script
normally works out which permissions a script needs by reading the code and
prompts on first run — but a project that was already authorised for a narrower
set does not always re-prompt when the code grows. The symptom is a script that
runs, completes, and logs:

```
You do not have permission to call DriveApp.getFileById.
Required permissions: .../auth/drive.readonly
```

Listing `oauthScopes` in `appsscript.json` removes the guesswork: Apps Script
compares the granted set against the declared one and forces consent when they
differ.

- `spreadsheets` — the Messages, Subscribers and LUT Sales tabs
- `drive.readonly` — reading the `.cube`. Read-only on purpose; nothing here
  should ever be able to modify or delete a Drive file
- `script.send_mail` — `MailApp.sendEmail`

## Applying a change

1. script.google.com → the project
2. ⚙️ **Project Settings** → tick **Show "appsscript.json" manifest file in editor**
3. Paste `Code.gs` and `appsscript.json` into their respective files, save
4. Run `runManualTest` from the function dropdown → **Review permissions → Allow**
5. **Deploy → Manage deployments → ✏️ → Version: New version**

Step 5 is not optional. Saving alone leaves the `/exec` URL serving the old
code, and the failure is silent.

Health check: load the `/exec` URL. `portfolio webhook alive` means the current
code is deployed.
