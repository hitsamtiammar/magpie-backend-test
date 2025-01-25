import { FastifyInstance } from "fastify";
import books from "./books";
import lending from "./lendings";

export default function v1(fastify: FastifyInstance){
    fastify.register(books, { prefix: '/books' })
    fastify.register(lending, { prefix: '/lending' })
}