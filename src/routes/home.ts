import { FastifyInstance } from "fastify";
import { prisma } from "prisma";
import bcrypt from 'bcrypt'

export interface LoginRequest{
    email: string
    password: string
}

export default function home(fastify:FastifyInstance){
    fastify.post<
       { Body: LoginRequest}
    >('/login', async (request, reply) => {
        const { email, password } = request.body
        const checkUser = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if(!checkUser){
            return reply.status(404).send({ status: false, message: 'User not found' })
        }
        const token = fastify.jwt.sign({ user: checkUser.name, email, date: new Date().getTime() })
        const check = await bcrypt.compare(password, checkUser.password)
        if(!check){
            return reply.status(400).send({ status: false, message: 'Password wrong' })
        }
        return {
            status: true,
            token
        }
    })
}