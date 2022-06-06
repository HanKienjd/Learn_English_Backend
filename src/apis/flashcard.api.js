const flashcardApi = require('express').Router();
const flashcardController = require('../controllers/flashcard.controller');
const passportConfig = require('../middlewares/passport.middleware');

flashcardApi.get(
  '/word-pack',
  passportConfig.jwtAuthentication,
  flashcardController.getWordPack,
);
flashcardApi.post(
  '/word-learned',
  passportConfig.jwtAuthentication,
  flashcardController.handleLearnedWord,
);
flashcardApi.get(
  '/word-learned',
  passportConfig.jwtAuthentication,
  flashcardController.getSummaryTopicsLearned,
);
flashcardApi.get(
  '/word-learned/:topicId',
  passportConfig.jwtAuthentication,
  flashcardController.getLearnedWordOfTopic,
);
flashcardApi.get(
  '/word-unlearned/:topicId',
  passportConfig.jwtAuthentication,
  flashcardController.getUnLearnedWordsOfTopic,
);
flashcardApi.get(
  '/word-review/:topicId',
  passportConfig.jwtAuthentication,
  flashcardController.getReviewWordsOfTopic,
);
flashcardApi.post(
  '/word-review-log/:topicId',
  passportConfig.jwtAuthentication,
  flashcardController.saveFlashCardsReviewLog,
);
flashcardApi.get(
  '/word-review-log/:topicId',
  passportConfig.jwtAuthentication,
  flashcardController.getMostRecentFlashCardsReviewLog,
);

module.exports = flashcardApi;
