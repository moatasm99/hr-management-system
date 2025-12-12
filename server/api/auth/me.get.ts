import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const decoded = getUserFromEvent(event)
    if (!decoded) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        }
    }
})
