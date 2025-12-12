import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const body = await readBody(event)
    const { location } = body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if already checked in
    const existing = await prisma.attendance.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today
            }
        }
    })

    if (existing && existing.checkIn) {
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

    return { success: true, attendance }
})
