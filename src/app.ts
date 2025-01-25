import fastify from 'fastify'
import v1 from './routes/v1'
import cors from '@fastify/cors'
import fastifyJwt, { FastifyJwtNamespace } from '@fastify/jwt'

declare module 'fastify' {
    interface FastifyInstance extends
    FastifyJwtNamespace<{namespace: 'security'}> {
    }
  }

const app = fastify({ logger: true })

export default function build(){
    app.register(cors, {
        origin: false
    })
    app.register(fastifyJwt, {
        secret: 'test12345'
      })
    app.get('/ping', () => {
        return { message:'Success' }
    })
    app.register(v1, { prefix: '/v1' })
    app.setErrorHandler((error, request, reply) => {
        console.log('Error happens', error)
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

