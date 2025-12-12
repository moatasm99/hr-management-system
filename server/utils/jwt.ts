import jwt from 'jsonwebtoken'
import type { UserJwtPayload } from './types'

const config = useRuntimeConfig()
const SECRET = config.jwtSecret

export const signToken = (user: any) => {
    return jwt.sign({ id: user.id, role: user.role, companyId: user.companyId }, SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): UserJwtPayload | null => {
    try {
        return jwt.verify(token, SECRET) as UserJwtPayload
    } catch (e) {
        return null
    }
}

export const getUserFromEvent = (event: any): UserJwtPayload | null => {
    const token = getCookie(event, 'auth_token')
    if (!token) return null
    return verifyToken(token)
}
