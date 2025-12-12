import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
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
})
