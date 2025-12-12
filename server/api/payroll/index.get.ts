import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    let where = {}
    if (user.role === 'EMPLOYEE') {
        where = { userId: user.id }
    } else if (user.role === 'HR') {
        where = { user: { companyId: user.companyId } }
    } else {
        // Manager might see team payroll? Usually confidential. Let's restrict to own or HR.
        // If manager, only see own.
        where = { userId: user.id }
    }

    const payrolls = await prisma.payroll.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: { month: 'desc' }
    })

    return { payrolls }
})
