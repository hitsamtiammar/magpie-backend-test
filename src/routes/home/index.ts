import { FastifyInstance } from "fastify";
import login from "./login";
import { loginSchema } from "./schema";

export interface LoginRequest{
    email: string
    password: string
}

export default function home(fastify:FastifyInstance){
    fastify.post('/login', loginSchema, login(fastify))
}