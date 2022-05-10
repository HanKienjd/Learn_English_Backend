const { getTopicListService, createTopicService, deleteTopicService, updateTopicService} = require('../services/topic.service');

exports.getTopicList = async (req, res, next) => { 
  try {
    const topics = await getTopicListService();
    return res.status(200).json({ topics });
  } catch (error) {
    console.error('GET TOPIC LIST ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
}

exports.createTopic = async (req, res, next) => {
  try {
    const newTopic = await createTopicService(req.body);
    return res.status(200).json({ mesage: " Tạo thành công" , data : newTopic });
  } catch (error) {
    console.error(' CREATE TOPIC ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
}

exports.deleteTopic = async (req, res, next) => {
  try {
    const { _id } = req.query;
    if (!Boolean(_id)) {
      return res.status(400).json({ message: 'id không hợp lệ' });
    }
    await deleteTopicService(_id);
    return res.status(200).json({  message: 'Xóa thành công' });
  } catch (error) {
    console.error(' DELETE TOPIC ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
}

exports.updateTopic = async (req, res, next) => {
  try {
    const { _id } = req.query;
    if (!Boolean(_id)) {
      return res.status(400).json({ message: 'id không hợp lệ' });
    }
    const updatedTopic = await updateTopicService(_id, req.body);
    return res.status(200).json({ message: "Cập nhật thành công", data : updatedTopic });

  } catch (error) {
    console.error(' UPDATE TOPIC ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
}