import { Op } from "sequelize";
import Challenge from "../models/challenge.js";
import Movie from "../models/movie.js";
import { createNotification } from "../utils/notificationUtil.js";

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.findAll();
    return res.status(200).json(challenges);
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ error: "Challenges cannot be found." });
  }
};

export const getChallengeByID = async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id, {
      include: [
        { model: Movie, as: "movie" },
        { model: User, as: "creator", attributes: ["id", "nickname"] },
        { model: User, as: "opponent", attributes: ["id", "nickname"] },
      ],
    });

    if (!challenge) {
      return res.status(404).json({ error: `Challenge doesn't exist.` });
    }

    const challengeWithMovie = {
      challenge_Id: challenge.id,
      movie_title: challenge.movie?.title,
      movie_poster: challenge.movie?.poster_url,
      movie_id: challenge.movie?.id,
      creator_id: challenge.creator_id,
      creator_nickname: challenge.creator?.nickname || null,
      opponent_id: challenge.opponent_id,
      opponent_nickname: challenge.opponent?.nickname || null,
      status: challenge.status,
      endTime: new Date(
        challenge.updatedAt.getTime() + challenge.duration * 60 * 1000
      ),
    };

    return res.status(200).json({ challenge: challengeWithMovie });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ error: "Challenge cannot be found." });
  }
};

export const getChallengesByUser = async (req, res) => {
  try {
    const challenges = await Challenge.findAll({
      where: {
        [Op.or]: [{ opponent_id: req.user.id }, { creator_id: req.user.id }],
      },
      include: [{ model: Movie, as: "movie" }],
    });

    if (challenges.length === 0) {
      return res
        .status(404)
        .json({ message: "There isn't any challenge for this user." });
    }
    const challengesWithMovies = challenges.map((challenge) => {
      return {
        challenge_Id: challenge.id,
        movie_title: challenge.movie.title,
        movie_poster: challenge.movie.poster_url,
        movie_id: challenge.movie.id,
        creator_id: challenge.creator_id,
        opponent_id: challenge.opponent_id,
        status: challenge.status,
        duration: challenge.duration,
        endTime: challenge.end_time,
        updatedAt: challenge.updatedAt,
      };
    });
    return res
      .status(200)
      .json({
        message: "Challenges listed successfully.",
        challenges: challengesWithMovies,
      });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ error: "Challenges couldn't be listed." });
  }
};

export const createChallenge = async (req, res) => {
  try {
    const creator_id = req.user.id;
    const { movie_id, opponent_id, duration } = req.body;

    if (!movie_id || !creator_id || !opponent_id || !duration) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const existingChallenge = await Challenge.findOne({
      where: {
        movie_id,
        creator_id,
        opponent_id,
      },
    });

    if (existingChallenge) {
      return res.status(409).json({ error: "This challenge already exists." });
    }

    const newChallenge = await Challenge.create({
      ...req.body,
      creator_id,
      status: "pending",
    });
    await createNotification(3,creator_id,opponent_id);
    return res.status(201).json({
      message: "New challenge created successfully!",
      challenge: newChallenge,
    });
  } catch (error) {
    console.error("Create Error:", error);
    return res.status(500).json({ error: "Challenge could not be created." });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.destroy({
      where: { id: req.params.id },
    });

    if (challenge) {
      return res
        .status(200)
        .json({ message: "Challenge deleted successfully." });
    } else {
      return res.status(404).json({ message: "This challenge doesn't exist." });
    }
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ error: "Challenge could not be deleted." });
  }
};

const updateChallengeStatus = async (req, res, status) => {
  try {
    const updateData = { status };

    if (status === "accepted") {
      const now = new Date();
      const challenge = await Challenge.findByPk(req.params.id);

      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found." });
      }

      const durationMs = challenge.duration * 60 * 1000;
      const endTime = new Date(now.getTime() + durationMs);
      updateData.end_time = endTime;
    }

    const updated = await Challenge.update(
      updateData,
      { where: { id: req.params.id } }
    );

    if (updated[0] === 0) {
      return res
        .status(404)
        .json({ message: "Challenge not found or not updated." });
    }

    return res
      .status(200)
      .json({ message: `Challenge status updated to ${status}.` });
  } catch (error) {
    console.error("Update Error:", error);
    return res
      .status(500)
      .json({ error: `Challenge could not be updated, ${error.message}` });
  }
};

export const updateChallengeStatusAccepted = (req, res) =>
  updateChallengeStatus(req, res, "accepted");
export const updateChallengeStatusAnswered = (req, res) =>
  updateChallengeStatus(req, res, "answered");
export const updateChallengeStatusCompleted = (req, res) =>
  updateChallengeStatus(req, res, "completed");
