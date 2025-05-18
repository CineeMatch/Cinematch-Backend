import Recommendation from "../models/recommendation.js";
//This section probably get updated after making ai.

export const getAllRecommendations = async (req,res) => {
  try {
    const recommendations = await Recommendation.findAll();
    return res.status(200).json(recommendations);
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Recommendations cannot be found.' });
  }
};
export const getRecommendation=async(req,res)=>{
    try {
        const recommendation=await Recommendation.findByPk(req.params.id);
        if(!recommendation){
            return res.status(404).json({ error: `Recommendation doesn't exist.` });
        }
        return res.status(200).json(recommendation);
    } catch (error) {
        console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Recommendation cannot be found.' });
    }
}

export const createRecommendation = async (req, res) => {
 /*AI*/
 const {movie_id,user_id,score}=req.body; //score suppose to be taken from ai;
 try {
  const recommendation=await Recommendation.findOne({where:{user_id:user_id,movie_id:movie_id,score:score}});
  if(recommendation){
   return res.status(409).json("This recommendation already exist.");
  }
  const newRecommendation=await Recommendation.create({
    movie_id:movie_id,
    user_id:user_id,
    score:score
  });
  res.status(201).json({message:"Recommendation created successfully.",recommendation:newRecommendation});
 } catch (error) {
  console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Recommendation cannot be created.' });
 }
};

export const deleteRecommendation = async (req, res) => {
  try {
    const recommendation=await Recommendation.destroy({
      where: { id: req.params.id }
    });

    if (recommendation) {
      return res.status(200).json({ message: "Recommendation deleted successfully." });
    } else {
      return res.status(404).json({ message: "This recommendation doesn't exist." });
    }
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ error: 'Recommendation could not be deleted.' });
  }
};

export const updateRecommendationScore = async (req, res) => {
  const recommendationId = req.params.id;
  try {
    const recommendation = await Recommendation.update({score:req.body.score}, {
      where: { id: recommendationId }
    });
    if (recommendation[0] === 0) {
      return res.status(404).json({ message: "Recommendation not found or not updated." });
    }
    const newRecommendation= await Recommendation.findByPk(req.params.id);
    res.status(200).json({message:"Recommendation score updated.",recommendation:newRecommendation});
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: "Recommendation could not be updated." });
  }
};
