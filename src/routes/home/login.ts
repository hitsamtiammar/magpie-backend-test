import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "prisma"
import bcrypt from 'bcrypt'

export interface LoginRequest{
    email: string
    password: string
}

export default (fastify: FastifyInstance) =>  async function login(request: FastifyRequest<{
    Body: LoginRequest
}>, reply: FastifyReply){
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
    return reply.status(201).send({
        status: true,
        token
    })
}