import { FastifyInstance } from "fastify";
import books from "./books";
import lending from "./lending";
import home from "./home";
import members from "./member";

export default function v1(fastify: FastifyInstance){
    fastify.register(home, { prefix: '/' })
    fastify.register(books, { prefix: '/books' })
    fastify.register(lending, { prefix: '/lending' })
    fastify.register(members, { prefix: '/members' })
}