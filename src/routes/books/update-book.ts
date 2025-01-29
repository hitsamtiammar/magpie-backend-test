import { FastifyRequest } from "fastify"
import { prisma } from "prisma"
import { PostRequest } from "./create-book"

export interface PutParams{
    id: string
}

export default async function updateBook(request: FastifyRequest<{
    Body: PostRequest,
    Params:PutParams
}>){
    const {id} = request.params
    const result = await prisma.book.update({
        where: { id: Number(id) },
        data: {
            ...request.body
        }
    })
    return {
        status: true,
        data: result
    }
}