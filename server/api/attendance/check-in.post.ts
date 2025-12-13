import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
    console.log('[API START] /api/attendance/check-in')
    try {
        const user = getUserFromEvent(event)
        if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

        const body = await readBody(event)
        const { location } = body

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Check availability
        const existing = await prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId: user.id,
                    date: today
                }
            }
        })

        if (existing && existing.checkIn) {
            console.warn(`[Check-in Failed] User ${user.id} already checked in today`)
            throw createError({ statusCode: 400, statusMessage: 'Already checked in' })
        }

        const attendance = await prisma.attendance.upsert({
            where: {
                userId_date: {
                    userId: user.id,
                    date: today
                }
            },
            update: {
                checkIn: new Date(),
                location,
                status: { push: 'PRESENT' }
            },
            create: {
                userId: user.id,
                date: today,
                checkIn: new Date(),
                location,
                status: ['PRESENT']
            }
        })

        console.log(`[API SUCCESS] User ${user.id} checked in at ${location}`)

        return {
            success: true,
            attendance: {
                id: attendance.id,
                userId: attendance.userId,
                date: attendance.date.toISOString().split('T')[0],
                checkIn: attendance.checkIn ? attendance.checkIn.toISOString() : null,
                checkOut: attendance.checkOut ? attendance.checkOut.toISOString() : null,
                location: attendance.location,
                status: attendance.status
            }
        }
    } catch (error: any) {
        console.error('[API ERROR] /api/attendance/check-in:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || ('Internal Server Error: ' + error.message)
        })
    }
})
