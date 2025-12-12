import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const method = event.method

    if (method === 'GET') {
        // Fetch kudos for user
        const kudos = await prisma.kudos.findMany({
            where: {
                OR: [
                    { senderId: user.id },
                    { receiverId: user.id }
                ]
            },
            include: {
                sender: {
                    select: { name: true }
                },
                receiver: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        })

        return {
            success: true,
            kudos: kudos.map(k => ({
                ...k,
                fromUser: k.sender,
                toUser: k.receiver
            }))
        }
    }

    if (method === 'POST') {
        // Send kudos
        const body = await readBody(event)
        const { toUserId, message, badge } = body

        if (!toUserId || !message || !badge) {
            throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
        }

        const kudos = await prisma.kudos.create({
            data: {
                senderId: user.id,
                receiverId: toUserId,
                message,
                badge
            },
            include: {
                sender: {
                    select: { name: true }
                },
                receiver: {
                    select: { name: true }
                }
            }
        })

        return {
            success: true,
            kudos: {
                ...kudos,
                fromUser: kudos.sender,
                toUser: kudos.receiver
            }
        }
    }

    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
