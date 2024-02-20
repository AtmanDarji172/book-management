import * as bodyParser from 'body-parser';

import 'reflect-metadata';

import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import mongoose from 'mongoose';

import passport from 'passport';
import * as passportJWT from 'passport-jwt';

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

require('dotenv').config();


/**
 * declare metadata by @controller annotation
 */
import './controllers/book.controller';
import './controllers/general.controller';
import './controllers/base.controller';
import { CONSTANTS } from './utilities/constant';
import { User } from './models/user';

/**
 * Set up containers
 */
let container = new Container();

// set up bindings
// container.bind<FooService>('FooService').to(FooService);

/**
 * MongoDB connection using mongoose
 */
const url: string = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@book-management.sfig0x3.mongodb.net/`;
mongoose.connect(url, { dbName: 'master' })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });

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
      .listen(process.env.PORT || 2000);
console.log('start on port: ', process.env.PORT)

/**
 * Passport configuration
 */
const passportConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: CONSTANTS.JWT_SECRET
};
passport.use(new JwtStrategy(passportConfig, async (payload: any, done) => {
    // Find user by ID from payload
    const user = await User.findOne({ _id: payload.id });
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
}));