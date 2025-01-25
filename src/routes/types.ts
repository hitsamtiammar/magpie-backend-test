import { FastifyRequest } from "fastify"

export type GetRequest = FastifyRequest<{
    Querystring: { page?: number}
  }>