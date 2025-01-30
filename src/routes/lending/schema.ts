export const getLendingSchema = {
    schema: {
        description: 'API to retrieve lending records with filtering options',
        headers: {
            type: 'object',
            properties: {
                Authorization: {
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            },
            required: ['Authorization']
        },
        querystring: {
            type: 'object',
            properties: {
                page: { type: 'integer', description: 'Page number for pagination' },
                search: { type: 'string', description: 'Search by member name' },
                dueDateStart: { type: 'string', format: 'date', description: 'Filter by due date (start)' },
                dueDateEnd: { type: 'string', format: 'date', description: 'Filter by due date (end)' },
                borrowedDateStart: { type: 'string', format: 'date', description: 'Filter by borrowed date (start)' },
                borrowedDateEnd: { type: 'string', format: 'date', description: 'Filter by borrowed date (end)' },
                status: { 
                    type: 'string', 
                    enum: ['RETURNED', 'BORROWED'], 
                    description: 'Filter by lending status'
                }
            }
        },
        response: {
            200: {
                description: 'Successful response',
                type: 'object',
                properties: {
                    status: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', description: 'Lending ID' },
                                book: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer', description: 'Book ID' },
                                        title: { type: 'string', description: 'Book title' }
                                    }
                                },
                                Member: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer', description: 'Member ID' },
                                        name: { type: 'string', description: 'Member name' }
                                    }
                                },
                                borrowedDate: { type: 'string', format: 'date-time', description: 'Borrowed date' },
                                dueDate: { type: 'string', format: 'date-time', description: 'Due date' },
                                status: { 
                                    type: 'string', 
                                    enum: ['RETURNED', 'BORROWED'], 
                                    description: 'Current lending status'
                                }
                            }
                        }
                    },
                    count: { type: 'integer', description: 'Total count of records' },
                    totalPage: { type: 'integer', description: 'Total pages available' },
                    page: { type: 'integer', description: 'Current page number' }
                }
            }
        }
    }
}

export const lendBookSchema = {
    schema: {
        description: 'API to lend a book to a member',
        headers: {
            type: 'object',
            properties: {
                Authorization: {
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            },
            required: ['Authorization']
        },
        body: {
            type: 'object',
            required: ['memberId', 'bookId'],
            properties: {
                memberId: { type: 'integer', description: 'ID of the member borrowing the book' },
                bookId: { type: 'integer', description: 'ID of the book being borrowed' }
            }
        },
        response: {
            200: {
                description: 'Successful response',
                type: 'object',
                properties: {
                    status: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', description: 'Lending transaction ID' },
                            bookId: { type: 'integer', description: 'ID of the book' },
                            memberId: { type: 'integer', description: 'ID of the member' },
                            borrowedDate: { type: 'string', format: 'date-time', description: 'Borrowed date' },
                            dueDate: { type: 'string', format: 'date-time', description: 'Due date' },
                            status: { type: 'string', enum: ['BORROWED'], description: 'Lending status' },
                            createdBy: { type: 'integer', description: 'ID of the user who created the record' }
                        }
                    }
                }
            },
            404: {
                description: 'Book or member not found',
                type: 'object',
                properties: {
                    status: { type: 'boolean' },
                    message: { type: 'string', description: 'Error message' }
                }
            }
        }
    }
}

export const returnBookSchema = {
    schema: {
        description: 'API to return a borrowed book',
        headers: {
            type: 'object',
            properties: {
                Authorization: {
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            },
            required: ['Authorization']
        },
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', description: 'ID of the lending record to return' }
            }
        },
        response: {
            200: {
                description: 'Successful response',
                type: 'object',
                properties: {
                    status: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', description: 'Lending record ID' },
                            bookId: { type: 'integer', description: 'ID of the book' },
                            status: { type: 'string', enum: ['RETURNED'], description: 'Lending status' },
                            createdBy: { type: 'integer', description: 'ID of the user who created the record' }
                        }
                    }
                }
            },
            404: {
                description: 'Lending not found',
                type: 'object',
                properties: {
                    status: { type: 'boolean' },
                    message: { type: 'string', description: 'Error message' }
                }
            }
        }
    }
}