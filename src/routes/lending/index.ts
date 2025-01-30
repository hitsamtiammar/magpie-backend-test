import { FastifyInstance, FastifyRequest } from "fastify";
import jwtCheck from "middleware/jwt";
import getLending from "./get-lending";
import lendBook, { LendingBookRequest } from "./lend-book";
import returnBook, { ReturnBookRequest } from "./return-book";
import { getLendingSchema, lendBookSchema, returnBookSchema } from "./schema";

export default function lending(fastify: FastifyInstance){
    fastify.addHook('onRequest', jwtCheck);
    fastify.get('/', getLendingSchema, getLending)
    fastify.post<{ Body: LendingBookRequest }>('/lend-book', lendBookSchema, lendBook)
    fastify.put<{ Params: ReturnBookRequest }>('/return-book/:id', returnBookSchema, returnBook)

}