import { FastifyReply, FastifyRequest } from "fastify"
import moment from "moment"
import { prisma } from "prisma"

export interface LendingBookRequest{
    memberId: number
    bookId:number
}

export default async function lendBook(request: FastifyRequest<{
    Body: LendingBookRequest
}>, reply: FastifyReply){
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
}