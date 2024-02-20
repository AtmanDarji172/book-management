import * as bodyParser from 'body-parser';

import 'reflect-metadata';

import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { connectToDB } from './utilities/db';
import { passportConfiguration } from './middlewares/passport';
import { DB_CONFIG } from './utilities/config';

/**
 * declare metadata by @controller annotation
 */
import './controllers/book.controller';
import './controllers/general.controller';
import './controllers/base.controller';

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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, UPDATE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
});
server.build()
      .listen(DB_CONFIG.PORT || 2000);
console.log('start on port: ', DB_CONFIG.PORT)

/**
 * Set authentication config using passport
 */
passportConfiguration();