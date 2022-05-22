const TopicModel = require('../models/topics.model');
const WordModel = require('../models/word.model');
const flashCardsLearned = require('../models/flashCardsLearned.model');

exports.getTopicListService = async () => {
  try {
    const data = await TopicModel.find({});
    return data;
  } catch (error) {
    throw error;
  }
}

exports.createTopicService = async (topic) => {
  try {
    const newTopic = await TopicModel.create(topic);
    return newTopic;
  } catch (error) {
    throw error;
  }
}

exports.deleteTopicService = async (_id) => {
  try {
    const deletedTopic = await TopicModel.findByIdAndDelete(_id);
    return deletedTopic;
  } catch (error) {
    throw error;
  }
}

exports.updateTopicService = async (_id, topic) => {
  try {
    await TopicModel.findByIdAndUpdate(_id, topic);
    return { message: 'Cập nhật thành công' };
  } catch (error) {
    throw error;
  }
}