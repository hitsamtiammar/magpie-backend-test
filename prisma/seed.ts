import { Lending, Prisma, PrismaClient, BorrowStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import moment from 'moment'

const prisma = new PrismaClient()


async function generateCategories(){
  console.log('Start seeding categories')
  for(let i = 0; i < 20; i++){
    await prisma.category.create({
      data: {
        name: faker.book.genre()
      }
    })
  }
}

async function generateBook(){
  console.log('Start seeding books')
  const categories = await prisma.category.findMany()
  
  for(let i = 0; i < 300; i++){
    await prisma.book.create({
      data: {
        author: faker.book.author(),
        isbn: faker.commerce.isbn(),
        quantity: Math.floor(Math.random() * 50),
        title: faker.book.title(),
        categoryId: categories[Math.floor(Math.random() * categories.length)].id,
        bookStatus: {
          create: {
            availableQuantity : 0,
            borrowedQuantity: 0
          }
        }
      }
    })
  }
}

async function generateMemberUserLending(){
  console.log('Start Seeding member and user')
  const admin = await prisma.user.create({
    data: {
      email: 'hitsam@test.com',
      name: 'Hitsam Tiammar',
      password: await bcrypt.hash('password123',10),
      role: 'admin'
    }
  })
  const bookCount = await prisma.book.count()


  for(let i = 0; i < 100; i++){
    const email = faker.internet.email()
    const name = faker.person.fullName()
    const borrowedDate = faker.date.between({ from: '2024-10-10', to: '2025-01-20' })
    const dueDate = moment(borrowedDate).add(14,'day')
    await prisma.member.create({
      data: {
        email: email,
        joinedDate: faker.date.past(),
        name: name,
        phone: faker.phone.number(),
        lending: {
          create: [{
            bookId: Math.floor(Math.random() * (bookCount - 1 + 1)) + 1,
            borrowedDate: borrowedDate,
            dueDate: dueDate.toDate(),
            createdBy: admin.id,
          }]
        }
      },
      include: {
        lending: true
      }
    })
    
  }


}

async function main() {
  console.log(`Start seeding ...`)

  await generateCategories()
  await generateBook()
  await generateMemberUserLending()

  // for (const u of userData) {
  //   const user = await prisma.user.create({
  //     data: u,
  //   })
  //   console.log(`Created user with id: ${user.id}`)
  // }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
