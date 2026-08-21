/**
 * Portfolio → Google Sheets webhook.
 *
 * Three payload types, three tabs:
 *   type "message"   (or no type)  → "Messages"    tab: timestamp | name | building | email | message
 *   type "subscribe"               → "Subscribers" tab: timestamp | email | phone | name
 *   type "lut-claim"               → "LUT Claims"  tab: timestamp | email | platform | url | screenshot | status | token
 *
 * LUT CLAIMS — extra one-time setup
 * a. Put the LUT you sell in Drive and paste its file ID into LUT_FILE_ID below.
 * b. Create a Drive folder for repost screenshots, paste its ID into
 *    SCREENSHOT_FOLDER_ID. (Leave blank to skip saving the image; the row and
 *    the notification email still go through.)
 * c. Set OWNER_EMAIL to wherever you want the approve links to land.
 * Each claim emails you the screenshot plus an Approve link. Clicking it flips
 * the row to "approved" and emails the claimant the .cube as an attachment, so
 * the file never needs a public URL.
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
var LUT_CLAIMS_SHEET = 'LUT Claims';
var MAX_FIELD_LENGTH = 2000;

// --- LUT claim settings (fill these in) ---
var OWNER_EMAIL = 'mattyparkbusiness@gmail.com';
var LUT_FILE_ID = '';            // Drive file ID of the .cube you send out
var SCREENSHOT_FOLDER_ID = '';   // Drive folder for repost screenshots (optional)
var LUT_PRODUCT_NAME = 'Matthew 01';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var type = clean_(data.type);
    if (type === 'subscribe') {
      return handleSubscribe_(data);
    }
    if (type === 'lut-claim') {
      return handleLutClaim_(data);
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

// Free LUT for a repost.
//
// Writes the claim, files the screenshot in Drive, and emails Matthew an
// Approve link. Nothing is sent to the claimant until he clicks it — the whole
// point of the flow is that a human looks at the screenshot.
function handleLutClaim_(data) {
  var email = clean_(data.email).toLowerCase();
  var platform = clean_(data.platform);
  var postUrl = clean_(data.postUrl);

  if (!email) {
    return json_({ success: false, error: 'email required' });
  }

  var blob = screenshotBlob_(data.screenshot, email);
  var screenshotUrl = saveScreenshot_(blob);
  var token = Utilities.getUuid();

  var sheet = getSheet_(LUT_CLAIMS_SHEET, [
    'timestamp', 'email', 'platform', 'url', 'screenshot', 'status', 'token',
  ]);
  sheet.appendRow([new Date(), email, platform, postUrl, screenshotUrl, 'pending', token]);

  notifyOwner_(email, platform, postUrl, screenshotUrl, token, blob);

  return json_({ success: true });
}

// Decodes the data URL the browser sent. Returns null on anything unexpected —
// a claim is still worth recording without the image.
function screenshotBlob_(dataUrl, email) {
  if (typeof dataUrl !== 'string') return null;
  var match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!match) return null;

  try {
    var ext = match[1].split('/')[1].replace('jpeg', 'jpg');
    var name = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd-HHmmss') +
      '-' + email.replace(/[^a-z0-9]+/g, '-') + '.' + ext;
    return Utilities.newBlob(Utilities.base64Decode(match[2]), match[1], name);
  } catch (err) {
    return null;
  }
}

// Returns a Drive link, or '' if no folder is configured or the write failed.
function saveScreenshot_(blob) {
  if (!SCREENSHOT_FOLDER_ID || !blob) return '';
  try {
    return DriveApp.getFolderById(SCREENSHOT_FOLDER_ID).createFile(blob).getUrl();
  } catch (err) {
    return '';
  }
}

// The screenshot rides along as an attachment as well as a Drive link, so the
// claim can be judged from a phone without opening Drive.
function notifyOwner_(email, platform, postUrl, screenshotUrl, token, blob) {
  var approveUrl = ScriptApp.getService().getUrl() + '?approve=' + encodeURIComponent(token);
  var options = {
    to: OWNER_EMAIL,
    subject: 'LUT claim from ' + email,
    body: [
      'New free-LUT claim.',
      '',
      'email:    ' + email,
      'platform: ' + (platform || '—'),
      'post:     ' + (postUrl || '—'),
      'shot:     ' + (screenshotUrl || 'see attachment'),
      '',
      'Looks real? Approve and send the LUT:',
      approveUrl,
      '',
      'Ignore this email to do nothing — the row stays pending.',
    ].join('\n'),
  };
  if (blob) options.attachments = [blob];

  MailApp.sendEmail(options);
}

// Flips a pending row to approved and emails the claimant the .cube.
// Returns the HTML shown in the browser tab the link opened.
function approveLutClaim_(token) {
  if (!LUT_FILE_ID) {
    return 'LUT_FILE_ID is not set in the Apps Script. Nothing was sent.';
  }

  var sheet = getSheet_(LUT_CLAIMS_SHEET, [
    'timestamp', 'email', 'platform', 'url', 'screenshot', 'status', 'token',
  ]);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 'No claims yet.';

  var values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][6]) !== token) continue;

    var email = String(values[i][1]);
    if (String(values[i][5]) === 'approved') {
      return 'Already approved — ' + email + ' has the LUT.';
    }

    try {
      MailApp.sendEmail({
        to: email,
        subject: 'Your LUT — ' + LUT_PRODUCT_NAME,
        body: [
          'Thanks for sharing the video.',
          '',
          LUT_PRODUCT_NAME + ' is attached. Drop the .cube into Premiere, DaVinci,',
          'Final Cut or CapCut and apply it to log footage.',
          '',
          'Use it on anything you make. Just do not resell the file itself.',
          '',
          '— Matthew',
        ].join('\n'),
        attachments: [DriveApp.getFileById(LUT_FILE_ID).getBlob()],
      });
    } catch (err) {
      return 'Could not send to ' + email + ': ' + err;
    }

    sheet.getRange(i + 2, 6).setValue('approved');
    return 'Sent. ' + email + ' has the LUT.';
  }

  return 'That approve link does not match any claim.';
}

// Sanity check endpoint — visiting the /exec URL in a browser should show this.
// Also serves the one-click approve links emailed for each LUT claim.
function doGet(e) {
  var token = e && e.parameter ? clean_(e.parameter.approve) : '';
  if (token) {
    return html_(approveLutClaim_(token));
  }
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

function html_(message) {
  return HtmlService.createHtmlOutput(
    '<p style="font:14px/1.6 -apple-system,sans-serif;padding:40px">' + message + '</p>'
  );
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
