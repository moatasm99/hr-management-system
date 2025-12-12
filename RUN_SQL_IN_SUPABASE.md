# 🗄️ Setup Database Using Supabase SQL Editor

## 📋 Steps to Create Database Tables

### Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Open your project
3. Click **"SQL Editor"** on the left sidebar
4. Click **"New query"**

---

### Step 2: Copy & Run the SQL Script

1. **Open the file**: `database-setup.sql` (in your project folder)
2. **Copy ALL the content** (Ctrl+A, then Ctrl+C)
3. **Paste it** in the Supabase SQL Editor
4. **Click "Run"** (or press Ctrl+Enter)

---

### Step 3: Verify Tables Created

1. Click **"Table Editor"** on the left sidebar
2. You should see all these tables:
   - ✅ Company
   - ✅ User
   - ✅ Attendance
   - ✅ Request
   - ✅ Penalty
   - ✅ Payroll
   - ✅ ExperiencePost
   - ✅ Kudos
   - ✅ Survey
   - ✅ SurveyResponse

---

### Step 4: Generate Prisma Client

Back in your terminal, run:

```bash
npx prisma generate
```

---

### Step 5: Restart Dev Server

```bash
# Stop current server (Ctrl+C if running)
npm run dev
```

---

## 🎉 Done!

Now open http://localhost:3000/ and:
1. Click **"Register your company"**
2. Fill in the form
3. Create your first HR admin account

---

## ⚠️ If You Get Errors

If the SQL script gives errors about "already exists":
1. That's okay! It means some tables are already there
2. Just continue to Step 4 (Generate Prisma Client)

---

## 💡 Quick Test

After creating your account, try:
- ✅ Login with your credentials
- ✅ Check the attendance calendar
- ✅ Create a request
- ✅ Send kudos to yourself!

Enjoy your HR System! 🚀
