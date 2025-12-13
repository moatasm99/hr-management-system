import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
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

        if (!attendance) {
            return {
                checkIn: null,
                checkOut: null,
                location: null
            }
        }

        return attendance
    } catch (error: any) {
        console.error('[Today Attendance API Error]:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: 'Internal Server Error: ' + (error.message || error)
        })
    }
})
