import { FastifyRequest } from "fastify";
import { prisma } from "prisma";

export interface PostRequest{
    title: string;
    categoryId: number;
    author: string;
    quantity: number;
    isbn: string
}

export default async function createBook(request: FastifyRequest<{
    Body: PostRequest
}>){
    const { author, categoryId, isbn, quantity, title } = request.body
    const result = await prisma.book.create({
        data: {
            author,
            isbn,
            quantity,
            title,
            categoryId,
            bookStatus: {
                create: {
                    borrowedQuantity: 0
                }
            }
        }
    })
    return {
        status: true,
        data: result
    }
}