import { FastifyInstance } from "fastify";
import books from "./books";

export default function v1(fastify: FastifyInstance){
    fastify.register(books, { prefix: '/books' })
}