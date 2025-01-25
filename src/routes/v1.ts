import { FastifyInstance } from "fastify";
import books from "./books";
import lending from "./lendings";
import home from "./home";

export default function v1(fastify: FastifyInstance){
    fastify.register(home, { prefix: '/' })
    fastify.register(books, { prefix: '/books' })
    fastify.register(lending, { prefix: '/lending' })
}