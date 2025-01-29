import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "prisma"

export interface ReturnBookRequest{
    id: string
}

export default async function returnBook(request: FastifyRequest<{
    Params: ReturnBookRequest
}>, reply: FastifyReply){
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
}