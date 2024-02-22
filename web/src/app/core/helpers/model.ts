export interface IResponse {
    isSuccess: boolean,
    data: any,
    message: string
}

export interface IError {
    error: {
        isSuccess: boolean,
        errors: any,
        message: string
    }
}

export interface IBook {
    _id: string,
    name: string,
    author: string,
    description: string,
    price: number,
    formatted_price: string,
    created_at: string,
    updated_at: string
}

export interface IUser {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: number,
    formatted_phone: string,
    created_at: string,
    updated_at: string
}