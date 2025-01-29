import { Prisma } from "@prisma/client";
import { LIMIT } from "constant";
import { FastifyRequest } from "fastify";
import moment from "moment";
import { prisma } from "prisma";

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

export default async function getLending(request: MyRequest){
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
}