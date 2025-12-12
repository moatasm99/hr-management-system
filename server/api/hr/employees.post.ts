import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    // Check if user is HR
    const currentUser = await prisma.user.findUnique({
        where: { id: user.id }
    })

    if (currentUser?.role !== 'HR') {
        throw createError({ statusCode: 403, statusMessage: 'Only HR can add employees' })
    }

    const body = await readBody(event)
    const { name, email, role, password } = body

    // Validate required fields
    if (!name || !email || !role) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        throw createError({ statusCode: 400, statusMessage: 'Email already exists' })
    }

    // Hash password (use provided or generate default)
    const defaultPassword = password || 'Welcome123!'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Create employee
    const employee = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            companyId: currentUser.companyId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyId: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return {
        success: true,
        employee,
        temporaryPassword: password ? undefined : defaultPassword
    }
})
