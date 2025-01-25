import fastify, { FastifyInstance } from 'fastify'
import v1 from './routes/v1'

const app = fastify({ logger: true })

export default function build(){
    app.get('/ping', (request) => {
        return { message:'Success 123' }
    })
    app.register(v1, { prefix: '/v1' })
    app.setErrorHandler((error, request, reply) => {
        console.log('Error on books', error)
        let name = error.name;
        let cause = error.cause;
        let message = error.message
        let code = 500
        if(name === 'PrismaClientValidationError'){
            const messageSplit = message.split("\n")
            message = messageSplit[messageSplit.length - 1]
            code = 400
        }
        reply.status(code).send({
            status: false,
            cause: cause,
            message: message
        })
      })

    return app;
}

