"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const jwt = __importStar(require("jsonwebtoken"));
const constant_1 = require("../utilities/constant");
let BaseController = class BaseController {
    constructor() {
    }
    sendSuccessResponse(response, data, message) {
        return response.status(200).json({
            isSuccess: true,
            data: data,
            message: message
        });
    }
    sendErrorResponse(response, data, message, statusCode) {
        return response.status(statusCode || 400).json({
            isSuccess: false,
            errors: data,
            message: message
        });
    }
    formatePrice(price) {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
        return formatter.format(price);
    }
    createJWT(user) {
        /**
         * Created token valid till 1h
         */
        return jwt.sign({ id: user._id }, constant_1.CONSTANTS.JWT_SECRET, { expiresIn: 60 * 60 });
    }
    formatePhone(phone) {
        return `+91 ${phone.slice(0, 5)}-${phone.slice(5)}`;
    }
};
exports.BaseController = BaseController;
exports.BaseController = BaseController = __decorate([
    (0, inversify_express_utils_1.controller)(''),
    __metadata("design:paramtypes", [])
], BaseController);
//# sourceMappingURL=base.controller.js.map