const { createUsername, generateVerifyCode } = require('../helper');
const bcrypt = require('bcryptjs');
const {
  isExistAccount,
  createAccount,
  createUser,
  findAccount,
  updateFavoriteList,
  isExistWordInFavorites,
  isLimitedFavorites,
  updateUserCoin,
  updatePassword,
  getProfile,
  updateAvt,
  updateProfile,
} = require('../services/account.service');
const {
  COOKIE_EXPIRES_TIME,
  KEYS,
  ACCOUNT_TYPES,
  MAX,
} = require('../constant');
const jwtConfig = require('../configs/jwt.config');
const express = require('express');
const app = express();
const mailConfig = require('../configs/mail.config');
const {decryptedData} = require('../middlewares/rsa.middleware');
const {
  saveVerifyCode,
  checkVerifyCode,
  removeVerifyCode,
} = require('../services/common.service');

exports.postRegisterAccount = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.toLowerCase();

    // check account existence
    const isExist = await isExistAccount(email);
    if (isExist) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // create an account
    const newAccountId = await createAccount(
      email,
      password,
      ACCOUNT_TYPES.LOCAL,
    );
    if (!newAccountId) {
      return res
        .status(409)
        .json({ message: 'Account creation failed, try again' });
    }

    // create an user
    const username = createUsername(email, newAccountId);
    const newUser = await createUser(newAccountId, username, name);
    if (!newUser) {
      return res
        .status(409)
        .json({ message: 'Account creation failed, try again' });
    }

    return res.status(200).json({ message: 'Create Account Success' });
  } catch (error) {
    console.error('POST REGISTER ACCOUNT ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;
    const passwordDecrypt = decryptedData(password);

    // check account existence
    const account = await findAccount(email);
    if (!account) {
      return res.status(406).json({ message: 'Account does not exist' });
    }

    // check password
    const isMatch = await bcrypt.compare(passwordDecrypt, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // set cookie with jwt
    const token = await jwtConfig.encodedToken(
      process.env.JWT_SECRET_KEY || 'amonino-serect',
      { accountId: account._id },
    );

    return res.status(200).json({
      message: 'success',
      token,
    });
  } catch (error) {
    console.error('POST REGISTER ACCOUNT ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.postLoginSocialNetwork = async (req, res) => {
  try {
    const { user } = req;
    if (!Boolean(user)) {
      return res.status(401).json({ message: 'Login failed, try again' });
    }

    const { email, name, avt, id, type } = user;
    const account = await findAccount(email);
    let accountId = null;

    // If not exist then create a new account
    if (!account) {
      accountId = await createAccount(email, '', type);
      if (!accountId) {
        return res.status(401).json({ message: 'Login failed, try again' });
      }

      const username = `${name}-${id}`.slice(0, MAX.USER_NAME).toLowerCase();
      await createUser(accountId, username, name, avt);
    } else {
      accountId = account._id;
    }

    // set cookie with jwt
    const token = await jwtConfig.encodedToken(
      process.env.JWT_SECRET_KEY || 'amonino-serect',
      { accountId },
    );

    return res.status(200).json({
      message: 'success',
      token,
    });
  } catch (error) {
    console.error('LOGIN WITH GG ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.postResetPassword = async (req, res) => {
  try {
    const { email, verifyCode, password } = req.body;

    const { status, message } = await checkVerifyCode(verifyCode, email);
    if (!status) {
      return res.status(400).json({ message });
    }

    const isUpdated = await updatePassword(email, password);

    removeVerifyCode(email);

    if (isUpdated) {
      return res.status(200).json({ message: 'success' });
    }

    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  } catch (error) {
    console.error('POST RESET PASSOWORD ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.putToggleFavorite = async (req, res) => {
  try {
    const { word, username, isAdd = false } = req.body;

    const isExist = await isExistWordInFavorites(word, username);

    if (isAdd) {
      const isLimited = await isLimitedFavorites(word, username);

      if (isLimited) {
        return res.status(409).json({
          message:
            'The word count has exceeded the maximum number of favorites. Please upgrade it.',
        });
      }

      if (isExist) {
        return res
          .status(406)
          .json({ message: `Từ ${word} đã tồn tại trong danh sách` });
      }
    } else {
      if (!isExist) {
        return res
          .status(406)
          .json({ message: `The word ${word} already exists in the list` });
      }
    }

    const updateStatus = await updateFavoriteList(word, username, isAdd);

    if (updateStatus && updateStatus.ok && updateStatus.nModified) {
      return res.status(200).json({ message: 'success' });
    } else {
      return res.status(409).json({ message: 'failed' });
    }
  } catch (error) {
    console.error('PUT TOGGLE FAVORITE ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.putUpdateUserCoin = async (req, res) => {
  try {
    const { newCoin } = req.body;
    const username = req.user?.username;
    if (!username) {
      return res.status(406).json({ message: 'Not Accept' });
    }

    const update = await updateUserCoin(newCoin, username);

    if (update) {
      return res.status(200).json({ message: 'success' });
    }

    return res.status(406).json({ message: 'Not Accept' });
  } catch (error) {
    console.error('PUT UPDATE USER COIN ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.putUpdateAvt = async (req, res, next) => {
  try {
    const { user } = req;
    const { avtSrc } = req.body;
    if (!Boolean(avtSrc) || !Boolean(user)) {
      return res.status(400).json({ message: 'failed' });
    }
    const update = await updateAvt(user.username, avtSrc);
    if (!update) {
      return res.status(400).json({ message: 'failed' });
    }

    return res.status(200).json({ newSrc: update });
  } catch (error) {
    console.error('PUT UPDATE AVT ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.putUpdateProfile = async (req, res, next) => {
  try {
    const { user } = req;
    const { name, username } = req.body;
    if (!Boolean(user)) {
      return res.status(400).json({ message: 'Update failed' });
    }

    const update = await updateProfile(user.username, name, username);
    if (!update.status) {
      return res.status(400).json({ message: update.message });
    }

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('PUT UPDATE PROFILE ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { isAuth = false } = res.locals;
    if (!isAuth) {
      return res.status(401).json({ message: 'Failed' });
    }
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('GET USER INFO ERROR: ', error);
    return res.status(401).json({ message: 'Failed' });
  }
};

exports.getVerifyCode = async (req, res) => {
  try {
    const { email } = req.query;
    if (!Boolean(email)) {
      return res.status(400).json({ message: 'Account does not exist' });
    }

    const isExist = await isExistAccount(email);
    if (!isExist) {
      return res.status(400).json({ message: 'Account does not exist' });
    }

    const verifyCode = generateVerifyCode(MAX.VERIFY_CODE);

    const mail = {
      to: email,
      subject: 'Password change confirmation code',
      html: mailConfig.htmlResetPassword(verifyCode),
    };

    await mailConfig.sendEmail(mail);
    saveVerifyCode(verifyCode, email);

    return res
      .status(200)
      .json({ message: 'Code sent successfully. Please check your Email' });
  } catch (error) {
    console.error('GET VERIFY CODE ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'failed' });
    }
    const { accountId } = req.user;

    const userInfo = await getProfile(accountId);
    if (!userInfo) {
      return res.status(403).json({ message: 'failed' });
    }

    return res
      .status(200)
      .json({ email: userInfo.email, createdDate: userInfo.createdDate });
  } catch (error) {
    console.error('GET USER PROFILE ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};
