import { FastifyInstance } from "fastify";

export default function books(fastify: FastifyInstance){
    fastify.get('/', (request) => {
        return { message: 'This is books page' }
    })
}