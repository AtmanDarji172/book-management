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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
require("reflect-metadata");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const passportJWT = __importStar(require("passport-jwt"));
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
require('dotenv').config();
/**
 * declare metadata by @controller annotation
 */
require("./controllers/book.controller");
require("./controllers/general.controller");
require("./controllers/base.controller");
const constant_1 = require("./utilities/constant");
const user_1 = require("./models/user");
/**
 * Set up containers
 */
let container = new inversify_1.Container();
// set up bindings
// container.bind<FooService>('FooService').to(FooService);
/**
 * MongoDB connection using mongoose
 */
const url = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@book-management.sfig0x3.mongodb.net/`;
mongoose_1.default.connect(url, { dbName: 'master' })
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
/**
 * Create server using InversifyExpressServer
 */
let server = new inversify_express_utils_1.InversifyExpressServer(container);
server.setConfig((app) => {
    // add body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, UPDATE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
});
server.build()
    .listen(process.env.PORT || 2000);
console.log('start on port: ', process.env.PORT);
/**
 * Passport configuration
 */
const passportConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: constant_1.CONSTANTS.JWT_SECRET
};
passport_1.default.use(new JwtStrategy(passportConfig, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user by ID from payload
    const user = yield user_1.User.findOne({ _id: payload.id });
    if (user) {
        return done(null, user);
    }
    else {
        return done(null, false);
    }
})));
//# sourceMappingURL=app.js.map