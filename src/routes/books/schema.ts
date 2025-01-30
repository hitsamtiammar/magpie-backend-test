export const createBookSchema = {
    schema: {
        description: 'API to create a new book',
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
            required: ['title', 'categoryId', 'author', 'quantity', 'isbn'],
            properties: {
                title: { type: 'string', description: 'Title of the book' },
                categoryId: { type: 'integer', description: 'ID of the category the book belongs to' },
                author: { type: 'string', description: 'Name of the book author' },
                quantity: { type: 'integer', description: 'Total quantity of the book' },
                isbn: { type: 'string', description: 'ISBN number of the book' }
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
                            id: { type: 'integer', description: 'ID of the created book' },
                            title: { type: 'string', description: 'Title of the book' },
                            categoryId: { type: 'integer', description: 'ID of the category' },
                            author: { type: 'string', description: 'Name of the author' },
                            quantity: { type: 'integer', description: 'Total quantity available' },
                            isbn: { type: 'string', description: 'ISBN of the book' },
                            bookStatus: {
                                type: 'object',
                                properties: {
                                    borrowedQuantity: { type: 'integer', description: 'Number of borrowed books' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const getBooksSchema = {
    schema: {
        description: 'API to fetch books with optional filters',
        querystring: {
            type: 'object',
            properties: {
                page: { type: 'integer', description: 'Page number for pagination', minimum: 1 },
                search: { type: 'string', description: 'Search query for book titles' },
                showAll: { type: 'string', enum: ['true', 'false'], description: 'Whether to show all books without pagination' },
                quantity: { type: 'integer', description: 'Minimum quantity filter' },
                categoryId: { type: 'integer', description: 'Category ID filter' }
            }
        },
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
                                id: { type: 'integer', description: 'Book ID' },
                                title: { type: 'string', description: 'Book title' },
                                categoryId: { type: 'integer', description: 'Category ID' },
                                author: { type: 'string', description: 'Author name' },
                                quantity: { type: 'integer', description: 'Available quantity' },
                                isbn: { type: 'string', description: 'ISBN number' },
                                _count: {
                                    type: 'object',
                                    properties: {
                                        lending: { type: 'integer', description: 'Number of times borrowed' }
                                    }
                                },
                                category: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer', description: 'Category ID' },
                                        name: { type: 'string', description: 'Category name' }
                                    }
                                }
                            }
                        }
                    },
                    count: { type: 'integer', description: 'Total number of books found' },
                    totalPage: { type: 'integer', description: 'Total number of pages' },
                    page: { type: 'integer', description: 'Current page number' }
                }
            }
        }
    }
}

export const getCategoriesSchema = {
    schema: {
        description: 'API to fetch all book categories',
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
                                id: { type: 'integer', description: 'Category ID' },
                                name: { type: 'string', description: 'Category name' }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const getMostBorrowedBookSchema = {
    schema: {
        description: 'API to fetch the top 5 most borrowed books',
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
                                id: { type: 'integer', description: 'Book ID' },
                                title: { type: 'string', description: 'Title of the book' },
                                countLending: { type: 'integer', description: 'Number of times the book has been borrowed' }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const getMonthlyLendingTrendSchema = {
    schema: {
        description: 'API to fetch the top 10 most borrowed books for a given month and year',
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
                month: { type: 'string', description: 'Month to filter lending trend (default: current month)' },
                year: { type: 'string', description: 'Year to filter lending trend (default: current year)' }
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
                                bookName: { type: 'string', description: 'Title of the book' },
                                countLend: { type: 'integer', description: 'Number of times the book has been borrowed' },
                                borrowDate: { type: 'string', format: 'date-time', description: 'Date the book was borrowed' }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const updateBookSchema = {
    schema: {
        description: 'API to update an existing book by ID',
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
                id: { type: 'integer', description: 'ID of the book to update' }
            }
        },
        body: {
            type: 'object',
            required: ['title', 'categoryId', 'author', 'quantity', 'isbn'],
            properties: {
                title: { type: 'string', description: 'Updated title of the book' },
                categoryId: { type: 'integer', description: 'Updated category ID of the book' },
                author: { type: 'string', description: 'Updated author of the book' },
                quantity: { type: 'integer', description: 'Updated quantity of the book' },
                isbn: { type: 'string', description: 'Updated ISBN of the book' }
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
                            id: { type: 'integer', description: 'ID of the updated book' },
                            title: { type: 'string', description: 'Updated title of the book' },
                            categoryId: { type: 'integer', description: 'Updated category ID' },
                            author: { type: 'string', description: 'Updated author' },
                            quantity: { type: 'integer', description: 'Updated quantity' },
                            isbn: { type: 'string', description: 'Updated ISBN' }
                        }
                    }
                }
            }
        }
    }
}

export const deleteBookSchema = {
    schema: {
        description: 'API to delete a book by ID',
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
                id: { type: 'integer', description: 'ID of the book to delete' }
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
                            id: { type: 'integer', description: 'ID of the deleted book' },
                            title: { type: 'string', description: 'Title of the deleted book' },
                            categoryId: { type: 'integer', description: 'Category ID of the deleted book' },
                            author: { type: 'string', description: 'Author of the deleted book' },
                            quantity: { type: 'integer', description: 'Quantity of the deleted book' },
                            isbn: { type: 'string', description: 'ISBN of the deleted book' }
                        }
                    }
                }
            },
            404: {
                description: 'Book not found',
                type: 'object',
                properties: {
                    status: { type: 'boolean' },
                    message: { type: 'string', description: 'Error message' }
                }
            },
            403: {
                description: 'Book cannot be deleted due to existing borrowings',
                type: 'object',
                properties: {
                    status: { type: 'boolean' },
                    message: { type: 'string', description: 'Error message' }
                }
            }
        }
    }
}