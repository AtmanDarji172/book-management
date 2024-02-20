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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const express = __importStar(require("express"));
const inversify_express_utils_1 = require("inversify-express-utils");
const base_controller_1 = require("./base.controller");
const joi_1 = __importDefault(require("joi"));
const messages_1 = require("../utilities/messages");
const user_1 = require("../models/user");
const mongoose_1 = require("mongoose");
const passport_1 = require("../middlewares/passport");
const constant_1 = require("../utilities/constant");
let UsersController = class UsersController extends base_controller_1.BaseController {
    constructor() {
        super();
    }
    getAllUsersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findAll = yield user_1.User.find({}).sort({ created_at: -1 });
                return this.sendSuccessResponse(res, findAll, messages_1.MESSAGES.USER_FETCHED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
    getUserDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.INVALID_USER_ID);
            }
            try {
                const detail = yield user_1.User.findOne({ _id: req.params.id });
                return this.sendSuccessResponse(res, detail, messages_1.MESSAGES.USER_DETAILS_FETCHED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.INVALID_USER_ID);
            }
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
            });
            const validateSchema = schema.validate(req.body, { abortEarly: false });
            if (validateSchema.error) {
                return this.sendErrorResponse(res, validateSchema.error, messages_1.MESSAGES.VALIDATION_ERROR);
            }
            let reqBody = req.body;
            const findDuplicateUser = yield user_1.User.findOne({ email: reqBody === null || reqBody === void 0 ? void 0 : reqBody.email }, { $ne: { _id: req.params.id } });
            if (findDuplicateUser) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.FIND_DUPLICATE_USER);
            }
            const findUser = yield user_1.User.findOne({ _id: req.params.id });
            if (!findUser) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.USER_FETCHED_ERROR);
            }
            try {
                reqBody.formatted_phone = this.formatePhone(reqBody.phone);
                const updated = yield user_1.User.findOneAndUpdate({ _id: req.params.id }, reqBody, { new: true });
                return this.sendSuccessResponse(res, updated, messages_1.MESSAGES.USER_UPDATED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
                return this.sendErrorResponse(res, null, messages_1.MESSAGES.INVALID_USER_ID);
            }
            try {
                const updated = yield user_1.User.findOneAndDelete({ _id: req.params.id });
                return this.sendSuccessResponse(res, null, messages_1.MESSAGES.USER_DELETED_SUCCESS);
            }
            catch (error) {
                if (error instanceof Error) {
                    return this.sendErrorResponse(res, null, error.message);
                }
            }
        });
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, inversify_express_utils_1.httpGet)('/all'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express !== "undefined" && express.Request) === "function" ? _a : Object, typeof (_b = typeof express !== "undefined" && express.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsersList", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:id/details'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof express !== "undefined" && express.Request) === "function" ? _c : Object, typeof (_d = typeof express !== "undefined" && express.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDetail", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/:id/update'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof express !== "undefined" && express.Request) === "function" ? _e : Object, typeof (_f = typeof express !== "undefined" && express.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/:id/delete'),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof express !== "undefined" && express.Request) === "function" ? _g : Object, typeof (_h = typeof express !== "undefined" && express.Response) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, inversify_express_utils_1.controller)('/users', passport_1.authenticateJwt),
    __metadata("design:paramtypes", [])
], UsersController);
//# sourceMappingURL=user.controller.js.map