import { controller, httpGet, httpPost, request, response } from "inversify-express-utils";
import { BaseController } from "./base.controller";
import * as express from 'express';
import { MESSAGES } from "../utilities/messages";
import joi from 'joi';
import { CONSTANTS } from "../utilities/constant";
import { User } from "../models/user";
import bcrypt from 'bcrypt';

@controller('/')
export class GeneralController extends BaseController {
    constructor() {
        super();
    }

    /**
     * API status check route
     */
    @httpGet('/')
    public async getAllBooksList(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        return this.sendSuccessResponse(res, null, MESSAGES.API_SUCCESS);
    }

    /**
     * API endpoint to login
     */
    @httpPost('/login')
    public async login(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        /**
         * Validate requested body params using JOI
         */
        const schema = joi.object({
            email: joi.string().trim().email({ minDomainSegments: 2 }).required().messages({
                'string.base': MESSAGES.EMAIL_INVALID,
                'any.required': MESSAGES.EMAIL_REQUIRED,
                'string.trim': MESSAGES.EMAIL_EMPTY,
                'string.email': MESSAGES.EMAIL_VALID_EMAIL
            }),
            password: joi.string().trim().pattern(new RegExp(CONSTANTS.PASSWORD_PATTERN)).required().messages({
                'string.base': MESSAGES.PASSWORD_INVALID,
                'any.required': MESSAGES.PASSWORD_REQUIRED,
                'string.trim': MESSAGES.PASSWORD_EMPTY,
                'string.pattern.base': MESSAGES.PASSWORD_INVALID_PATTERN
            })
        });
        
        const validateSchema = schema.validate(req.body, { abortEarly: false });
        if (validateSchema.error) {
            return this.sendErrorResponse(res, validateSchema.error, MESSAGES.VALIDATION_ERROR);
        }

        const reqBody = req.body;

        /**
         * Check if requested email is exist or not for the user
         */
        const findUser = await User.findOne({ email: reqBody.email });
        if (!findUser) {
            return this.sendErrorResponse(res, null, MESSAGES.USER_FETCHED_ERROR);
        }

        /**
         * Check password is matched with existing password or not using bcrypt
         */
        if (bcrypt.compare(reqBody.password, findUser.password)) {
            try {
                /**
                 * Create JWT token for login
                 */
                const token = this.createJWT(findUser);
                return this.sendSuccessResponse(res, { token }, MESSAGES.LOGIN_SUCCESS);

            } catch (error: any) {
                return this.sendErrorResponse(res, null, error.message);
            }

        } else {
            return this.sendErrorResponse(res, null, MESSAGES.PASSWORD_WRONG);
        }
    }

    @httpPost('/register')
    public async register(@request() req: express.Request, @response() res: express.Response): Promise<any> {
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
            password: joi.string().trim().pattern(new RegExp(CONSTANTS.PASSWORD_PATTERN)).required().messages({
                'string.base': MESSAGES.PASSWORD_INVALID,
                'any.required': MESSAGES.PASSWORD_REQUIRED,
                'string.trim': MESSAGES.PASSWORD_EMPTY,
                'string.pattern.base': MESSAGES.PASSWORD_INVALID_PATTERN
            })
        });

        const validateSchema = schema.validate(req.body, { abortEarly: false });
        if (validateSchema.error) {
            return this.sendErrorResponse(res, validateSchema.error, MESSAGES.VALIDATION_ERROR);
        }

        const reqBody: any = req.body;

        /**
         * Check if requested email is exist or not for the user
         */
        const findUser = await User.findOne({ email: req.body.email });
        if (findUser) {
            return this.sendErrorResponse(res, null, MESSAGES.FIND_DUPLICATE_USER);
        }

        try {
            /**
             * Adding details to provided User schema for registration
             */
            const newUser = new User({
                first_name: reqBody.first_name,
                last_name: reqBody.last_name,
                phone: reqBody.phone,
                email: reqBody.email,
                password: bcrypt.hash(reqBody.password, 10), // encrypt the password using bcrypt hash method
                formatted_phone: this.formatPhone(reqBody.phone)
            });

            /**
             * Save new user
             */
            newUser.save();
            return this.sendSuccessResponse(res, null, MESSAGES.REGISTRATION_SUCCESS);

        } catch (error: any) {
            return this.sendErrorResponse(res, null, error.message);
        }
    }
}