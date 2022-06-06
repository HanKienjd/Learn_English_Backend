const {
  getTopicListService,
  createTopicService,
  deleteTopicService,
  updateTopicService,
} = require('../services/topics.service');
const { getAllLearnedWords } = require('../services/flashCardsLearned.service');
const { getCountWordPackByTopicId } = require('../services/common.service');

exports.getTopicList = async (req, res, next) => {
  try {
    const { accountId } = req.user;
    const data = await getTopicListService();
    const wordsLearned = await getAllLearnedWords(accountId);

    const results = await Promise.all(
      data.map(async item => {
        const total = await getCountWordPackByTopicId(item.topicId);
        const totalLearned =
          wordsLearned.find(word => word.topicId === item.topicId)?.words
            .length || 0;
        wordIdsLearned =
          wordsLearned
            .find(word => word.topicId === item.topicId)
            ?.words.map(word => word.wordId._id) || [];

        return {
          ...item.toObject(),
          total,
          learned: totalLearned,
          isDone: totalLearned === total,
          wordIdsLearned,
        };
      }),
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error('GET TOPIC LIST ERROR: ', error);
    return res
      .status(500)
      .json({ message: 'An error occurred, please try again later !' });
  }
};

exports.createTopic = async (req, res, next) => {
  try {
    const newTopic = await createTopicService(req.body);
    return res.status(200).json({ mesage: ' Create success', data: newTopic });
  } catch (error) {
    console.error(' CREATE TOPIC ERROR: ', error);
    return res
      .status(500)
      .json({ message: 'An error occurred, please try again later !' });
  }
};

exports.deleteTopic = async (req, res, next) => {
  try {
    const { _id } = req.query;
    if (!Boolean(_id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    await deleteTopicService(_id);
    return res.status(200).json({ message: 'Delete successfully' });
  } catch (error) {
    console.error(' DELETE TOPIC ERROR: ', error);
    return res
      .status(500)
      .json({ message: 'An error occurred, please try again later !' });
  }
};

exports.updateTopic = async (req, res, next) => {
  try {
    const { _id } = req.query;
    if (!Boolean(_id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const updatedTopic = await updateTopicService(_id, req.body);
    return res.status(200).json(updatedTopic);
  } catch (error) {
    console.error(' UPDATE TOPIC ERROR: ', error);
    return res
      .status(500)
      .json({ message: 'An error occurred, please try again later !' });
  }
};
