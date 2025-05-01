import Like from "../models/like.js";

export const getAllLikes = async (req, res) => {
    try {
      const likes = await Like.findAll();
      return res.status(200).json(likes);
    } catch (error) {
      console.error('Fetch Error:', error);
      return res.status(500).json({ error: 'Likes cannot be found.' });
    }
  };

  export const getLikesByPost=async(req,res)=>{
    try {
        const likes=await Like.findAll({where:{post_id:req.params.id}});
        return res.status(200).json({"likes":likes, "likeCount":likes.length});
    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ error: 'Likes cannot be found.' });
      }
    };

    export const getUserLikeOnPost=async(req,res)=>{
      const user=req.user.id
      try {
          const like=await Like.findOne({where:{post_id:req.params.id,user_id:user }});
          return res.status(200).json({"like":like});
      } catch (error) {
          console.error('Fetch Error:', error);
          return res.status(500).json({ error: 'Like cannot be found.' });
        }
      };

      export const createLike=async(req,res)=>{
        const user= req.user.id;
        try {   
          const like= await Like.findOne({where:{post_id:req.body.post_id, user_id:user }});
          if(like){
            return res.status(409).json({message:"This user already liked this."})
          }
          const newLike= await Like.create({post_id:req.body.post_id, user_id:user });
          return res.status(201).json({message:"This post liked successfully.",like:newLike});
        } catch (error) {
          console.error('Fetch Error:', error);
          return res.status(500).json({ error: 'Likes cannot be created.' });
        }
      };

      export const removeLike=async(req,res)=>{
        const user=req.user.id;
        try {
          const like=await Like.findOne({where:{post_id:req.params.id,user_id:user}});
          if(!like){
            return res.status(404).json({error:"This post isn't liked by this user."});
          }
          const unlike=await Like.destroy({where:{post_id:req.params.post_id,user_id:user}});
          return res.status(200).json({message:"This post unliked by active user successfully.",unlike});
        } catch (error) {
          console.error('Fetch Error:', error);
          return res.status(500).json({ error: 'Likes cannot be unliked.' });
        }
      };
  
  