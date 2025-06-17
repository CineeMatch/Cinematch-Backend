import CoMatchSuggestion from '../models/coMatchSuggestion.js';
import User from '../models/user.js';
import { findMostSimilarUser } from '../utils/recommendationAlgorithm.js';
import { Op, Sequelize } from "sequelize";

export const getAllCoMatchSuggestions = async (req, res) => {
    try {
        const coMatchSuggestions = await CoMatchSuggestion.findAll();
        res.status(200).json(coMatchSuggestions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching coMatch suggestions" });
    }
}

export const getCoMatchSuggestionById = async (req, res) => {
    const { id } = req.params;
    try {
        const coMatchSuggestion = await CoMatchSuggestion.findByPk(id);
        if (coMatchSuggestion) {
            res.status(200).json(coMatchSuggestion);
        } else {
            res.status(404).json({ message: "CoMatch suggestion not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching coMatch suggestion" });
    }
}

export const createCoMatchSuggestion = async (req, res) => {
  try {
    const userId = req.user.id;

    let similarUser = await findMostSimilarUser(userId);
    if (!similarUser || !similarUser.id) {
      similarUser = await User.findOne({
        where: { id: { [Op.ne]: userId } }, // kendisi hariç
        order: Sequelize.literal('RAND()')
      });
      if (!similarUser) {
        return res.status(404).json({ message: 'No similar user found' });
      }
    }

    const matchId = similarUser.id;

    // Daha önce önerilmiş mi?
    const alreadySuggested = await CoMatchSuggestion.findOne({
      where: { user_id: userId, match_id: matchId }
    });

    let finalMatchUser = null;
    //önerilmişse, shared_movies_count artırılacak ve en düşük shared_movies_count olan kullanıcı döndürülecek
    // değilse, yeni öneri oluşturulacak
    if (alreadySuggested) {
      const lowestCountMatch = await CoMatchSuggestion.findOne({
        where: { user_id: userId },
        order: [['shared_movies_count', 'ASC']]
      });

      if (!lowestCountMatch) {
        return res.status(404).json({ message: 'No match to fallback to' });
      }

      lowestCountMatch.shared_movies_count += 1;
      await lowestCountMatch.save();

      finalMatchUser = await User.findByPk(lowestCountMatch.match_id);

      return res.status(200).json({
        message: 'Similar user was already suggested. Returned lowest count match instead.',
        match: {
          ...finalMatchUser.dataValues,
          shared_movies_count: lowestCountMatch.shared_movies_count
        }
      });

    } else {
      const created = await CoMatchSuggestion.create({
        user_id: userId,
        match_id: matchId,
        shared_movies_count: 1,
        created_at: new Date()
      });

      return res.status(201).json({
        message: 'New match suggestion created',
        match: {
          ...similarUser,
          shared_movies_count: created.shared_movies_count
        }
      });
    }

  } catch (error) {
    console.error('Error in createCoMatchSuggestion:', error);
    return res.status(500).json({ message: `Error creating coMatchSuggestion ${error.message}` });
  }
};


export const deleteCoMatchSuggestion = async (req, res) => {
    const { id } = req.params;
    try {
        const coMatchSuggestion = await CoMatchSuggestion.findByPk(id);
        if (coMatchSuggestion) {
            await coMatchSuggestion.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: "CoMatch suggestion not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting coMatch suggestion" });
    }
}