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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const base_controller_1 = require("./base.controller");
const express = __importStar(require("express"));
const messages_1 = require("../utilities/messages");
const joi_1 = __importDefault(require("joi"));
const constant_1 = require("../utilities/constant");
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
let GeneralController = class GeneralController extends base_controller_1.BaseController {
    constructor() {
        super();
    }
    getAllBooksList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendSuccessResponse(res, null, messages_1.MESSAGES.API_SUCCESS);
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                email: joi_1.default.string().trim().email({ minDomainSegments: 2 }).required().messages({
                    'string.base': messages_1.MESSAGES.EMAIL_INVALID,
                    'any.required': messages_1.MESSAGES.EMAIL_REQUIRED,
                    'string.trim': messages_1.MESSAGES.EMAIL_EMPTY,
                    'string.email': messages_1.MESSAGES.EMAIL_VALID_EMAIL
                }),
                password: joi_1.default.string().trim().pattern(new RegExp(constant_1.CONSTANTS.PASSWORD_PATTERN)).required().messages({
                    'string.base': messages_1.MESSAGES.PASSWORD_INVALID,
                    'any.required': messages_1.MESSAGES.PASSWORD_REQUIRED,
                    'string.trim': messages_1.MESSAGES.PASSWORD_EMPTY,
                    'string.pattern.base': messages_1.MESSAGES.PASSWORD_INVALID_PATTERN
                })
            });
            const validateSchema = schema.validate(req.body, { abortEarly: false });
            if (validateSchema.error) {
                return this.sendErrorResponse(res, validateSchema.error, messages_1.MESSAGES.VALIDATION_ERROR);
            }
            const reqBody = req.body;
            const findUser = yield user_1.User.findOne({ email: reqBody.email });
            if (!findUser) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.USER_FETCHED_ERROR);
            }
            if (bcrypt_1.default.compare(reqBody.password, findUser.password)) {
                try {
                    const token = this.createJWT(findUser);
                    return this.sendSuccessResponse(res, { token }, messages_1.MESSAGES.LOGIN_SUCCESS);
                }
                catch (error) {
                    if (error instanceof Error) {
                        return this.sendErrorResponse(res, null, error.message);
                    }
                }
            }
            else {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.PASSWORD_WRONG);
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                first_name: joi_1.default.string().trim().required().messages({
                    'string.base': messages_1.MESSAGES.FIRST_NAME_INVALID,
                    'any.required': messages_1.MESSAGES.FIRST_NAME_REQUIRED,
                    'string.trim': messages_1.MESSAGES.FIRST_NAME_EMPTY,
                }),
                last_name: joi_1.default.string().trim().required().messages({
                    'string.base': messages_1.MESSAGES.LAST_NAME_INVALID,
                    'any.required': messages_1.MESSAGES.LAST_NAME_REQUIRED,
                    'string.trim': messages_1.MESSAGES.LAST_NAME_EMPTY,
                }),
                phone: joi_1.default.string().pattern(new RegExp(constant_1.CONSTANTS.PHONE_PATTERN)).required().messages({
                    'number.base': messages_1.MESSAGES.PHONE_INVALID,
                    'any.required': messages_1.MESSAGES.PHONE_REQUIRED,
                    'string.pattern.base': messages_1.MESSAGES.PHONE_INVALID_PATTERN
                }),
                email: joi_1.default.string().trim().email({ minDomainSegments: 2 }).required().messages({
                    'string.base': messages_1.MESSAGES.EMAIL_INVALID,
                    'any.required': messages_1.MESSAGES.EMAIL_REQUIRED,
                    'string.trim': messages_1.MESSAGES.EMAIL_EMPTY,
                    'string.email': messages_1.MESSAGES.EMAIL_VALID_EMAIL
                }),
                password: joi_1.default.string().trim().pattern(new RegExp(constant_1.CONSTANTS.PASSWORD_PATTERN)).required().messages({
                    'string.base': messages_1.MESSAGES.PASSWORD_INVALID,
                    'any.required': messages_1.MESSAGES.PASSWORD_REQUIRED,
                    'string.trim': messages_1.MESSAGES.PASSWORD_EMPTY,
                    'string.pattern.base': messages_1.MESSAGES.PASSWORD_INVALID_PATTERN
                })
            });
            const validateSchema = schema.validate(req.body, { abortEarly: false });
            if (validateSchema.error) {
                return this.sendErrorResponse(res, validateSchema.error, messages_1.MESSAGES.VALIDATION_ERROR);
            }
            const reqBody = req.body;
            /**
             * Find if same email user exist or not
             */
            const findUser = yield user_1.User.findOne({ email: req.body.email });
            if (findUser) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.FIND_DUPLICATE_USER);
            }
            try {
                const newUser = new user_1.User({
                    first_name: reqBody.first_name,
                    last_name: reqBody.last_name,
                    phone: reqBody.phone,
                    email: reqBody.email,
                    password: bcrypt_1.default.hash(reqBody.password, 10),
                    formatted_phone: this.formatePhone(reqBody.phone)
                });
                newUser.save();
                return this.sendSuccessResponse(res, null, messages_1.MESSAGES.REGISTRATION_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
};
exports.GeneralController = GeneralController;
__decorate([
    (0, inversify_express_utils_1.httpGet)('/'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express !== "undefined" && express.Request) === "function" ? _a : Object, typeof (_b = typeof express !== "undefined" && express.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], GeneralController.prototype, "getAllBooksList", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/login'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof express !== "undefined" && express.Request) === "function" ? _c : Object, typeof (_d = typeof express !== "undefined" && express.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], GeneralController.prototype, "login", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/register'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof express !== "undefined" && express.Request) === "function" ? _e : Object, typeof (_f = typeof express !== "undefined" && express.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], GeneralController.prototype, "register", null);
exports.GeneralController = GeneralController = __decorate([
    (0, inversify_express_utils_1.controller)('/'),
    __metadata("design:paramtypes", [])
], GeneralController);
//# sourceMappingURL=general.controller.js.map