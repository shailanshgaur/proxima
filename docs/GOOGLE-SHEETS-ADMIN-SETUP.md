# Google Sheets Admin Dashboard Setup

**Status:** MVP includes in-app admin dashboard. This guide covers optional Google Sheets automation for advanced use cases.

---

## Overview

The admin dashboard in the React app provides real-time views of:
- Bookings (status, vendor, resident, date)
- Vendors (rating, reviews, archived status)
- Appeals (pending decisions, SLA tracking)
- Metrics (completion rate, avg rating, no-show rate)

For enhanced automation, you can also set up a Google Sheet with Apps Script nightly jobs.

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://docs.google.com/spreadsheets)
2. Click "Create new spreadsheet"
3. Name it: "ZingConnect-Admin-Dashboard"
4. Create these tabs:

### Tab 1: Vendors
```
Column A: ID
Column B: Name
Column C: Phone
Column D: Type (A|B)
Column E: Rating
Column F: Reviews
Column G: Archived (true/false)
Column H: Appeal Status
Column I: Last Updated
```

### Tab 2: Bookings
```
Column A: Booking ID
Column B: Resident Name
Column C: Vendor Name
Column D: Service Type
Column E: Date
Column F: Time
Column G: Status (pending|confirmed|completed|no_show|cancelled)
Column H: Photo URL
Column I: Rating Given
Column J: Created
```

### Tab 3: Reviews
```
Column A: Review ID
Column B: Vendor Name
Column C: Resident ID
Column D: Rating
Column E: Text
Column F: Created
```

### Tab 4: Appeals
```
Column A: Appeal ID
Column B: Vendor ID
Column C: Reason
Column D: Status (pending|approved|rejected)
Column E: Decision Reason
Column F: Deadline
Column G: Decided
```

### Tab 5: Config
```
Column A: Setting
Column B: Value

Rows:
SUPABASE_PROJECT_ID | your-project-id
SUPABASE_API_KEY | your-api-key
ADMIN_EMAIL | your-email@domain.com
NIGHTLY_JOB_TIME | 02:00 (24-hour)
```

---

## Step 2: Set Permissions

1. Click "Share" (top right)
2. Add your email address with "Editor" access
3. Share link is only for you (don't share publicly)

---

## Step 3: Create Apps Script Nightly Job (Optional)

1. Click "Extensions" → "Apps Script"
2. Delete the default `myFunction()` code
3. Paste this code:

```javascript
// APPS SCRIPT CODE FOR NIGHTLY JOB
// This syncs Supabase data to Google Sheets every night at 2 AM

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key'; // Get from Supabase Settings > API Keys
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function nightly() {
  try {
    // Fetch data from Supabase
    const vendors = fetchSupabaseTable('vendors');
    const bookings = fetchSupabaseTable('bookings');
    const reviews = fetchSupabaseTable('reviews');
    const appeals = fetchSupabaseTable('appeals');

    // Update sheets
    syncToSheet('Vendors', vendors);
    syncToSheet('Bookings', bookings);
    syncToSheet('Reviews', reviews);
    syncToSheet('Appeals', appeals);

    // Auto-archive logic
    autoArchiveVendors(vendors);

    Logger.log('Nightly job completed successfully');
  } catch (error) {
    MailApp.sendEmail(Session.getActiveUser().getEmail(), 'ZingConnect Nightly Job Failed', error.toString());
    Logger.log('Error: ' + error.toString());
  }
}

function fetchSupabaseTable(tableName) {
  const url = `${SUPABASE_URL}/rest/v1/${tableName}`;
  const options = {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  };

  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

function syncToSheet(sheetName, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return;

  // Clear existing data (keep header)
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns()).clearContent();

  // Write new data
  if (data.length > 0) {
    const keys = Object.keys(data[0]);
    const rows = data.map(row => keys.map(key => row[key]));
    sheet.getRange(2, 1, rows.length, keys.length).setValues(rows);
  }
}

function autoArchiveVendors(vendors) {
  const url = `${SUPABASE_URL}/rest/v1/vendors`;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  vendors.forEach(vendor => {
    // Check auto-archive conditions
    if (vendor.rating < 3.0 || vendor.review_count >= 5) {
      if (!vendor.is_archived) {
        // Archive vendor
        updateSupabase(`vendors?id=eq.${vendor.id}`, { is_archived: true });
      }
    }
  });
}

function updateSupabase(path, data) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const options = {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(data),
  };

  UrlFetchApp.fetch(url, options);
}

// Schedule trigger (run once)
function createTrigger() {
  ScriptApp.newTrigger('nightly')
    .timeBased()
    .atHour(2) // 2 AM
    .everyDays(1)
    .create();
}
```

4. Save the script
5. Click "Run" → "createTrigger()" (one-time setup)
6. Grant permissions when prompted
7. Job will run every night at 2 AM

---

## Step 4: Manual Appeal Workflow

Until you set up automation, follow this workflow:

1. **Resident submits appeal** (in app)
2. **You review** (in Admin Dashboard or check Appeals tab)
3. **You click Approve/Reject** + add reason
4. **System updates** vendor status + sends notification

If you want email notifications for new appeals:

1. In Apps Script, add this:
```javascript
function onNewAppeal() {
  const appeals = fetchSupabaseTable('appeals');
  const pending = appeals.filter(a => a.status === 'pending');
  
  if (pending.length > 0) {
    MailApp.sendEmail(
      'your-email@domain.com',
      `${pending.length} new appeal(s) waiting`,
      `Check the admin dashboard: [your-app-url]/admin`
    );
  }
}
```

2. Create another trigger for `onNewAppeal()` → every 1 hour

---

## Step 5: Monitoring

**Daily (5 min):**
- Check Admin Dashboard → Overview
- Review Pending Appeals

**Weekly (1 hour):**
- Check Metrics tab for trends
- Review vendor performance

**Monthly:**
- Archive low-performing vendors manually if needed
- Check if societies need expansion

---

## Troubleshooting

**Apps Script fails to sync:**
- Check Supabase API key is correct
- Verify table names match exactly
- Check Network in Apps Script editor

**Triggers not running:**
- Go to Apps Script → "Triggers" (left sidebar)
- Verify trigger is enabled
- Check last execution time

**Need help?**
- Supabase docs: https://supabase.com/docs
- Apps Script docs: https://developers.google.com/apps-script

---

## What's Captured (for Monetization Year 2+)

All data is captured from day 1:
- Booking timing (demand patterns)
- Vendor response times (reliability)
- Completion rates (trust signals)
- Rating distribution (satisfaction)
- Review text (sentiment analysis)

Use this data to:
- Offer premium listings to top-rated vendors
- Charge transaction fees (5%)
- Sell anonymized market insights
- Create vendor tiering (bronze/silver/gold)

---

**Next:** Deploy to Vercel, set up .env with real Supabase keys, soft launch to 20 residents.
