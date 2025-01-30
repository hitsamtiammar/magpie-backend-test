import { FastifyInstance, FastifyRequest } from "fastify";

import jwtCheck from "middleware/jwt";
import getBooks from "./get-books";
import getCategories from "./get-categories";
import getMostBorrowedBook from "./get-most-borrowed-book";
import getMonthlyLendingTrend from "./get-monthly-lending-trend";
import createBook, { PostRequest } from "./create-book";
import updateBook, { PutParams } from "./update-book";
import deleteBook from "./delete-book";
import {
    createBookSchema,
    getBooksSchema,
    getCategoriesSchema,
    getMostBorrowedBookSchema,
    getMonthlyLendingTrendSchema,
    updateBookSchema,
    deleteBookSchema
} from "./schema";

export interface UpdateBookSchema{
    Params: PutParams,
    Body: PostRequest
}

export default function books(fastify: FastifyInstance){
    fastify.addHook('onRequest', jwtCheck)
    fastify.get('/', getBooksSchema,  getBooks)
    fastify.get('/categories', getCategoriesSchema, getCategories)  
    fastify.get('/most-borrowed-book', getMostBorrowedBookSchema, getMostBorrowedBook)
    fastify.get('/monthly-lending-trend', getMonthlyLendingTrendSchema, getMonthlyLendingTrend)
    fastify.post<{ Body: PostRequest }>('/', createBookSchema, createBook)
    fastify.put<UpdateBookSchema>('/:id', updateBookSchema, updateBook)
    fastify.delete<{ Params: PutParams }>('/:id', deleteBookSchema,  deleteBook)
}