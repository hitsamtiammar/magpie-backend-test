import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "prisma"
import { PutParams } from "./update-book"

export default async function deleteBook(request: FastifyRequest<{
    Params: PutParams
}>, reply: FastifyReply){
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
}