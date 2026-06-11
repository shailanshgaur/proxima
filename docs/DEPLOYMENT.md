# ZingConnect MVP Deployment Guide

**Status:** All 10 tasks complete. Ready for soft launch.

---

## Pre-Deployment Checklist

- [ ] Supabase project created + schema applied
- [ ] Supabase storage bucket "booking-photos" created (500MB free tier)
- [ ] .env file filled with real Supabase credentials
- [ ] React app built and tested locally
- [ ] Vercel account created
- [ ] GitHub repo created and pushed

---

## Step 1: Supabase Setup

### Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Create new project"
3. Fill:
   - Project name: `zing-connect`
   - Database password: (generate strong password)
   - Region: closest to your users
4. Wait for project to initialize (2-3 min)

### Create Tables

1. Go to SQL Editor
2. Run the migration from `migrations/001-core-schema.sql`
3. Verify all tables created: societies, users, vendors, bookings, reviews, appeals

### Create Storage Bucket

1. Go to Storage (left sidebar)
2. Click "Create bucket"
3. Name: `booking-photos`
4. Make public: No (access via signed URLs)
5. Click "Create"

### Get API Keys

1. Go to Settings → API
2. Copy:
   - Project URL (for VITE_SUPABASE_URL)
   - Anon Key (for VITE_SUPABASE_ANON_KEY)

---

## Step 2: Configure Environment

1. Update `.env` file:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

2. Test locally:
```bash
npm install
npm run dev
```

3. Go to http://localhost:5173
4. Try signup with a test phone number (Supabase provides fake SMS in dev)

---

## Step 3: Deploy to Vercel

### Option A: Git-based (Recommended)

1. Push code to GitHub:
```bash
git remote add origin https://github.com/your-user/zing-connect.git
git branch -M main
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New..." → "Project"
4. Select GitHub repo "zing-connect"
5. Framework: "Vite"
6. Environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```
7. Click "Deploy"
8. Wait for build to complete
9. Get your URL: `https://zing-connect.vercel.app`

### Option B: CLI Deployment

```bash
npm install -g vercel
vercel --env VITE_SUPABASE_URL=https://... --env VITE_SUPABASE_ANON_KEY=...
```

---

## Step 4: Add Initial Data

### Create First Society

1. Go to Supabase dashboard
2. SQL Editor → paste:
```sql
INSERT INTO societies (id, name, location, resident_count) 
VALUES (gen_random_uuid(), 'Lotus Gardens', 'Mumbai, Bandra', 250);
```

3. Note the society ID returned

### Create Test Vendor (Type A)

```sql
INSERT INTO vendors (id, name, phone, type, categories, societies, rating, review_count, is_archived) 
VALUES (
  gen_random_uuid(), 
  'Raj Plumbing', 
  '+919876543210',
  'A',
  '["Plumbing"]'::jsonb,
  '[' || '"' || '(society-id-from-step-above)' || '"' || ']'::jsonb,
  0,
  0,
  false
);
```

### Create Test Vendor (Type B)

```sql
INSERT INTO vendors (id, name, phone, type, categories, societies, rating, review_count, is_archived) 
VALUES (
  gen_random_uuid(), 
  'CleanCo Cleaning', 
  '+919123456789',
  'B',
  '["Cleaning"]'::jsonb,
  '[' || '"' || '(society-id)' || '"' || ']'::jsonb,
  0,
  0,
  false
);
```

---

## Step 5: Test Soft Launch (20 Residents)

### Invite 20 Test Users

1. Share app URL with 20 residents in your society
2. They sign up with their phone number (you can use fake numbers for testing)
3. They see vendors list, create bookings, upload photos, rate

### Monitor

1. Check Admin Dashboard daily
2. Review bookings + appeals
3. Note any bugs or UX issues

---

## Step 6: Full Launch (All Residents)

Once soft launch has been running for 1 week:

1. Fix any critical bugs
2. Add more vendors
3. Announce full launch to all residents
4. Optional: Set up Google Sheets + Apps Script automation (see GOOGLE-SHEETS-ADMIN-SETUP.md)

---

## Production Checklist

- [ ] HTTPS enabled (Vercel does this by default)
- [ ] Supabase RLS policies reviewed
- [ ] Photo storage cleanup job (auto-delete after 90 days) — optional, set in Supabase
- [ ] Error monitoring (Sentry, LogRocket) — optional
- [ ] Backup Supabase data weekly — Supabase does this
- [ ] Monitor costs (free tier should handle MVP)

---

## Cost Breakdown (MVP)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $0 | Free tier covers us |
| Supabase | $0 | Free tier: 500MB storage, unlimited API calls |
| WhatsApp | $0 | Click-to-chat links are free |
| Google Sheets | $0 | Free |
| Total | $0 | Fully free MVP |

**At 5k bookings/month (Year 2):** ~$10-25/month Supabase (if storage grows)

---

## Troubleshooting

### "Supabase connection failed"
- Check .env variables are correct
- Check Supabase project is active
- Check internet connection

### "Phone OTP not received"
- Use +91 prefix (Indian numbers)
- In Supabase dev, SMS is simulated (check console logs)
- In prod, verify your Twilio credentials

### "Photo upload fails"
- Check storage bucket exists and is public
- Check CORS policy allows Vercel domain
- Try uploading smaller image (<5MB)

### "App won't load after deploy"
- Check build logs in Vercel
- Make sure VITE_ prefix on env vars (Vercel requires this)
- Clear browser cache

---

## Next Steps

1. Deploy to Vercel
2. Add first society + vendors
3. Soft launch to 20 residents
4. Monitor bookings for 1 week
5. Full launch to all residents
6. Iterate on feedback
7. Plan Year 2 features (premium listings, transaction fees)

---

**Questions?** Check docs/DESIGN-2026-06-12-zing-hyperlocal-marketplace.md for architecture overview.
