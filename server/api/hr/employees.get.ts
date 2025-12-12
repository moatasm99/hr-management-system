import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'
import { startOfDay, endOfDay } from 'date-fns'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    // Check if user is HR
    const currentUser = await prisma.user.findUnique({
        where: { id: user.id }
    })

    if (currentUser?.role !== 'HR') {
        throw createError({ statusCode: 403, statusMessage: 'Only HR can access this resource' })
    }

    // Fetch all employees in the company
    const employees = await prisma.user.findMany({
        where: {
            companyId: currentUser.companyId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyId: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Calculate today's statistics
    const today = new Date()
    const dayStart = startOfDay(today)
    const dayEnd = endOfDay(today)

    const todayAttendance = await prisma.attendance.findMany({
        where: {
            date: {
                gte: dayStart,
                lte: dayEnd
            }
        },
        select: {
            userId: true,
            status: true
        }
    })

    const todayRequests = await prisma.request.findMany({
        where: {
            status: 'APPROVED',
            fromDate: {
                lte: dayEnd
            },
            OR: [
                { toDate: null },
                { toDate: { gte: dayStart } }
            ],
            type: {
                in: ['CASUAL_LEAVE', 'ANNUAL_LEAVE', 'EXCEPTIONAL_LEAVE']
            }
        },
        select: {
            userId: true
        }
    })

    const presentUserIds = new Set(
        todayAttendance
            .filter(a => a.status.includes('PRESENT') || a.status.includes('LATE'))
            .map(a => a.userId)
    )

    const onLeaveUserIds = new Set(todayRequests.map(r => r.userId))

    const stats = {
        total: employees.length,
        presentToday: presentUserIds.size,
        onLeave: onLeaveUserIds.size,
        absent: employees.length - presentUserIds.size - onLeaveUserIds.size
    }

    return {
        success: true,
        employees,
        stats
    }
})
