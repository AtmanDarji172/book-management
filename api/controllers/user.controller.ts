import * as express from 'express';
import { controller, httpGet, httpPost, httpDelete, request, response } from 'inversify-express-utils';
import { BaseController } from './base.controller';
import joi from 'joi';
import { MESSAGES } from '../utilities/messages';
import { User } from '../models/user';
import { isValidObjectId } from 'mongoose';
import { authenticateJwt } from '../middlewares/passport';
import { CONSTANTS } from '../utilities/constant';

/**
 * Authenticate controller using authenticateJwt
 */
@controller('/users', authenticateJwt)
export class UsersController extends BaseController {
    constructor() {
        super();
    }

    /**
     * API endpoint to fetch all users from the collection
     */
    @httpGet('/all')
    public async getAllUsersList(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        try {
            /**
             * Find all data and sort those by created_at for descending order
             */
            const findAll = await User.find({}).sort({ created_at: -1 });
            return this.sendSuccessResponse(res, findAll, MESSAGES.USER_FETCHED_SUCCESS);
        
        } catch (error: any) {
            return this.sendErrorResponse(res, null, error.message);
        }
    }

    /**
     * API endpoint to fetch user details from the collection
     */
    @httpGet('/:id/details')
    public async getUserDetail(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        /**
         * Validate user id from the request params
         */
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_USER_ID);
        }
        try {
            /**
             * Fetch user from received request params id
             */
            const details = await User.findOne({ _id: req.params.id });
            if (!details) {
                return this.sendErrorResponse(res, null, MESSAGES.USER_FETCHED_ERROR);
            }
            return this.sendSuccessResponse(res, details, MESSAGES.USER_DETAILS_FETCHED_SUCCESS);
        
        } catch (error: any) {
            return this.sendErrorResponse(res, null, error.message);
        }
    }

    /**
     * API endpoint to update user
     */
    @httpPost('/:id/update')
    public async updateUser(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        /**
         * Validate user id from the request params
         */
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_USER_ID);
        }

        /**
         * Validate requested body params using JOI
         */
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
            email: joi.string().trim().email({ minDomainSegments: 2 }).required().messages({
                'string.base': MESSAGES.EMAIL_INVALID,
                'any.required': MESSAGES.EMAIL_REQUIRED,
                'string.trim': MESSAGES.EMAIL_EMPTY,
                'string.email': MESSAGES.EMAIL_VALID_EMAIL
            }),
        });

        const validateSchema = schema.validate(req.body, { abortEarly: false });
        if (validateSchema.error) {
            return this.sendErrorResponse(res, validateSchema.error, MESSAGES.VALIDATION_ERROR);
        }

        let reqBody: any = req.body;

        /**
         * Check if any duplicate user exist
         */
        const findDuplicateUser = await User.findOne({ email: reqBody?.email, _id: { $ne: req.params.id } });
        if (findDuplicateUser) {
            return this.sendErrorResponse(res, null, MESSAGES.FIND_DUPLICATE_USER);
        }
 
        /**
         * Check if requested user is exist or not
         */
        const findUser = await User.findOne({ _id: req.params.id });
        if (!findUser) {
            return this.sendErrorResponse(res, null, MESSAGES.USER_FETCHED_ERROR);
        }

        try {
            /**
             * Update phone format
             */
            reqBody.formatted_phone = this.formatPhone(reqBody.phone);

            /**
             * Update the user details
             */
            const updated = await User.findOneAndUpdate({ _id: req.params.id }, reqBody, { new: true });
            return this.sendSuccessResponse(res, updated, MESSAGES.USER_UPDATED_SUCCESS);
        
        } catch (error: any) {
            return this.sendErrorResponse(res, null, error.message);
        }
    }

    /**
     * API endpoint to delete user
     */
    @httpDelete('/:id/delete')
    public async deleteUser(@request() req: express.Request, @response() res: express.Response): Promise<any> {
         /**
         * Validate user id from the request params
         */
        if (!isValidObjectId(req.params.id)) {
            return this.sendErrorResponse(res, null, MESSAGES.INVALID_USER_ID);
        }

        /**
         * Fetch user from received request params id
         */
        const details = await User.findOne({ _id: req.params.id });
        if (!details) {
            return this.sendErrorResponse(res, null, MESSAGES.USER_FETCHED_ERROR);
        }

        try {
            /**
             * Delete user from the DB
             */
            await User.findOneAndDelete({ _id: req.params.id });
            return this.sendSuccessResponse(res, null, MESSAGES.USER_DELETED_SUCCESS);
        
        } catch (error: any) {
            return this.sendErrorResponse(res, null, error.message);
        }
    }

    /**
     * API endpoint to fetch current user profile
     */
    @httpGet('/my-profile')
    public async getProfileDetails(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        let reqUser: any = req.user;
 
        try {
            /**
             * Check if requested user is exist or not
             */
            const findUser = await User.findOne({ _id: reqUser._id }, { password: 0 });
            if (!findUser) {
                return this.sendErrorResponse(res, null, MESSAGES.USER_FETCHED_ERROR);
            }

            delete findUser?.password;
            return this.sendSuccessResponse(res, findUser, MESSAGES.PROFILE_FETCH_SUCCESS);
        
        } catch (error: any) {
            return this.sendErrorResponse(res, null, error.message);
        }
    }
}