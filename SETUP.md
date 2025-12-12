# Full-Stack Nuxt 3 HR System - Quick Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Configure Database
Edit the `.env` file with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hr_system"
JWT_SECRET="your-secure-random-secret-key"
```

### 3. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Optional: Seed some test data
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 First Steps

1. **Register Company**: Go to `/auth/register`
2. **Login**: Use your credentials
3. **Explore**: Check attendance, create requests, etc.

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx nuxi typecheck

# Database migrations
npx prisma migrate dev
npx prisma studio  # Visual database editor
```

## 📚 Documentation

See [README.md](./README.md) for full documentation.
See [walkthrough.md](../../../.gemini/antigravity/brain/9a8c0e34-9e22-4cbf-ac7b-334d31ae92ff/walkthrough.md) for detailed feature walkthrough.

## ⚠️ Important Notes

- **Prisma Version**: Using Prisma 5.22.0 for compatibility
- **i18n**: Configured with inline messages in `i18n.config.ts`
- **TypeScript**: Auto-imports are configured by Nuxt
- **Database**: PostgreSQL required (update `.env`)

## 🎯 Key Features

✅ Authentication & RBAC
✅ Attendance Management
✅ Request System
✅ Penalties
✅ Payroll
✅ Employee Experience
✅ i18n (EN/AR)
✅ Dark Mode
✅ Fully Responsive
