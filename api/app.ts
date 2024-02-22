import * as bodyParser from 'body-parser';

import 'reflect-metadata';

import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { connectToDB } from './utilities/db';
import { passportConfiguration } from './middlewares/passport';
import { DB_CONFIG } from './utilities/config';
import cors from 'cors';

/**
 * declare metadata by @controller annotation
 */
import './controllers/book.controller';
import './controllers/general.controller';
import './controllers/base.controller';
import './controllers/user.controller';

/**
 * Set up containers
 */
let container = new Container();

// set up bindings
// container.bind<FooService>('FooService').to(FooService);

/**
 * Connect to mongoDB using mongoose
 */
connectToDB();

/**
 * Create server using InversifyExpressServer
 */
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
    // add body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE, UPDATE');
        next();
    });
    // Enable CORS
    app.use(cors());
});
server.build()
      .listen(DB_CONFIG.PORT || 2000);
console.log('start on port: ', DB_CONFIG.PORT)

/**
 * Set authentication config using passport
 */
passportConfiguration();