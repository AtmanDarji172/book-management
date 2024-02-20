import { controller } from 'inversify-express-utils';
import { IUser } from '../models/user';
import * as jwt from 'jsonwebtoken';
import { CONSTANTS } from '../utilities/constant';

@controller('')
export class BaseController {
    constructor() {

    }

    public sendSuccessResponse(response: any, data: any, message: string) {
        return response.status(200).json({
            isSuccess: true,
            data: data,
            message: message
        });
    }

    public sendErrorResponse(response: any, data: any, message: string, statusCode?: number) {
        return response.status(statusCode || 400).json({
            isSuccess: false,
            errors: data,
            message: message
        });
    }

    public formatePrice(price: number): string {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
        return formatter.format(price);
    }

    public createJWT(user: IUser) {
        /**
         * Created token valid till 1h
         */
        return jwt.sign({ id: user._id }, CONSTANTS.JWT_SECRET, { expiresIn: 60*60 });
    }

    public formatePhone(phone: string): string {
        return `+91 ${phone.slice(0, 5)}-${phone.slice(5)}`;
    }
}