import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "prisma";
import { LIMIT } from "constant";
import moment from "moment";
import jwtCheck from "middleware/jwt";
import { Prisma } from "@prisma/client";

export type MyRequest = FastifyRequest<{
    Querystring: { 
        page?: number; 
        search?: string;
        dueDateStart?: string;
        dueDateEnd?: string;
        borrowedDateStart?: string;
        borrowedDateEnd?: string;
        status?: 'RETURNED' | 'BORROWED'
    }
}>

export interface LendingBookRequest{
    memberId: number
    bookId:number
}

export interface ReturnBookRequest{
    id: string
}

export default function lending(fastify: FastifyInstance){
    fastify.addHook('onRequest', jwtCheck);
    fastify.get('/', async (request: MyRequest) => {
        const query = request.query;
        const page = query.page || 1;

        let where:Prisma.LendingWhereInput = {};
        if(query.search){
            where = {
                ...where,
                Member: {
                    name: {
                        mode: 'insensitive',
                        contains: `%${query.search}%`,
                    }
                }
            }
        }

        if(query.dueDateStart && query.dueDateStart){
            where = {
                ...where,
                dueDate: {
                    gte: moment(query.dueDateStart).toDate(),
                    lte: moment(query.dueDateEnd).toDate()
                },
            }
        }

        if(query.borrowedDateStart && query.borrowedDateEnd){
            where = {
                ...where,
                borrowedDate: {
                    gte: moment(query.borrowedDateStart).toDate(),
                    lte: moment(query.borrowedDateEnd).toDate()
                },
            }
        }

        if(query.status){
            where = {
                ...where,
                status: query.status
            }
        }

        const lending = await prisma.lending.findMany({
            orderBy: {
                id: 'desc'
            },
            take: LIMIT,
            skip: (page - 1) * LIMIT,
            include: {
                book: true,
                Member: true
            },
            where
        })
        const countLending = await prisma.lending.count({
            where
        })
        const totalPage = Math.ceil(countLending / 10)
        return {
            status: true,
            data: lending,
            count: countLending,
            totalPage,
            page,
        }
    })
    
    fastify.post<{
        Body: LendingBookRequest
    }>('/lend-book', {}, async(request, reply) => {

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