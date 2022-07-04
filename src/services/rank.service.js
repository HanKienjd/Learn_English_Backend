const { MAX_TOP, HIGHSCORE_NAME } = require('../constant/highscore');
const UserModel = require('../models/account.model/user.model');
const HighscoreModel = require('../models/highscore.model');

exports.updateTop = async (accountId, name, score) => {
  try {
    let tops = await HighscoreModel.findOne({ name });

    let unit = '';
    for (let key in HIGHSCORE_NAME) {
      if (HIGHSCORE_NAME[key].name === name) {
        unit = HIGHSCORE_NAME[key].unit;
        break;
      }
    }

    let newTops = [];
    if (!Boolean(tops)) {
      newTops.push({ accountId, score: Number(score) });
      return HighscoreModel.create({
        name,
        unit,
        top: newTops,
      });
    } else {
      const index = tops.top.findIndex(
        i => i.accountId.toString() === accountId.toString(),
      );

      if (index === -1) {
        tops.top.push({ accountId, score: Number(score) });
      } else {
        const item = tops.top[index];
        item.score += score;
      }
      newTops = tops.top;

      newTops = newTops
        .sort((a, b) => Number(a.score) - Number(b.score))
        .slice(0, MAX_TOP);

      await HighscoreModel.updateOne({ name }, { top: newTops });
      return true;
    }
  } catch (error) {
    throw error;
  }
};

exports.getLeaderboardWithName = async (name = '') => {
  try {
    const highscores = await HighscoreModel.findOne({ name });
    if (!Boolean(highscores)) {
      return [];
    }
    let { top } = highscores;
    top.sort((a, b) => b.score - a.score);

    const l = top.length;
    let topList = [];

    for (let i = 0; i < l; ++i) {
      const { name, avt } = await UserModel.findOne({
        accountId: top[i].accountId,
      }).select('name avt -_id');

      topList.push({
        accountId: `${top[i].accountId}`,
        name: name || 'Anonymous',
        avatar: avt,
        score: top[i].score,
        rank: i + 1
      });
    }

    return topList;
  } catch (error) {
    throw error;
  }
};
