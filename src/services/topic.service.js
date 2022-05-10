const TopicModel = require('../models/topic.model');


exports.getTopicListService = async () => {
  try {
    const topics = await TopicModel.find({}).select('-html');
    return topics;
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
    const updatedTopic = await TopicModel.findByIdAndUpdate(_id, topic);
    return updatedTopic;
  } catch (error) {
    throw error;
  }
}