const { Audio } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const allAudios = await Audio.find();
    res.json(allAudios);
  } catch (error) {
    next(error);
  }
};


exports.getAllTop = async (req, res, next) => {
 
  try {
   const allAudiosTOP = await Audio.find().sort({ listenCount: -1 })
  
    res.json(allAudiosTOP);}
    catch (error) {
    next(error);
  }
};


exports.getAllNew = async (req, res, next) => {

 
    try {
   const allAudiosNEW = await Audio.find().sort({ createdAt: -1, updatedAt: -1 });
    
      res.json(allAudiosNEW);}
      catch (error) {
      next(error);
    
  };
};


exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const audios = await Audio.findById(id);
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
    res.json(audio);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
   
    const audio1 = await Contact.findByIdAndDelete(id);
    res.json(audio1);
  } catch (error) {
    next(error);
  }
};
exports.favorite = async (req, res, next) => {
  const { audioId } = req.params;
  if (!req.body) {
    return res.status(400).json({ message: "missing field favorite" });
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
    res.json(audioId);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, Not found" });
  }
};