export const loginSchema =  {
    schema: {
        description: 'Api for login',
        body: {
            type: 'object',
            properties: {
            email: {
                type: 'string',
                description: 'Email to input'
            },
            password: {
                type: 'string',
                    description: 'password to input'
            }
            }
        },
        response: {
            201: {
            description: 'Successful response',
            type: 'object',
            properties: {
                status: { type: 'boolean' },
                token: { type: 'string' }
            }
            },
        },
    }
}