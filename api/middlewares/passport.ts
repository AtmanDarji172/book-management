import passport from 'passport';
import * as passportJWT from 'passport-jwt';
import { CONSTANTS } from '../utilities/constant';
import { User } from '../models/user';

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

/**
 * Authentication middleware to validate routes
 */
export const authenticateJwt = passport.authenticate('jwt', { session: false });

/**
 * Passport configuration
 */
export async function passportConfiguration() {
    const passportConfig = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: CONSTANTS.JWT_SECRET
    };
    await passport.use(new JwtStrategy(passportConfig, async (payload: any, done) => {
        /**
         * Find user by ID from payload
         */
        const user = await User.findOne({ _id: payload.id });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }));
}