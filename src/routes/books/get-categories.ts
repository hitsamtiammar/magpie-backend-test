import { prisma } from "prisma"

export default async function getCategories(){
    const categories = await prisma.category.findMany()
    return {
        status: true,
        data: categories,
    }
}