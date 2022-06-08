const UserModel = require('../models/account.model/user.model');
const jwt = require('jsonwebtoken');
const express = require('express');
const { KEYS, ACCOUNT_TYPES } = require('../constant');
const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

// Authentication with JWT
exports.jwtAuthentication = async (req, res, next) => {
  try {
    res.locals.isAuth = false;

    const isTokenEmpty =
      (!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session);

    if (isTokenEmpty) {
      throw new Error('Token is empty');
    }

    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      // Read the ID Token from the Authorization header.
      token = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
      // Read the ID Token from cookie.
      token = req.cookies.__session;
    } else {
      return next();
    }

    // if not exist cookie[access_token] -> isAuth = false -> next
    if (!token) {
      throw new Error('Token is empty');
    }

    // verify jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { accountId } = decoded.sub;
      let user = await UserModel.findOne({ accountId }).select(
        '-_id username name avt favoriteList coin',
      );

      if (user) {
        user.accountId = accountId;
        res.locals.isAuth = true;
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Authentication with JWT ERROR: ', error);
    return res.status(401).json({
      message: 'Unauthorized.',
      error,
    });
  }
};

// Authentication with Google OAuth2
passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    function (accessToken, refreshToken, profile, done) {
      try {
        if (!Boolean(profile)) {
          done(null, null);
          return;
        }

        const {
          given_name: givenName,
          family_name: familyName,
          email,
          picture,
          id,
        } = profile._json;

        done(null, {
          type: ACCOUNT_TYPES.GOOGLE,
          name: `${givenName} ${familyName}`,
          email,
          avt: picture,
          id,
        });
      } catch (error) {
        done(error, null);
        return;
      }
    },
  ),
);

// Authentication with Facebook OAuth2
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      fbGraphVersion: 'v3.0',
    },
    function (accessToken, refreshToken, profile, done) {
      try {
        if (!Boolean(profile)) {
          done(null, null);
          return;
        }

        const { name, email, id } = profile._json;

        done(null, {
          type: ACCOUNT_TYPES.FACEBOOK,
          name,
          email,
          avt: profile.photos[0]?.value,
          id,
        });
      } catch (error) {
        done(error, null);
        return;
      }
    },
  ),
);
