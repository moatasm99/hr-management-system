import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'
import { startOfMonth, format } from 'date-fns'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const now = new Date()
    const currentMonth = startOfMonth(now)

    // Try to fetch existing payroll
    let payroll = await prisma.payroll.findUnique({
        where: {
            userId_month: {
                userId: user.id,
                month: currentMonth
            }
        }
    })

    // If no payroll exists, create a sample one
    if (!payroll) {
        // Get user data for base salary (you might have this in User model)
        const userData = await prisma.user.findUnique({
            where: { id: user.id }
        })

        // Calculate working days and overtime for current month
        const monthStart = startOfMonth(now)
        const attendance = await prisma.attendance.findMany({
            where: {
                userId: user.id,
                date: {
                    gte: monthStart,
                    lte: now
                }
            }
        })

        const workingDays = attendance.filter(a =>
            a.status.includes('PRESENT') || a.status.includes('LATE')
        ).length

        const overtimeHours = attendance.reduce((sum, a) => {
            if (a.status.includes('OVERTIME') && a.checkIn && a.checkOut) {
                const hours = (new Date(a.checkOut).getTime() - new Date(a.checkIn).getTime()) / (1000 * 60 * 60)
                return sum + Math.max(0, hours - 8) // Overtime is hours beyond 8
            }
            return sum
        }, 0)

        const baseSalary = 5000 // Default base salary
        const overtimePayment = overtimeHours * 50 // $50 per overtime hour
        const additions = 1200 // Housing + Transport
        const deductions = 850 // Insurance + Tax
        const netSalary = baseSalary + additions + overtimePayment - deductions

        payroll = await prisma.payroll.create({
            data: {
                userId: user.id,
                month: currentMonth,
                basicSalary: baseSalary,
                additions,
                deductions,
                netSalary
            }
        })
    }

    // Format response with detailed breakdown
    return {
        success: true,
        payroll: {
            id: payroll.id,
            month: format(payroll.month, 'yyyy-MM'),
            baseSalary: payroll.basicSalary,
            additions: [
                { label: 'Housing Allowance', amount: 800 },
                { label: 'Transport Allowance', amount: 400 }
            ],
            deductions: [
                { label: 'Social Insurance', amount: 250 },
                { label: 'Income Tax', amount: 600 }
            ],
            overtimePayment: 450,
            workingDays: 22,
            overtimeHours: 9,
            netSalary: payroll.netSalary
        }
    }
})
