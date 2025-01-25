import fastify, { FastifyInstance } from 'fastify'
import v1 from './routes/v1'

const app = fastify({ logger: true })

export default function build(){
    app.get('/ping', (request) => {
        return { message:'Success 123' }
    })
    app.register(v1, { prefix: '/v1' })

    return app;
}

