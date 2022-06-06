const {
  getWordPack: serviceGetWordPack,
} = require('../services/common.service');
const {
  createNewDataForUser,
  isExistDataOfUser,
  getAllLearnedWords,
  updateWordLearned,
  saveFlashCardsReviewLog,
  getMostRecentFlashCardsReviewLog,
} = require('../services/flashCardsLearned.service');
const { isExistWordById } = require('../services/word.service');
const { getWordPackByTopicId } = require('../services/common.service');
const {
  NUM_WORDS_LEARN_IN_REVIEW,
  REVIEW_STATUS_LOGS,
} = require('../constant');

exports.getWordPack = async (req, res, next) => {
  try {
    const { page, perPage, packInfo } = req.query;
    const pageInt = parseInt(page),
      perPageInt = parseInt(perPage);
    const skip = (pageInt - 1) * perPageInt;

    const packList = await serviceGetWordPack(
      JSON.parse(packInfo),
      skip,
      perPageInt,
      '-_id type word mean level phonetic examples picture',
      null,
      { $and: [{ picture: { $ne: null } }, { picture: { $ne: '' } }] },
    );

    return res.status(200).json({ packList });
  } catch (error) {
    console.error('GET WORD PACK ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.handleLearnedWord = async (req, res) => {
  try {
    const { wordId, topicId } = req.body;
    const { accountId } = req.user;

    const isExistWordInData = await isExistWordById(wordId);
    if (!isExistWordInData) {
      return res.status(500).json({ message: 'Từ không tồn tại' });
    }

    let result;

    const isExistData = await isExistDataOfUser(accountId);

    if (isExistData) {
      result = await updateWordLearned({ accountId, wordId, topicId });
    } else {
      result = await createNewDataForUser({ accountId, wordId, topicId });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getSummaryTopicsLearned = async (req, res) => {
  try {
    const { accountId } = req.user;

    const isExistData = await isExistDataOfUser(accountId);

    if (!isExistData) {
      return res.status(200).json([]);
    }

    const wordsLearned = await getAllLearnedWords(accountId);

    const result = wordsLearned.map(topic => {
      return {
        topicId: topic.topicId,
        words: topic.words.length,
      };
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

const handleGetLearnedWordOfTopic = async (req, res) => {
  const { topicId } = req.params;
  const { accountId } = req.user;

  const isExistData = await isExistDataOfUser(accountId);

  if (!isExistData) {
    return res.status(200).json([]);
  }

  const wordsLearned = await getAllLearnedWords(accountId);

  const result = wordsLearned.find(topic => topic.topicId === topicId);

  if (!result) {
    return res.status(200).json([]);
  }

  result.words = result.words.sort(
    (word1, word2) => word1.updatedAt - word2.updatedAt,
  );

  return result.words.map(word => word.wordId);
};

exports.getLearnedWordOfTopic = async (req, res) => {
  try {
    const result = await handleGetLearnedWordOfTopic(req, res);

    return res.status(200).json(result);
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.getUnLearnedWordsOfTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const wordsLearned = await handleGetLearnedWordOfTopic(req, res);

    const words = await getWordPackByTopicId(topicId);

    // that means the user has learned all the vocabulary in the topic, we will return the learned words so that the user can review
    if (wordsLearned.length === words.length) {
      return res.status(200).json(wordsLearned);
    }

    // filter un-learned words
    const wordsUnLearned = words.filter(word => {
      const isExistWord = wordsLearned.find(
        wordLearned => wordLearned._id.toString() === word._id.toString(),
      );
      return !isExistWord;
    });

    return res.status(200).json(wordsUnLearned);
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.getReviewWordsOfTopic = async (req, res) => {
  try {
    const result = await handleGetLearnedWordOfTopic(req, res);

    return res.status(200).json(result.slice(0, NUM_WORDS_LEARN_IN_REVIEW));
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.saveFlashCardsReviewLog = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { accountId } = req.user;
    const { learned, reviewed, status } = req.body;

    let result;

    if (status === REVIEW_STATUS_LOGS.CANCELLED) {
      result = await saveFlashCardsReviewLog({
        accountId,
        topicId,
        status,
      });
    } else {
      result = await saveFlashCardsReviewLog({
        accountId,
        topicId,
        total: NUM_WORDS_LEARN_IN_REVIEW,
        learned,
        reviewed:
          reviewed > NUM_WORDS_LEARN_IN_REVIEW
            ? NUM_WORDS_LEARN_IN_REVIEW
            : reviewed,
        status:
          reviewed < NUM_WORDS_LEARN_IN_REVIEW
            ? REVIEW_STATUS_LOGS.UN_FINISHED
            : REVIEW_STATUS_LOGS.FINISHED,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.getMostRecentFlashCardsReviewLog = async (req, res) => {
  try {
    const { accountId } = req.user;
    const { topicId } = req.params;

    const result = await getMostRecentFlashCardsReviewLog({
      accountId,
      topicId,
    });
    if (!result) {
      return res.status(200).json({
        message: 'You have not done any vocabulary review with this topic !',
        error: true,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !',
    });
  }
};
