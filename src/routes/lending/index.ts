import { FastifyInstance, FastifyRequest } from "fastify";
import jwtCheck from "middleware/jwt";
import getLending from "./get-lending";
import lendBook, { LendingBookRequest } from "./lend-book";
import returnBook, { ReturnBookRequest } from "./return-book";

export default function lending(fastify: FastifyInstance){
    fastify.addHook('onRequest', jwtCheck);
    fastify.get('/', getLending)
    fastify.post<{
        Body: LendingBookRequest
    }>('/lend-book', lendBook)
    fastify.put<{
        Params: ReturnBookRequest
    }>('/return-book/:id', returnBook)

}