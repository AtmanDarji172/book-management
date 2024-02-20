import * as express from 'express';
import { controller, httpGet, httpPost, httpDelete, request, response } from 'inversify-express-utils';
import { BaseController } from './base.controller';
import joi from 'joi';
import { MESSAGES } from '../utilities/messages';
import { Book } from '../models/book';
import { isValidObjectId } from 'mongoose';
import { authenticateJwt } from '../middlewares/passport';

@controller('/books')
export class BooksController extends BaseController {
    constructor() {
        super();
    }

    @httpGet('/all')
    public async getAllBooksList(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        try {
            const findAll = await Book.find({}).sort({ created_at: -1 });
            return this.sendSuccessResponse(res, findAll, MESSAGES.BOOK_FETCHED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }

    @httpGet('/:id/details')
    public async getBookDetail(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_BOOK_ID);
        }
        try {
            const detail = await Book.findOne({ _id: req.params.id });
            return this.sendSuccessResponse(res, detail, MESSAGES.BOOK_DETAILS_FETCHED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }

    @httpPost('/add', authenticateJwt)
    public async addBook(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        const schema = joi.object({
            name: joi.string().trim().required().messages({
                'string.base': MESSAGES.BOOK_NAME_INVALID,
                'any.required': MESSAGES.BOOK_NAME_REQUIRED,
                'string.trim': MESSAGES.BOOK_NAME_EMPTY
            }),
            author: joi.string().trim().required().messages({
                'string.base': MESSAGES.AUTHOR_INVALID,
                'any.required': MESSAGES.AUTHOR_REQUIRED,
                'string.trim': MESSAGES.AUTHOR_EMPTY
            }),
            description: joi.string().trim().required().messages({
                'string.base': MESSAGES.DESCRIPTION_INVALID,
                'any.required': MESSAGES.DESCRIPTION_REQUIRED,
                'string.trim': MESSAGES.DESCRIPTION_EMPTY
            }),
            price: joi.number().required().messages({
                'number.base': MESSAGES.PRICE_INVALID,
                'any.required': MESSAGES.PRICE_REQUIRED
            })
        });

        const validateSchema = schema.validate(req.body, { abortEarly: false });
        if (validateSchema.error) {
            return this.sendErrorResponse(res, validateSchema.error, MESSAGES.VALIDATION_ERROR);
        }

        const reqBody: any = req.body;

        const findBook = await Book.findOne({ name: new RegExp(reqBody?.name, 'gi') });
        if (findBook) {
            return this.sendErrorResponse(res, null, MESSAGES.FIND_DUPLICATE_BOOK);
        }

        try {
            const newBook = new Book({
                name: reqBody.name,
                author: reqBody.author,
                description: reqBody.description,
                price: Number(reqBody.price),
                formatted_price: this.formatePrice(reqBody.price)
            });

            newBook.save();
            return this.sendSuccessResponse(res, newBook, MESSAGES.BOOK_CREATED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }

    @httpPost('/:id/update', authenticateJwt)
    public async updateBook(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_BOOK_ID);
        }

        const schema = joi.object({
            name: joi.string().trim().required().messages({
                'string.base': MESSAGES.BOOK_NAME_INVALID,
                'any.required': MESSAGES.BOOK_NAME_REQUIRED,
                'string.trim': MESSAGES.BOOK_NAME_EMPTY
            }),
            author: joi.string().trim().required().messages({
                'string.base': MESSAGES.AUTHOR_INVALID,
                'any.required': MESSAGES.AUTHOR_REQUIRED,
                'string.trim': MESSAGES.AUTHOR_EMPTY
            }),
            description: joi.string().trim().required().messages({
                'string.base': MESSAGES.DESCRIPTION_INVALID,
                'any.required': MESSAGES.DESCRIPTION_REQUIRED,
                'string.trim': MESSAGES.DESCRIPTION_EMPTY
            }),
            price: joi.number().required().messages({
                'number.base': MESSAGES.PRICE_INVALID,
                'any.required': MESSAGES.PRICE_REQUIRED
            })
        });

        const validateSchema = schema.validate(req.body, { abortEarly: false });
        if (validateSchema.error) {
            return this.sendErrorResponse(res, validateSchema.error, MESSAGES.VALIDATION_ERROR);
        }

        let reqBody: any = req.body;

        const findDuplicateBook = await Book.findOne({ name: new RegExp(reqBody?.name, 'gi'), $ne: { _id: req.params.id } });
        if (findDuplicateBook) {
            return this.sendErrorResponse(res, null, MESSAGES.FIND_DUPLICATE_BOOK);
        }
 
        const findBook = await Book.findOne({ _id: req.params.id });
        if (!findBook) {
            return this.sendErrorResponse(res, null, MESSAGES.BOOK_FETCHED_ERROR);
        }

        try {
            reqBody.formatted_price = this.formatePrice(reqBody.price);
            const updated = await Book.findOneAndUpdate({ _id: req.params.id }, reqBody, { new: true });
            return this.sendSuccessResponse(res, updated, MESSAGES.BOOK_UPDATED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }

    @httpDelete('/:id/delete', authenticateJwt)
    public async deleteBook(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_BOOK_ID);
        }

        try {
            const updated = await Book.findOneAndDelete({ _id: req.params.id });
            return this.sendSuccessResponse(res, null, MESSAGES.BOOK_DELETED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }
}