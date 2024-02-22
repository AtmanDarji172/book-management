import { controller } from 'inversify-express-utils';
import { IUser } from '../models/user';
import * as jwt from 'jsonwebtoken';
import { CONSTANTS } from '../utilities/constant';

@controller('')
export class BaseController {
    constructor() {

    }

    /**
     * API's success response prepare and send method
     */
    public sendSuccessResponse(response: any, data: any, message: string) {
        return response.status(200).json({
            isSuccess: true,
            data: data,
            message: message
        });
    }

    /**
     * API's error response prepare and send method
     */
    public sendErrorResponse(response: any, data: any, message: string, statusCode?: number) {
        return response.status(statusCode || 400).json({
            isSuccess: false,
            errors: data,
            message: message
        });
    }

    /**
     * Format price to inr
     */
    public formatPrice(price: number): string {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
        return formatter.format(price);
    }

    /**
     * Create JWT token
     */
    public createJWT(user: IUser) {
        /**
         * Created token valid till 1h
         */
        return jwt.sign({ id: user._id }, CONSTANTS.JWT_SECRET, { expiresIn: 60*60 });
    }

    /**
     * Format phone to indian standards
     */
    public formatPhone(phone: string): string {
        return `+91 ${phone.slice(0, 5)}-${phone.slice(5)}`;
    }

    /**
     * Convert book file name
     */
    public getBookFileName(originalname: any): string {
        return `${Date.now()}-${originalname}`
    }
}