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
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
require("reflect-metadata");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const db_1 = require("./utilities/db");
const passport_1 = require("./middlewares/passport");
const config_1 = require("./utilities/config");
// import passport from 'passport';
// import * as passportJWT from 'passport-jwt';
// const JwtStrategy = passportJWT.Strategy;
// const ExtractJwt = passportJWT.ExtractJwt;
require('dotenv').config();
/**
 * declare metadata by @controller annotation
 */
require("./controllers/book.controller");
require("./controllers/general.controller");
require("./controllers/base.controller");
/**
 * Set up containers
 */
let container = new inversify_1.Container();
// set up bindings
// container.bind<FooService>('FooService').to(FooService);
/**
 * Connect to mongoDB using mongoose
 */
(0, db_1.connectToDB)();
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
    .listen(config_1.DB_CONFIG.PORT || 2000);
console.log('start on port: ', config_1.DB_CONFIG.PORT);
/**
 * Set authentication config using passport
 */
(0, passport_1.passportConfiguration)();
//# sourceMappingURL=app.js.map