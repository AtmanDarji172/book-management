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

    @httpGet('/')
    public async getAllBooksList(@request() req: express.Request, @response() res: express.Response): Promise<any> {
        return this.sendSuccessResponse(res, null, MESSAGES.API_SUCCESS);
    }

    @httpPost('/login')
    public async login(@request() req: express.Request, @response() res: express.Response): Promise<any> {
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

        const findUser = await User.findOne({ email: reqBody.email });
        if (!findUser) {
            return this.sendErrorResponse(res, null, MESSAGES.USER_FETCHED_ERROR);
        }

        if (bcrypt.compare(reqBody.password, findUser.password)) {
            try {
                const token = this.createJWT(findUser);
                return this.sendSuccessResponse(res, { token }, MESSAGES.LOGIN_SUCCESS);

            } catch (error: any) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                } 
            }

        } else {
            return this.sendErrorResponse(res, null, MESSAGES.PASSWORD_WRONG);
        }
    }

    @httpPost('/register')
    public async register(@request() req: express.Request, @response() res: express.Response): Promise<any> {
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
         * Find if same email user exist or not
         */
        const findUser = await User.findOne({ email: req.body.email });
        if (findUser) {
            return this.sendErrorResponse(res, null, MESSAGES.FIND_DUPLICATE_USER);
        }

        try {
            const newUser = new User({
                first_name: reqBody.first_name,
                last_name: reqBody.last_name,
                phone: reqBody.phone,
                email: reqBody.email,
                password: bcrypt.hash(reqBody.password, 10),
                formatted_phone: this.formatePhone(reqBody.phone)
            });

            newUser.save();
            return this.sendSuccessResponse(res, null, MESSAGES.REGISTRATION_SUCCESS);

        } catch (error: any) {
            if (error instanceof Error) {
                return this.sendErrorResponse(res, null, error.message);
            }
        }
    }
}