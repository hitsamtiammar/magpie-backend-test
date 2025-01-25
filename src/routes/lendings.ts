import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "prisma";
import { LIMIT } from "constant";
import moment from "moment";

export type MyRequest = FastifyRequest<{
    Querystring: { page?: number}
}>

export interface LendingBookRequest{
    memberId: number
    bookId:number
}

export interface ReturnBookRequest{
    id: string
}

export default function lending(fastify: FastifyInstance){
    fastify.get('/', async (request: MyRequest) => {
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
    
    fastify.post<{
        Body: LendingBookRequest
    }>('/lend-book', async(request, reply) => {
        const { bookId, memberId } = request.body
        const borrowedDate = moment()
        const dueDate = borrowedDate.clone().add(1,'month')
        const book = await prisma.book.findFirst({ include: { bookStatus: true }, where: { id: bookId } })
        const member = await prisma.member.findFirst({ where: { id: memberId } })
        if(!book){
            return reply.status(404).send({ status: false, message: `Book with id ${bookId} is not found` })
        }
        if(!member){
            return reply.status(404).send({ status: false, message: `Member with id ${memberId} is not found` })
        }
        const [result] = await prisma.$transaction([
            prisma.lending.create({
                data: {
                    bookId: bookId,
                    memberId: memberId,
                    borrowedDate: borrowedDate.toDate(),
                    dueDate: dueDate.toDate(),
                    createdBy: 1,
                    status: 'BORROWED'
                }
            }),
            prisma.bookStatus.update({
                where: { bookId },
                data: { borrowedQuantity: (book.bookStatus?.borrowedQuantity || 0) + 1  }
            })
        ])
        return {
            status: true,
            data: result,
        } 
    })

    fastify.put<{
        Params: ReturnBookRequest
    }>('/return-book/:id', async(request, reply) => {
        const {id} = request.params
        const lending = await prisma.lending.findFirst({
            where: { id: Number(id) },
            include: {
                book: true
            }
        })
        if(!lending){
            return reply.status(404).send({ status: false, message: `Lending with id ${id} is not found` })
        }
        const bookStatus = await prisma.bookStatus.findFirst({
            where: { bookId: lending.bookId }
        })
        const [result] = await prisma.$transaction([
            prisma.lending.update({
                where: { id: Number(id) },
                data: {
                    status: 'RETURNED'
                }
            }),
            prisma.bookStatus.update({
                where: { bookId: lending.bookId },
                data: { borrowedQuantity: (bookStatus?.borrowedQuantity || 0) - 1  }
            })
        ])
        return {
            status: true,
            data: result,
        }
    })

}