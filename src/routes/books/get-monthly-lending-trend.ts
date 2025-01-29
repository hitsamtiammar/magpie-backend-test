import { FastifyRequest } from "fastify";
import moment from "moment";
import { prisma } from "prisma";

export type GetMonthyRequest = FastifyRequest<{
    Querystring: { month?: string; year?: string }
}>


export default async function getMonthlyLendingTrend(request: GetMonthyRequest){
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
}