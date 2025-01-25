import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "prisma";
import { LIMIT } from "constant";

export type MyRequest = FastifyRequest<{
    Querystring: { page?: number}
  }>

export default function lending(fastify: FastifyInstance){
    fastify.get('/', async (request: MyRequest, reply) => {
        const query = request.query;
        const page = query.page || 1;
        const lending = await prisma.lending.findMany({
            take: LIMIT,
            skip: (page - 1) * LIMIT,
            include: {
                book: true,
                Member: true
            }
        })
        return {
            status: true,
            data: lending,
            page,
        }
    })
}