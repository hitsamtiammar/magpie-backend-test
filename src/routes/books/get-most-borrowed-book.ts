import { prisma } from "prisma"

export default async function getMostBorrowedBook(){
    const lending = await prisma.book.findMany({
        take: 5,
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
        data: lending.map((item) => {
            const countLending = item._count.lending
                return {
                id: item.id,
                title: item.title,
                countLending
            }
        }),
    }
}