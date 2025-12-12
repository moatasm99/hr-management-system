import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'
import { startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const query = getQuery(event)
    const dateStr = query.date as string
    const targetDate = dateStr ? parseISO(dateStr) : new Date()

    const monthStart = startOfMonth(targetDate)
    const monthEnd = endOfMonth(targetDate)

    // Fetch all attendance records for the month
    const attendanceRecords = await prisma.attendance.findMany({
        where: {
            userId: user.id,
            date: {
                gte: monthStart,
                lte: monthEnd
            }
        },
        orderBy: {
            date: 'asc'
        }
    })

    // Fetch all requests for the month
    // Fetch all requests for the month
    const requests = await prisma.request.findMany({
        where: {
            userId: user.id,
            OR: [
                {
                    startDate: {
                        gte: monthStart,
                        lte: monthEnd
                    }
                },
                {
                    AND: [
                        { startDate: { lte: monthStart } },
                        { endDate: { gte: monthStart } }
                    ]
                }
            ]
        }
    })

    // Create a map of attendance by date
    const attendanceMap = new Map()
    attendanceRecords.forEach(record => {
        const dateKey = record.date.toISOString().split('T')[0]
        attendanceMap.set(dateKey, {
            id: record.id,
            date: dateKey,
            checkIn: record.checkIn?.toISOString(),
            checkOut: record.checkOut?.toISOString(),
            location: record.location,
            status: record.status
        })
    })

    // Create a map of requests by date
    const requestsMap = new Map()
    requests.forEach((request: any) => {
        const fromDate = new Date(request.startDate)
        const toDate = request.endDate ? new Date(request.endDate) : fromDate

        const days = eachDayOfInterval({ start: fromDate, end: toDate })
        days.forEach(day => {
            if (day >= monthStart && day <= monthEnd) {
                const dateKey = day.toISOString().split('T')[0]
                if (!requestsMap.has(dateKey)) {
                    requestsMap.set(dateKey, [])
                }
                requestsMap.get(dateKey).push({
                    id: request.id,
                    type: request.type,
                    status: request.status
                })
            }
        })
    })

    // Generate all days in the month
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const calendar = allDays.map(day => {
        const dateKey = day.toISOString().split('T')[0]
        const attendance = attendanceMap.get(dateKey)
        const dayRequests = requestsMap.get(dateKey) || []

        return {
            date: dateKey,
            dayOfWeek: day.getDay(),
            attendance: attendance || null,
            requests: dayRequests
        }
    })

    return {
        success: true,
        month: targetDate.toISOString().split('T')[0].substring(0, 7),
        calendar,
        records: attendanceRecords // Keep for backward compatibility
    }
})
