# Full-Stack Nuxt 3 HR System - Quick Database Setup

## 🎯 Current Issue
The application is running but can't connect to the database because it's not set up yet.

**Error**: `Environment variable not found: DATABASE_URL`

## ✅ Solution - Two Options

### Option 1: Use SQLite (Quick & Easy - للتجربة السريعة)

1. **Update Prisma Schema** to use SQLite instead of PostgreSQL:

Open `prisma/schema.prisma` and change:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. **Run migrations**:
```bash
npx prisma migrate dev --name init
```

3. **Restart dev server** (Ctrl+C then `npm run dev`)

---

### Option 2: Use PostgreSQL (Production-Ready - للإنتاج)

1. **Install PostgreSQL** if not installed:
   - Download from: https://www.postgresql.org/download/windows/
   - Or use Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

2. **Create Database**:
```sql
CREATE DATABASE hr_system;
```

3. **Update `.env` file** with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hr_system"
JWT_SECRET="your-super-secret-key-change-in-production"
```

4. **Run migrations**:
```bash
npx prisma migrate dev --name init
```

5. **Restart dev server**

---

## 🚀 Recommended: Use SQLite for Now

Since you want to test quickly, I recommend **Option 1 (SQLite)**. It's:
- ✅ No installation needed
- ✅ Works immediately
- ✅ Perfect for development/testing
- ✅ Easy to switch to PostgreSQL later

Would you like me to set it up with SQLite for you?
