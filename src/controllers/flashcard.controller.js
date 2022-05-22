const {
  getWordPack: serviceGetWordPack,
} = require('../services/common.service');
const { createNewDataForUser, isExistDataOfUser, getAllLearnedWords, updateWordLearned } = require('../services/flashCardsLearned.service');
const { isExistWordById } = require('../services/word.service');

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
    const { wordId, topicId } = req.body
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
}


exports.getSummaryTopicsLearned = async (req, res) => {
  try {
    const { accountId } = req.user;

    const isExistData = await isExistDataOfUser(accountId);

    if (!isExistData) {
      return res.status(200).json([]);
    }

    const wordsLearned = await getAllLearnedWords(accountId);

    const result = wordsLearned.map((topic) => {
      return {
        topicId: topic.topicId,
        words: topic.words.length
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !'
    });
  }
}

exports.getLearnedWordOfTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { accountId } = req.user;

    const isExistData = await isExistDataOfUser(accountId);

    if (!isExistData) {
      return res.status(200).json(null);
    }

    const wordsLearned = await getAllLearnedWords(accountId);

    const result = wordsLearned.find((topic) => topic.topicId === topicId);

    if (!result) {
      return res.status(200).json(null);
    }

    result.words = result.words.sort((word1, word2) => word1.updatedAt - word2.updatedAt);

    return res.status(200).json(result.words);
  } catch (error) {
    console.error('ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !'
    });
  }
}