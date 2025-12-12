# 🚀 Setup Database with Supabase (Free & Easy!)

## ✨ Why Supabase?
- ✅ Free PostgreSQL database in the cloud
- ✅ No installation needed
- ✅ Ready in 2 minutes
- ✅ Includes database viewer & SQL editor
- ✅ Perfect for development & production

---

## 📋 Step-by-Step Guide

### Step 1: Create Supabase Account

1. **Go to Supabase**:
   - Open: https://supabase.com
   - Click **"Start your project"** or **"Sign Up"**

2. **Sign up** using:
   - GitHub account (recommended - fastest)
   - OR Email & Password

---

### Step 2: Create a New Project

1. **Click "New Project"**

2. **Fill in the details**:
   - **Name**: `hr-system` (or any name you like)
   - **Database Password**: Create a strong password
     - ⚠️ **IMPORTANT**: Copy and save this password! You'll need it later
     - Example: `MySecurePass123!`
   - **Region**: Choose closest to you (e.g., `Europe (Frankfurt)`)
   - **Pricing Plan**: Select **Free** (it's enough for development)

3. **Click "Create new project"**
   - Wait 1-2 minutes while Supabase sets up your database

---

### Step 3: Get Your Database URL

1. **Once the project is ready**, click on **"Settings"** (gear icon on left sidebar)

2. **Click "Database"** in the settings menu

3. **Scroll down to "Connection string"**

4. **Select "URI"** tab

5. **Copy the connection string** - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

6. **Replace `[YOUR-PASSWORD]`** with the password you created in Step 2
   - Example:
   ```
   postgresql://postgres:MySecurePass123!@db.xxxxx.supabase.co:5432/postgres
   ```

---

### Step 4: Update Your .env File

1. **Open the `.env` file** in your project

2. **Replace the DATABASE_URL** with your Supabase connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xxxxx.supabase.co:5432/postgres"
JWT_SECRET="super-secret-key-change-me-in-production"
```

3. **Save the file**

---

### Step 5: Run Database Migrations

Open your terminal in the project folder and run:

```bash
npx prisma migrate dev --name init
```

This will create all the tables in your Supabase database.

---

### Step 6: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## 🎉 Done!

Your HR System is now connected to Supabase!

Open http://localhost:3000/ and:
1. Click **"Register your company"**
2. Fill in the form
3. Create your first HR admin account

---

## 🔍 View Your Database

You can view and manage your database in Supabase:

1. Go to your Supabase project
2. Click **"Table Editor"** on the left sidebar
3. You'll see all your tables (Company, User, Attendance, etc.)

---

## 💡 Tips

- **Free tier limits**: 500MB database, 2GB bandwidth/month (more than enough for development)
- **Upgrade later**: If you need more, you can upgrade to Pro ($25/month)
- **Backups**: Supabase automatically backs up your data
- **Security**: Your database is secure with SSL encryption

---

## ⚠️ Troubleshooting

### "Connection refused" error?
- Check that you replaced `[YOUR-PASSWORD]` with your actual password
- Make sure there are no extra spaces in the connection string

### "Invalid password" error?
- Double-check your password
- You can reset it in Supabase Settings → Database → Reset Database Password

### Still having issues?
Let me know and I'll help! 🤝

---

## 📝 Quick Reference

**Your Supabase Dashboard**: https://app.supabase.com/project/YOUR-PROJECT-ID

**Connection String Format**:
```
postgresql://postgres:PASSWORD@db.PROJECT-ID.supabase.co:5432/postgres
```
