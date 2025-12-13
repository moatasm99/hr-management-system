import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
    console.log('[API START] /api/attendance/check-out')
    try {
        const user = getUserFromEvent(event)
        if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const attendance = await prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId: user.id,
                    date: today
                }
            }
        })

        if (!attendance || !attendance.checkIn) {
            console.warn(`[Check-out Failed] User ${user.id} not checked in`)
            throw createError({ statusCode: 400, statusMessage: 'Must check in first' })
        }

        if (attendance.checkOut) {
            console.warn(`[Check-out Failed] User ${user.id} already checked out`)
            throw createError({ statusCode: 400, statusMessage: 'Already checked out' })
        }

        const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: new Date()
            }
        })

        console.log(`[API SUCCESS] User ${user.id} checked out`)

        return {
            success: true,
            attendance: {
                id: updated.id,
                userId: updated.userId,
                date: updated.date.toISOString().split('T')[0],
                checkIn: updated.checkIn ? updated.checkIn.toISOString() : null,
                checkOut: updated.checkOut ? updated.checkOut.toISOString() : null,
                location: updated.location,
                status: updated.status
            }
        }
    } catch (error: any) {
        console.error('[API ERROR] /api/attendance/check-out:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || ('Internal Server Error: ' + error.message)
        })
    }
})
