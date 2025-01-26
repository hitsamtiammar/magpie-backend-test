import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "prisma";
import { LIMIT } from "constant";
import jwtCheck from "middleware/jwt";
import moment from "moment";

export type GetRequest = FastifyRequest<{
    Querystring: { page?: number}
}>

export type GetMonthyRequest = FastifyRequest<{
    Querystring: { month?: string; year?: string }
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
    fastify.addHook('onRequest', jwtCheck)
    fastify.get('/', {
    },  async (request: GetRequest, reply) => {
        const query = request.query;
        const page = query.page || 1;
        const books = await prisma.book.findMany({
            take: LIMIT,
            skip: (page - 1) * LIMIT,
            include: {
                category: true
            }
        })
        const countBooks = await prisma.book.count()
        return {
            status: true,
            data: books,
            count: countBooks,
            page,
        }
    })

    fastify.get('/most-borrowed-book', async (request: GetMonthyRequest) => {
        const lending = await prisma.book.findMany({
            take: 10,
            orderBy: {
                lending: {
                    _count: 'desc'
                }
            },
            include :{
                _count: {
                    select: { lending: true }
                }
            },
        })
        return {
            status: true,
            data: lending,
        }
    })

    fastify.get('/monthly-lending-trend', async (request: GetMonthyRequest) => {
        const { month = 'January', year = new Date().getFullYear() } = request.query
        const mDate = moment(`${year} ${month}`, 'YYYY MMMM')
        const fDate = mDate.clone().startOf('month')
        const lDate = mDate.clone().endOf('month')
        console.log('a', {mDate, fDate, lDate})
        const lending = await prisma.lending.groupBy({
            by: ['bookId'],
            take: 10,
            _count: {
                id: true,
            },
            where: {
                status: 'BORROWED',
                borrowedDate: {
                    gte: fDate.toDate(),
                    lte: lDate.toDate()
                }
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            }
        })
        const bookLendings = await prisma.lending.findMany({
            include: {
                book: true
            },
            where: {
                bookId: {
                    in: lending.map(item => item.bookId)
                }
            }
        })
        const booksMap = lending.map(lend => {
            const bookLending = bookLendings.find(book => lend.bookId === book.bookId)
            return {
                id: bookLending?.id,
                bookName: bookLending?.book.title,
                countLend: lend?._count.id || 0,
                borrowDate: bookLending?.borrowedDate
            }
        })
        return {
            status: true,
            data: booksMap
        }
    })

    fastify.post<{
        Body: PostRequest
    }>('/', {  }, async (request) => {
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