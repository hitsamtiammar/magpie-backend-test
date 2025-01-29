import { Prisma } from "@prisma/client";
import { LIMIT } from "constant";
import { FastifyRequest } from "fastify";
import { prisma } from "prisma";

export type GetRequest = FastifyRequest<{
    Querystring: { 
        page?: number;
        search?: string;
        showAll?:string;
        quantity?: number;
        categoryId?: number;
    }
}>

export default async function getBooks(request: GetRequest){
    const query = request.query;
    const page = query.page || 1;
    let where: Prisma.BookWhereInput = {};
    let orderBy: Prisma.BookOrderByWithRelationInput =  { id: 'desc' }
    let takeLimit:object = {
        take: LIMIT,
        skip: (page - 1) * LIMIT
    }
    if(query.search){
        where = {
            ...where,
            title: {
                mode: 'insensitive',
                contains: `%${query.search}%`,
            }
        }
    }

    if(query.quantity){
        where = {
            ...where,
            quantity: {
                gte: Number(query.quantity)
            }
        }
    }

    if(query.categoryId){
        where = {
            ...where,
            categoryId: Number(query.categoryId)
        }
    }

    if(query.showAll && query.showAll === 'true'){
        orderBy = {
            title: 'asc'
        }
        takeLimit = {}
    }
    const books = await prisma.book.findMany({
        ...takeLimit,
        orderBy: orderBy,
        where,
        include: {
            _count: {
                select: {
                    lending: true
                }
            },
            category: true,
        }
    })
    const countBooks = await prisma.book.count({
        where
    })
    const totalPage = Math.ceil(countBooks / 10)
    return {
        status: true,
        data: books,
        count: countBooks,
        totalPage,
        page,
    }
}