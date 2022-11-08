const { Audio } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const allAudios = await Audio.find().populate('author');
    // await allAudios.populate('author')
    res.json(allAudios);
  } catch (error) {
    next(error);
  }
};


exports.getAllTop = async (req, res, next) => {
 
  try {
   const allAudiosTOP = await Audio.find().sort({ listenCount: -1 }).populate('author')
  //  await allAudiosTOP.populate('author')
    res.json(allAudiosTOP);}   
    catch (error) {
    next(error);
  }
};


exports.getAllNew = async (req, res, next) => {

 
    try {
   const allAudiosNEW = await Audio.find().sort({ createdAt: -1, updatedAt: -1 }).populate('author');
  //  await allAudiosNEW.populate('author')
      res.json(allAudiosNEW);}
      catch (error) {
      next(error);
    
  };
};


exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const audios = await Audio.findById(id);
    await audios.populate('author')
    res.json(audios);

  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

 
    const audio = await Audio.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await audio.populate('author')
    res.json(audio);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
   
    const audio1 = await Audio.findByIdAndDelete(id);
    await audio1.populate('author')
    res.json(audio1);
  } catch (error) {
    next(error);
  }
};
exports.favorite = async (req, res, next) => {
  const { audioId } = req.params;
  if (!req.body) {
    return res.status(400).json({ message: "Missing field favorite in the audio!" });
  }
  try {
    const updatedAudio = await Audio.findByIdAndUpdate(
      audioId, 
      {
       favorite: req.body.favorite
      },
      {
        new: true,
      }
    );
    if (!updatedAudio) {
      return res
        .status(404)
        .json({ message: `Contact with id ${audioId} not found` });
    }
    await audioId.populate('author')
    res.json(audioId);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, Not found" });
  }
}; 