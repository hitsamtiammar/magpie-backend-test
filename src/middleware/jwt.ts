import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function jwtCheck(request: FastifyRequest, reply: FastifyReply){
    try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
}