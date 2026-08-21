/**
 * Portfolio → Google Sheets webhook.
 *
 * Three payload types, three tabs:
 *   type "message"   (or no type)  → "Messages"    tab: timestamp | name | building | email | message
 *   type "subscribe"               → "Subscribers" tab: timestamp | email | phone | name
 *   type "lut-purchase"            → "LUT Sales"   tab: timestamp | email | session | amount | status
 *
 * LUT SALES — extra one-time setup
 * Put the LUT you sell in Drive and paste its file ID into LUT_FILE_ID below.
 * api/stripe-webhook.js posts here when a payment completes, and the buyer is
 * emailed the .cube as an attachment — so the file never needs a public URL
 * that could be forwarded around.
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
var LUT_SALES_SHEET = 'LUT Sales';
var MAX_FIELD_LENGTH = 2000;

// --- LUT settings ---
var OWNER_TEST_EMAIL = 'mattyparkbusiness@gmail.com';  // runManualTest sends here
var LUT_FILE_ID = '1reHR5OsOPtQ-OKbFUhT2t-EMB18Lq_LZ';  // Drive file ID of the .cube you sell
var LUT_PRODUCT_NAME = 'Matthew 01';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var type = clean_(data.type);
    if (type === 'subscribe') {
      return handleSubscribe_(data);
    }
    if (type === 'lut-purchase') {
      return handleLutPurchase_(data);
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

// Paid order from Stripe. No approval step — they already paid — so the file
// goes out on the spot.
//
// Stripe retries a webhook that does not return 200, and a retry must not mean
// a second email, so a session already recorded as sent is a no-op.
function handleLutPurchase_(data) {
  var email = clean_(data.email).toLowerCase();
  var sessionId = clean_(data.sessionId);
  var amount = clean_(String(data.amount === undefined ? '' : data.amount));

  if (!email) {
    return json_({ success: false, error: 'email required' });
  }

  var sheet = getSheet_(LUT_SALES_SHEET, ['timestamp', 'email', 'session', 'amount', 'status']);

  if (sessionId && hasSentSession_(sheet, sessionId)) {
    return json_({ success: true });
  }

  var sent = sendLut_(email, 'Your LUT — ' + LUT_PRODUCT_NAME, [
    'Thanks for buying ' + LUT_PRODUCT_NAME + '.',
    '',
    'The .cube is attached. Drop it into Premiere, DaVinci, Final Cut or',
    'CapCut and apply it to your footage.',
    '',
    'Keep this email — it is your copy of the file.',
    '',
    'Use it on anything you make. Just do not resell or redistribute the file.',
    '',
    '— Matthew',
  ]);

  sheet.appendRow([new Date(), email, sessionId, amount, sent ? 'sent' : 'FAILED']);

  // Reporting the failure makes Stripe retry, which is the behaviour we want.
  return sent ? json_({ success: true }) : json_({ success: false, error: 'send failed' });
}

// Column C holds the Stripe session id, column E the status. Row 1 is headers.
function hasSentSession_(sheet, sessionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var values = sheet.getRange(2, 3, lastRow - 1, 3).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === sessionId && String(values[i][2]) === 'sent') {
      return true;
    }
  }
  return false;
}

// The single place the .cube leaves the building. Returns whether it sent.
function sendLut_(email, subject, bodyLines) {
  if (!LUT_FILE_ID) return false;

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: bodyLines.join('\n'),
      attachments: [DriveApp.getFileById(LUT_FILE_ID).getBlob()],
    });
    return true;
  } catch (err) {
    return false;
  }
}

// Run this from the Apps Script editor once, by hand.
//
// Two jobs. It triggers the OAuth consent screen — MailApp and DriveApp are
// new scopes, and until they are granted every send throws and the site gets
// back "send failed" with nothing in the logs to explain it. And it proves the
// whole delivery path works without spending five dollars to find out.
//
// Editor → pick runManualTest from the function dropdown → Run → Review
// permissions → Advanced → Go to (project) → Allow. Then check your inbox.
function runManualTest() {
  var result = sendLut_(OWNER_TEST_EMAIL, 'LUT delivery test', [
    'If this arrived with a .cube attached, the delivery path works.',
    '',
    'Nothing was charged and no order was recorded.',
  ]);
  Logger.log(result ? 'sent to ' + OWNER_TEST_EMAIL : 'FAILED — check LUT_FILE_ID');
  return result;
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
