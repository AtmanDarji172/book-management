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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const express = __importStar(require("express"));
const inversify_express_utils_1 = require("inversify-express-utils");
const base_controller_1 = require("./base.controller");
const joi_1 = __importDefault(require("joi"));
const messages_1 = require("../utilities/messages");
const book_1 = require("../models/book");
const mongoose_1 = require("mongoose");
const passport_1 = require("../middlewares/passport");
let BooksController = class BooksController extends base_controller_1.BaseController {
    constructor() {
        super();
    }
    getAllBooksList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findAll = yield book_1.Book.find({}).sort({ created_at: -1 });
                return this.sendSuccessResponse(res, findAll, messages_1.MESSAGES.BOOK_FETCHED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
    getBookDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.INVALID_BOOK_ID);
            }
            try {
                const detail = yield book_1.Book.findOne({ _id: req.params.id });
                return this.sendSuccessResponse(res, detail, messages_1.MESSAGES.BOOK_DETAILS_FETCHED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
    addBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                name: joi_1.default.string().trim().required().messages({
                    'string.base': messages_1.MESSAGES.BOOK_NAME_INVALID,
                    'any.required': messages_1.MESSAGES.BOOK_NAME_REQUIRED,
                    'string.trim': messages_1.MESSAGES.BOOK_NAME_EMPTY
                }),
                author: joi_1.default.string().trim().required().messages({
                    'string.base': messages_1.MESSAGES.AUTHOR_INVALID,
                    'any.required': messages_1.MESSAGES.AUTHOR_REQUIRED,
                    'string.trim': messages_1.MESSAGES.AUTHOR_EMPTY
                }),
                description: joi_1.default.string().trim().required().messages({
                    'string.base': messages_1.MESSAGES.DESCRIPTION_INVALID,
                    'any.required': messages_1.MESSAGES.DESCRIPTION_REQUIRED,
                    'string.trim': messages_1.MESSAGES.DESCRIPTION_EMPTY
                }),
                price: joi_1.default.number().required().messages({
                    'number.base': messages_1.MESSAGES.PRICE_INVALID,
                    'any.required': messages_1.MESSAGES.PRICE_REQUIRED
                })
            });
            const validateSchema = schema.validate(req.body, { abortEarly: false });
            if (validateSchema.error) {
                return this.sendErrorResponse(res, validateSchema.error, messages_1.MESSAGES.VALIDATION_ERROR);
            }
            const reqBody = req.body;
            const findBook = yield book_1.Book.findOne({ name: new RegExp(reqBody === null || reqBody === void 0 ? void 0 : reqBody.name, 'gi') });
            if (findBook) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.FIND_DUPLICATE_BOOK);
            }
            try {
                const newBook = new book_1.Book({
                    name: reqBody.name,
                    author: reqBody.author,
                    description: reqBody.description,
                    price: Number(reqBody.price),
                    formatted_price: this.formatePrice(reqBody.price)
                });
                newBook.save();
                return this.sendSuccessResponse(res, newBook, messages_1.MESSAGES.BOOK_CREATED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
    updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.INVALID_BOOK_ID);
            }
            const schema = joi_1.default.object({
                name: joi_1.default.string().trim().required().messages({
                    'string.base': messages_1.MESSAGES.BOOK_NAME_INVALID,
                    'any.required': messages_1.MESSAGES.BOOK_NAME_REQUIRED,
                    'string.trim': messages_1.MESSAGES.BOOK_NAME_EMPTY
                }),
                author: joi_1.default.string().trim().required().messages({
                    'string.base': messages_1.MESSAGES.AUTHOR_INVALID,
                    'any.required': messages_1.MESSAGES.AUTHOR_REQUIRED,
                    'string.trim': messages_1.MESSAGES.AUTHOR_EMPTY
                }),
                description: joi_1.default.string().trim().required().messages({
                    'string.base': messages_1.MESSAGES.DESCRIPTION_INVALID,
                    'any.required': messages_1.MESSAGES.DESCRIPTION_REQUIRED,
                    'string.trim': messages_1.MESSAGES.DESCRIPTION_EMPTY
                }),
                price: joi_1.default.number().required().messages({
                    'number.base': messages_1.MESSAGES.PRICE_INVALID,
                    'any.required': messages_1.MESSAGES.PRICE_REQUIRED
                })
            });
            const validateSchema = schema.validate(req.body, { abortEarly: false });
            if (validateSchema.error) {
                return this.sendErrorResponse(res, validateSchema.error, messages_1.MESSAGES.VALIDATION_ERROR);
            }
            let reqBody = req.body;
            const findDuplicateBook = yield book_1.Book.findOne({ name: new RegExp(reqBody === null || reqBody === void 0 ? void 0 : reqBody.name, 'gi'), $ne: { _id: req.params.id } });
            if (findDuplicateBook) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.FIND_DUPLICATE_BOOK);
            }
            const findBook = yield book_1.Book.findOne({ _id: req.params.id });
            if (!findBook) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.BOOK_FETCHED_ERROR);
            }
            try {
                reqBody.formatted_price = this.formatePrice(reqBody.price);
                const updated = yield book_1.Book.findOneAndUpdate({ _id: req.params.id }, reqBody, { new: true });
                return this.sendSuccessResponse(res, updated, messages_1.MESSAGES.BOOK_UPDATED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
    deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.INVALID_BOOK_ID);
            }
            try {
                const updated = yield book_1.Book.findOneAndDelete({ _id: req.params.id });
                return this.sendSuccessResponse(res, null, messages_1.MESSAGES.BOOK_DELETED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, inversify_express_utils_1.httpGet)('/all'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express !== "undefined" && express.Request) === "function" ? _a : Object, typeof (_b = typeof express !== "undefined" && express.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getAllBooksList", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:id/details'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof express !== "undefined" && express.Request) === "function" ? _c : Object, typeof (_d = typeof express !== "undefined" && express.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getBookDetail", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/add', passport_1.authenticateJwt),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof express !== "undefined" && express.Request) === "function" ? _e : Object, typeof (_f = typeof express !== "undefined" && express.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "addBook", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/:id/update', passport_1.authenticateJwt),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof express !== "undefined" && express.Request) === "function" ? _g : Object, typeof (_h = typeof express !== "undefined" && express.Response) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "updateBook", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/:id/delete', passport_1.authenticateJwt),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof express !== "undefined" && express.Request) === "function" ? _j : Object, typeof (_k = typeof express !== "undefined" && express.Response) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "deleteBook", null);
exports.BooksController = BooksController = __decorate([
    (0, inversify_express_utils_1.controller)('/books'),
    __metadata("design:paramtypes", [])
], BooksController);
//# sourceMappingURL=book.controller.js.map