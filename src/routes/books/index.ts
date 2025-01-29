import { FastifyInstance, FastifyRequest } from "fastify";
import jwtCheck from "middleware/jwt";
import getBooks from "./get-books";
import getCategories from "./get-categories";
import getMostBorrowedBook from "./get-most-borrowed-book";
import getMonthlyLendingTrend from "./get-monthly-lending-trend";
import createBook, { PostRequest } from "./create-book";
import updateBook, { PutParams } from "./update-book";
import deleteBook from "./delete-book";

export default function books(fastify: FastifyInstance){
    fastify.addHook('onRequest', jwtCheck)
    fastify.get('/',  getBooks)
    fastify.get('/categories', getCategories)  
    fastify.get('/most-borrowed-book', getMostBorrowedBook)
    fastify.get('/monthly-lending-trend', getMonthlyLendingTrend)
    fastify.post<{ Body: PostRequest }>('/', createBook)
    fastify.put<{
        Params: PutParams,
        Body: PostRequest
    }>('/:id', updateBook)
    fastify.delete<{
        Params: PutParams
    }>('/:id', deleteBook)

}