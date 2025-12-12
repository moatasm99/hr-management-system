import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const body = await readBody(event)
    const { receiverId, message } = body

    if (!receiverId || !message) {
        throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
    }

    const kudos = await prisma.kudos.create({
        data: {
            senderId: user.id,
            receiverId: parseInt(receiverId),
            message
        }
    })

    return { kudos }
})
