const {
  isExistWord,
  uploadImage,
  getWordPack,
} = require('../services/common.service');
const {
  createNewWord,
  searchWord,
  getWordDetail,
  getFavoriteList,
} = require('../services/word.service');

exports.postContributeWord = async (req, res, next) => {
  try {
    const { picture, word, type, ...rest } = req.body;

    // check existence of word
    const isExist = await isExistWord(word, type);
    if (isExist) {
      return res
        .status(409)
        .json({ message: `Từ "${word} (${type})" đã tồn tại trong từ điển` });
    }

    // upload description picture if available
    let pictureUrl = null;
    if (picture) {
      pictureUrl = await uploadImage(picture, 'amonino/words');
    }

    // create the new word
    const isCreateSuccess = await createNewWord({
      word,
      type,
      picture: pictureUrl,
      isChecked: false,
      ...rest,
    });

    if (isCreateSuccess) {
      return res.status(200).json({ message: 'Create new words successfully' });
    }
    return res.status(503).json({
      message: 'An error occurred, please try again later !'
    });
  } catch (error) {
    console.error('POST CONTRIBUTE WORD ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !'
    });
  }
};

exports.getCheckWordExistence = async (req, res) => {
  try {
    const { word, type } = req.query;
    const isExist = await isExistWord(word, type);
    return res.status(200).json({ isExist });
  } catch (error) {
    console.error('GET CHECK WORD EXIST ERROR: ', error);
    return res.status(200).json({ isExist: false });
  }
};

exports.getWordPack = async (req, res) => {
  try {
    const { page, perPage, packInfo, sortType } = req.query;

    const pageInt = parseInt(page),
      perPageInt = parseInt(perPage);
    const skip = (pageInt - 1) * perPageInt;

    const packList = await getWordPack(
      JSON.parse(packInfo),
      skip,
      perPageInt,
      '-_id type word mean phonetic picture',
      sortType === 'asc' ? '1' : sortType === 'desc' ? '-1' : null,
      null,
    );

    return res.status(200).json({ packList });
  } catch (error) {
    console.error('WORD GET WORD PACK ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !'
    });
  }
};


exports.getSearchWord = async (req, res) => {
  try {
    const { word, isCompact = false } = req.query;
    const list = await searchWord(
      word,
      20,
      isCompact == 'true'
        ? '-_id word'
        : '-_id type word mean phonetic picture',
    );
    return res.status(200).json({ packList: list });
  } catch (error) {
    console.error('GET SEARCH WORD ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !'
    });
  }
};

exports.getWordDetails = async (req, res, next) => {
  try {
    const { word } = req.query;
    const wordDetail = await getWordDetail(word);
    if (wordDetail) {
      return res.status(200).json(wordDetail);
    }
  } catch (error) {
    console.error('GET WORD DETAILS ERROR: ', error);
    return res.status(503).json({
      message: 'An error occurred, please try again later !'
    });
  }
};

exports.getUserFavoriteList = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user || !user.favoriteList) {
      return res.status(400).json({ message: 'failed' });
    }

    const { favoriteList } = user;
    if (!Array.isArray(favoriteList) || favoriteList.length === 0) {
      return res.status(200).json({ list: [] });
    }

    let { page, perPage, sortType } = req.query;
    page = parseInt(page);
    perPage = parseInt(perPage);

    let favoriteSorted = [...favoriteList];
    if (sortType === 'asc') {
      favoriteSorted.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
    } else if (sortType === 'desc') {
      favoriteSorted.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
    } else {
      favoriteSorted = favoriteSorted.reverse();
    }
    favoriteSorted = favoriteSorted.slice((page - 1) * perPage, page * perPage);

    const packList = await getFavoriteList(favoriteSorted);

    return res.status(200).json({ packList, total: favoriteList.length });
  } catch (error) {
    console.error(' ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !'
    });
  }
};
