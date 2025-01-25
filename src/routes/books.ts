import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "prisma";
import { LIMIT } from "constant";

export type GetRequest = FastifyRequest<{
    Querystring: { page?: number}
}>

export interface PostRequest{
    title: string;
    categoryId: number;
    author: string;
    quantity: number;
    isbn: string
}

export interface PutParams{
    id: string
}

export default function books(fastify: FastifyInstance){
    fastify.get('/', async (request: GetRequest, reply) => {
        const query = request.query;
        const page = query.page || 1;
        const books = await prisma.book.findMany({
            take: LIMIT,
            skip: (page - 1) * LIMIT,
        })
        return {
            status: true,
            data: books,
            page,
        }
    })

    fastify.post<{
        Body: PostRequest
    }>('/', async (request) => {
        const { author, categoryId, isbn, quantity, title } = request.body
        const result = await prisma.book.create({
            data: {
                author,
                isbn,
                quantity,
                title,
                categoryId,
                bookStatus: {
                    create: {
                        availableQuantity: 0,
                        borrowedQuantity: 0
                    }
                }
            }
        })
        return {
            status: true,
            data: result
        }
    })

    fastify.put<{
        Params: PutParams,
        Body: PostRequest
    }>('/:id', async (request) => {
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
    })

    fastify.delete<{
        Params: PutParams
    }>('/:id', async(request, reply) => {
        const {id} = request.params
        const checkData = await prisma.book.findFirst({ where: { id: Number(id) }, include: { bookStatus: true } })
        if(!checkData){
            return reply.code(404).send({ status: false, message: `Book with id ${id} is not found` })
        }
        const bookStatus = checkData.bookStatus 
        if(bookStatus?.borrowedQuantity !== 0){
            return reply.code(403).send({ status: false, message: 'There is still member who borrow this book' })
        }
        await prisma.$transaction([
            prisma.bookStatus.delete({ where: { id: checkData.bookStatus?.id } }),
            prisma.book.delete({ where: { id: checkData.id } })
        ])
         return {
            status: true,
            data: checkData
        }
    })

}