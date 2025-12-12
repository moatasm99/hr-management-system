# 🐘 PostgreSQL Installation & Setup Guide

## 📥 Step 1: Download & Install PostgreSQL

### Option A: Official Installer (Recommended)
1. **Download PostgreSQL**:
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose the latest version (16.x)
   - Download the Windows x86-64 installer

2. **Run the Installer**:
   - Double-click the downloaded `.exe` file
   - Click "Next" through the setup wizard
   - **Important**: Remember the password you set for the `postgres` user!
   - Default port: `5432` (keep it)
   - Click "Next" and "Finish"

### Option B: Using Docker (If you have Docker)
```bash
docker run --name postgres-hr -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
```

---

## 🗄️ Step 2: Create Database

### Using pgAdmin (Comes with PostgreSQL)
1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to PostgreSQL (use the password you set)
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `hr_system`
5. Click "Save"

### OR Using Command Line
```bash
# Open PowerShell and run:
psql -U postgres
# Enter your password when prompted

# Then create database:
CREATE DATABASE hr_system;

# Exit:
\q
```

---

## ⚙️ Step 3: Update .env File

Open the `.env` file in your project and update it:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hr_system"
JWT_SECRET="super-secret-key-change-me-in-production"
```

**Replace `YOUR_PASSWORD`** with the password you set during PostgreSQL installation!

---

## 🚀 Step 4: Run Migrations

In your project terminal, run:

```bash
npx prisma migrate dev --name init
```

This will create all the database tables.

---

## ✅ Step 5: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## 🎉 Done!

Now open http://localhost:3000/ and you should see the login page!

Click "Register your company" to create your first account.

---

## ⚠️ Troubleshooting

### "Connection refused" error?
- Make sure PostgreSQL service is running
- Check Windows Services → PostgreSQL should be "Running"

### "Password authentication failed"?
- Double-check the password in your `.env` file
- Make sure it matches the password you set during installation

### Still having issues?
Let me know and I'll help you debug! 🤝

---

## 📝 Quick Reference

**Default PostgreSQL Credentials:**
- Username: `postgres`
- Port: `5432`
- Host: `localhost`

**Your Database:**
- Name: `hr_system`
- URL format: `postgresql://username:password@localhost:5432/database_name`
