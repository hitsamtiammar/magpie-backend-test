import build from './app'

const app = build()

app.listen({ port: Number(process.env.PORT) || 3004 }, (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
      }
     console.log('App is running')
})