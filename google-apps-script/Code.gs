/**
 * Portfolio → Google Sheets webhook.
 *
 * Two payload types, two tabs:
 *   type "message"   (or no type)  → "Messages"    tab: timestamp | name | building | email | message
 *   type "subscribe"               → "Subscribers" tab: timestamp | email | phone | name
 *
 * SETUP
 * 1. Create a Google Sheet. The tabs are created automatically on first write.
 * 2. Extensions → Apps Script. Paste this file, save.
 * 3. Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the web app URL (ends in /exec).
 * 5. In Vercel, set TERMINAL_WEBHOOK_URL to that URL.
 *
 * NOTE: after any code change here you must create a NEW deployment version
 * (Deploy → Manage deployments → edit → Version: New) or the URL keeps
 * serving the old code. The journal signup form will 502 until you do.
 */

var MESSAGES_SHEET = 'Messages';
var SUBSCRIBERS_SHEET = 'Subscribers';
var MAX_FIELD_LENGTH = 2000;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (clean_(data.type) === 'subscribe') {
      return handleSubscribe_(data);
    }
    return handleMessage_(data);
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

// Journal signup: email required, phone and name optional.
// Re-subscribing with the same email is a no-op, not a duplicate row.
function handleSubscribe_(data) {
  var email = clean_(data.email).toLowerCase();
  var phone = clean_(data.phone);
  var name = clean_(data.name);

  if (!email) {
    return json_({ success: false, error: 'email required' });
  }

  var sheet = getSheet_(SUBSCRIBERS_SHEET, ['timestamp', 'email', 'phone', 'name']);
  if (hasEmail_(sheet, email)) {
    return json_({ success: true });
  }
  sheet.appendRow([new Date(), email, phone, name]);

  return json_({ success: true });
}

// Terminal "message" command.
function handleMessage_(data) {
  var name = clean_(data.name);
  var building = clean_(data.building);
  var email = clean_(data.email);
  var message = clean_(data.message);

  if (!name || !email || !message) {
    return json_({ success: false, error: 'missing required fields' });
  }

  var sheet = getSheet_(MESSAGES_SHEET, ['timestamp', 'name', 'building', 'email', 'message']);
  sheet.appendRow([new Date(), name, building, email, message]);

  // Optional: email yourself on each new message. Uncomment to enable.
  // MailApp.sendEmail({
  //   to: 'matthew.parkk0@gmail.com',
  //   subject: 'portfolio terminal: message from ' + name,
  //   body: 'name: ' + name + '\nbuilding: ' + building +
  //         '\nemail: ' + email + '\n\n' + message,
  // });

  return json_({ success: true });
}

// Sanity check endpoint — visiting the /exec URL in a browser should show this.
function doGet() {
  return json_({ success: true, data: 'portfolio webhook alive' });
}

function getSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Column B of the Subscribers tab holds the email. Row 1 is the header.
function hasEmail_(sheet, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var values = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim().toLowerCase() === email) return true;
  }
  return false;
}

function clean_(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
