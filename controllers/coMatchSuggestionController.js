import CoMatchSuggestion from '../models/coMatchSuggestion.js';
import MovieType from '../models/movieType.js';
import { Op } from 'sequelize';

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

// TODO: yapay zeka ile gelmiycek bu yüzden bunu nasıl yapabiliriz?
export const createCoMatchSuggestion = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const userFavorites = await MovieType.findAll({
        where: {
          user_id: userId,
          favoriteMovies: 1
        },
        attributes: ['movie_id']
      });
  
      const userFavoriteMovieIds = userFavorites.map(fav => fav.movie_id);
  
      if (userFavoriteMovieIds.length === 0) {
        return res.status(400).json({ error: 'User has no favorite movies.' });
      }
  
      const otherFavorites = await MovieType.findAll({
        where: {
          user_id: { [Op.ne]: userId },
          favoriteMovies: 1,
          movie_id: { [Op.in]: userFavoriteMovieIds }
        },
        attributes: ['user_id', 'movie_id']
      });
  
      const matchMap = {};
  
      otherFavorites.forEach(fav => {
        if (!matchMap[fav.user_id]) {
          matchMap[fav.user_id] = new Set();
        }
        matchMap[fav.user_id].add(fav.movie_id);
      });
  
      const suggestions = [];
      const now = new Date();
  
      for (const matchId in matchMap) {
        const sharedMoviesCount = matchMap[matchId].size;
  
        if (sharedMoviesCount > 0) {
          suggestions.push({
            user_id: userId,
            match_id: matchId,
            shared_movies_count: sharedMoviesCount,
            created_at: now,
          });
        }
      }
  
      if (suggestions.length === 0) {
        return res.status(200).json({ message: 'No matching users found.' });
      }
  
      await CoMatchSuggestion.bulkCreate(suggestions);
  
      return res.status(201).json({ message: 'CoMatch suggestions created successfully.', suggestions });
      
    } catch (error) {
      console.error('Create CoMatchSuggestions Error:', error);
      return res.status(500).json({ error: 'Failed to create CoMatchSuggestions.' });
    }
  };

export const updateCoMatchSuggestion = async (req, res) => {
    const { id } = req.params;
    const { user_id, match_id, shared_movies_count} = req.body;
    try {
      if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
      }
      if (!match_id) {
        return res.status(400).json({ message: "match_id is required" });
      }
        const coMatchSuggestion = await CoMatchSuggestion.findByPk(id);
        if (coMatchSuggestion) {
            coMatchSuggestion.user_id = user_id;
            coMatchSuggestion.match_id = match_id;
            coMatchSuggestion.shared_movies_count = shared_movies_count;
            coMatchSuggestion.created_at = created_at;
            await coMatchSuggestion.save();
            res.status(200).json(coMatchSuggestion);
        } else {
            res.status(404).json({ message: "CoMatch suggestion not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating coMatch suggestion" });
    }
}

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