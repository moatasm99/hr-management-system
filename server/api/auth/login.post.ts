import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !await bcrypt.compare(password, user.password)) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const token = signToken(user)

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
    })

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        },
        token
    }
})
