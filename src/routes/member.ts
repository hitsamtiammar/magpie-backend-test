import { FastifyInstance } from "fastify";
import jwtCheck from "middleware/jwt";
import { prisma } from "prisma";

export const getMembers = async() =>{
    const members = await prisma.member.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return {
        status: true,
        data: members
    }
}

export default function members(fastify: FastifyInstance){
    fastify.addHook('onRequest', jwtCheck);
    fastify.get('/',getMembers)

}