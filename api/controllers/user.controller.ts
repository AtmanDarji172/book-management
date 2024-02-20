import * as express from 'express';
import { controller, httpGet, httpPost, httpDelete, request, response } from 'inversify-express-utils';
import { BaseController } from './base.controller';
import joi from 'joi';
import { MESSAGES } from '../utilities/messages';
import { User } from '../models/user';
import { isValidObjectId } from 'mongoose';
import { authenticateJwt } from '../middlewares/passport';
import { CONSTANTS } from '../utilities/constant';

@controller('/users', authenticateJwt)
export class UsersController extends BaseController {
    constructor() {
        super();
    }

    @httpGet('/all')
    public async getAllUsersList(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        try {
            const findAll = await User.find({}).sort({ created_at: -1 });
            return this.sendSuccessResponse(res, findAll, MESSAGES.USER_FETCHED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }

    @httpGet('/:id/details')
    public async getUserDetail(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_USER_ID);
        }
        try {
            const detail = await User.findOne({ _id: req.params.id });
            return this.sendSuccessResponse(res, detail, MESSAGES.USER_DETAILS_FETCHED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }

    @httpPost('/:id/update')
    public async updateUser(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_USER_ID);
        }

        const schema = joi.object({
            first_name: joi.string().trim().required().messages({
                'string.base': MESSAGES.FIRST_NAME_INVALID,
                'any.required': MESSAGES.FIRST_NAME_REQUIRED,
                'string.trim': MESSAGES.FIRST_NAME_EMPTY,
            }),
            last_name: joi.string().trim().required().messages({
                'string.base': MESSAGES.LAST_NAME_INVALID,
                'any.required': MESSAGES.LAST_NAME_REQUIRED,
                'string.trim': MESSAGES.LAST_NAME_EMPTY,
            }),
            phone: joi.string().pattern(new RegExp(CONSTANTS.PHONE_PATTERN)).required().messages({
                'number.base': MESSAGES.PHONE_INVALID,
                'any.required': MESSAGES.PHONE_REQUIRED,
                'string.pattern.base': MESSAGES.PHONE_INVALID_PATTERN
            }),
        });

        const validateSchema = schema.validate(req.body, { abortEarly: false });
        if (validateSchema.error) {
            return this.sendErrorResponse(res, validateSchema.error, MESSAGES.VALIDATION_ERROR);
        }

        let reqBody: any = req.body;

        const findDuplicateUser = await User.findOne({ email: reqBody?.email }, { $ne: { _id: req.params.id } });
        if (findDuplicateUser) {
            return this.sendErrorResponse(res, null, MESSAGES.FIND_DUPLICATE_USER);
        }
 
        const findUser = await User.findOne({ _id: req.params.id });
        if (!findUser) {
            return this.sendErrorResponse(res, null, MESSAGES.USER_FETCHED_ERROR);
        }

        try {
            reqBody.formatted_phone = this.formatePhone(reqBody.phone);
            const updated = await User.findOneAndUpdate({ _id: req.params.id }, reqBody, { new: true });
            return this.sendSuccessResponse(res, updated, MESSAGES.USER_UPDATED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }

    @httpDelete('/:id/delete')
    public async deleteUser(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_USER_ID);
        }

        try {
            const updated = await User.findOneAndDelete({ _id: req.params.id });
            return this.sendSuccessResponse(res, null, MESSAGES.USER_DELETED_SUCCESS);
        
        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }
}