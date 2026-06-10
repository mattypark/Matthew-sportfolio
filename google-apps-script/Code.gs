/**
 * Terminal → Google Sheets webhook.
 *
 * Receives POSTs from the portfolio terminal's "message" command and appends
 * a row: timestamp | name | what they're building | email | message.
 *
 * SETUP
 * 1. Create a Google Sheet. Name the first tab "Messages" (or change SHEET_NAME).
 * 2. Extensions → Apps Script. Paste this file, save.
 * 3. Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the web app URL (ends in /exec).
 * 5. In the portfolio repo, add to .env (and Vercel env vars):
 *      VITE_TERMINAL_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
 *
 * NOTE: after any code change here you must create a NEW deployment version
 * (Deploy → Manage deployments → edit → Version: New) or the URL keeps
 * serving the old code.
 */

var SHEET_NAME = 'Messages';
var MAX_FIELD_LENGTH = 2000;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var name = clean_(data.name);
    var building = clean_(data.building);
    var email = clean_(data.email);
    var message = clean_(data.message);

    if (!name || !email || !message) {
      return json_({ success: false, error: 'missing required fields' });
    }

    var sheet = getSheet_();
    sheet.appendRow([new Date(), name, building, email, message]);

    // Optional: email yourself on each new message. Uncomment to enable.
    // MailApp.sendEmail({
    //   to: 'matthew.parkk0@gmail.com',
    //   subject: 'portfolio terminal: message from ' + name,
    //   body: 'name: ' + name + '\nbuilding: ' + building +
    //         '\nemail: ' + email + '\n\n' + message,
    // });

    return json_({ success: true });
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

// Sanity check endpoint — visiting the /exec URL in a browser should show this.
function doGet() {
  return json_({ success: true, data: 'terminal webhook alive' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp', 'name', 'building', 'email', 'message']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean_(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
