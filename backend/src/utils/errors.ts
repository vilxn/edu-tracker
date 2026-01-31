export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Ресурс не найден') {
        super(404, message);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Некорректные данные') {
        super(400, message);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Конфликт данных') {
        super(409, message);
    }
}