-- Full-Stack HR System - Database Schema (Safe Version)
-- This version skips creating types if they already exist

-- Create ENUM types (skip if exists)
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'MANAGER', 'HR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'LATE', 'EARLY_LEAVE', 'ABSENT', 'OVERTIME', 'LEAVE', 'HOLIDAY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "RequestType" AS ENUM ('CASUAL_LEAVE', 'ANNUAL_LEAVE', 'SICK_LEAVE', 'MARRIAGE_LEAVE', 'EXTRA_WORKING_DAY', 'OVERTIME_HOURS', 'EXTERNAL_WORK', 'LATE_ARRIVAL', 'EARLY_LEAVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS "SurveyResponse" CASCADE;
DROP TABLE IF EXISTS "Survey" CASCADE;
DROP TABLE IF EXISTS "Kudos" CASCADE;
DROP TABLE IF EXISTS "ExperiencePost" CASCADE;
DROP TABLE IF EXISTS "Payroll" CASCADE;
DROP TABLE IF EXISTS "Penalty" CASCADE;
DROP TABLE IF EXISTS "Request" CASCADE;
DROP TABLE IF EXISTS "Attendance" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Company" CASCADE;

-- Create Company table
CREATE TABLE "Company" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create User table
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create Attendance table
CREATE TABLE "Attendance" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "location" TEXT,
    "status" "AttendanceStatus"[] NOT NULL DEFAULT ARRAY[]::"AttendanceStatus"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_userId_date_key" UNIQUE ("userId", "date")
);

-- Create Request table
CREATE TABLE "Request" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "type" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "reason" TEXT,
    "managerComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create Penalty table
CREATE TABLE "Penalty" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Penalty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create Payroll table
CREATE TABLE "Payroll" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "month" DATE NOT NULL,
    "basicSalary" DOUBLE PRECISION NOT NULL,
    "additions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payroll_userId_month_key" UNIQUE ("userId", "month")
);

-- Create ExperiencePost table
CREATE TABLE "ExperiencePost" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Kudos table
CREATE TABLE "Kudos" (
    "id" SERIAL PRIMARY KEY,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Kudos_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Kudos_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create Survey table
CREATE TABLE "Survey" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create SurveyResponse table
CREATE TABLE "SurveyResponse" (
    "id" SERIAL PRIMARY KEY,
    "surveyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SurveyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "User_companyId_idx" ON "User"("companyId");
CREATE INDEX "Attendance_userId_idx" ON "Attendance"("userId");
CREATE INDEX "Request_userId_idx" ON "Request"("userId");
CREATE INDEX "Penalty_userId_idx" ON "Penalty"("userId");
CREATE INDEX "Payroll_userId_idx" ON "Payroll"("userId");
CREATE INDEX "Kudos_senderId_idx" ON "Kudos"("senderId");
CREATE INDEX "Kudos_receiverId_idx" ON "Kudos"("receiverId");
CREATE INDEX "SurveyResponse_surveyId_idx" ON "SurveyResponse"("surveyId");
CREATE INDEX "SurveyResponse_userId_idx" ON "SurveyResponse"("userId");
