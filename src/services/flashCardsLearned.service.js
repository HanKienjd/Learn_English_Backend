const FlashCardsLearned = require('../models/flashCardsLearned.model');
const FlashCardsLogs = require('../models/flashCardsLogs.model');

exports.createNewDataForUser = async ({ accountId, topicId, wordId }) => {
  try {
    await FlashCardsLearned.create({
      accountId,
      topics: [
        {
          topicId,
          words: [
            {
              wordId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      ],
    });
    return true;
  } catch (error) {
    throw error;
  }
};

exports.isExistDataOfUser = accountId => {
  try {
    return FlashCardsLearned.exists({ accountId });
  } catch (error) {
    throw error;
  }
};

exports.updateWordLearned = async ({ accountId, topicId, wordId }) => {
  try {
    const dataLearned = await FlashCardsLearned.findOne({ accountId }).select(
      'topics',
    );
    const topicsLearned = dataLearned.topics;
    const topicLearned = topicsLearned.find(
      topic => topic.topicId.toString() === topicId,
    );

    // check if topic wasn't learned
    if (!topicLearned) {
      const newTopic = {
        topicId,
        words: [
          {
            wordId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      topicsLearned.push(newTopic);
    } else {
      const wordsLearned = topicLearned.words;
      const wordLearned = wordsLearned.find(
        word => word.wordId.toString() === wordId,
      );

      // check if word wasn't learned
      if (!wordLearned) {
        const newWord = {
          wordId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        topicLearned.words.push(newWord);
      } else {
        // update updatedAt field of word
        wordLearned.updatedAt = new Date();
      }
    }

    const updateRes = await FlashCardsLearned.updateOne(
      { accountId },
      { topics: topicsLearned },
    );
    if (updateRes.ok) {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

exports.getAllLearnedWords = async (accountId, topicId) => {
  try {
    const res = await FlashCardsLearned.find({ accountId }).populate(
      'topics.words.wordId',
    );
    const result = res[0]?.topics || [];
    if (topicId) {
      return result.find(topic => topic.topicId === topicId)?.words || [];
    }
    return result;
  } catch (error) {
    throw error;
  }
};

exports.saveFlashCardsReviewLog = async data => {
  try {
    return FlashCardsLogs.create(data);
  } catch (error) {
    throw error;
  }
};

exports.getMostRecentFlashCardsReviewLog = async ({ accountId, topicId }) => {
  try {
    const result = await FlashCardsLogs.find({ accountId, topicId }).sort({
      createdAt: -1,
    });
    return result?.[0];
  } catch (error) {
    throw error;
  }
};
