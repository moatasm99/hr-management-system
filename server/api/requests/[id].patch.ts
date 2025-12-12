import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    if (user.role === 'EMPLOYEE') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const id = parseInt(event.context.params?.id as string)
    const body = await readBody(event)
    const { status, comment } = body

    const request = await prisma.request.update({
        where: { id },
        data: {
            status,
            managerComment: comment
        }
    })

    return { request }
})
