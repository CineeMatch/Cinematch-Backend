import Movie from '../models/movie.js';
import MovieType from '../models/movieType.js';
import MovieCategory from '../models/movieCategory.js';
import Category from '../models/category.js';
import { Op } from 'sequelize';
import User from '../models/User.js';
import natural from 'natural';


export async function getUserProfileText(userId) {
    const movieTypes = await MovieType.findAll({
        where: { user_id: userId },
        include: [{
            model: Movie,
            include: [{
                model: MovieCategory,
                include: [Category]
            }]
        }]
    });

    let text = "";

    for (const mt of movieTypes) {
        const movie = mt.Movie;
        if (!movie) continue;

        // Türler
        const categories = movie.MovieCategories?.map(mc => mc.Category.name) || [];
        text += " " + categories.join(' ');

        // Yönetmen
        if (movie.director) text += " " + movie.director;

        // Oyuncular (birden fazla varsa virgülle ayrılabilir)
        if (movie.actor) text += " " + movie.actor;
    }

    return text.trim();
}


const TfIdf = natural.TfIdf;

export async function findMostSimilarUser(userId) {
    const users = await User.findAll({
        where: { id: { [Op.ne]: userId } }
    });

    const currentText = await getUserProfileText(userId);
    let bestUser = null, bestScore = 0;

    for (const user of users) {
        const otherText = await getUserProfileText(user.id);
        const tfidf = new TfIdf();
        tfidf.addDocument(currentText);
        tfidf.addDocument(otherText);

        const vecA = {}, vecB = {};
        tfidf.listTerms(0).forEach(i => vecA[i.term] = i.tfidf);
        tfidf.listTerms(1).forEach(i => vecB[i.term] = i.tfidf);

        const score = cosineSimilarity(vecA, vecB);
        if (score > bestScore) {
            bestScore = score;
            bestUser = { ...user.dataValues, similarity: score };
        }
    }

    return bestUser;
}


export async function getRecommendationsFromSimilarUser(currentUserId, similarUserId, similarityWeight = 1.0) {
    const currentUserMovieIds = await MovieType.findAll({
        where: { user_id: currentUserId },
        attributes: ['movie_id']
    }).then(rows => rows.map(r => r.movie_id));

    const similarUserMovies = await MovieType.findAll({
        where: { user_id: similarUserId },
        include: [Movie]
    });

    const recommendations = [];

    for (const mt of similarUserMovies) {
        if (!currentUserMovieIds.includes(mt.movie_id)) {
            const movie = mt.Movie;
            if (!movie) continue;

            const text = [
                ...(movie.genre ? movie.genre.split(',') : []),
                movie.director,
                ...(movie.actor ? movie.actor.split(',') : [])
            ].join(" ");

            recommendations.push({
                id: movie.id,
                title: movie.title,
                text,
                score: similarityWeight
            });
        }
    }

    return recommendations;
}


export function getTfidfRecommendations(profileText, allMovies) {
    const tfidf = new TfIdf();
    tfidf.addDocument(profileText);
    const userVector = {};
    tfidf.listTerms(0).forEach(item => userVector[item.term] = item.tfidf);

    return allMovies.map((movie, idx) => {
        tfidf.addDocument(movie.text);
        const movieVector = {};
        tfidf.listTerms(idx + 1).forEach(item => movieVector[item.term] = item.tfidf);
        const score = cosineSimilarity(userVector, movieVector);
        return { id: movie.id, title: movie.title, score };
    });
}


export function combineRecommendations(tfidfRecs, socialRecs, weights = { tfidf: 0.7, social: 0.3 }) {
    const combined = new Map();

    for (const rec of tfidfRecs) {
        combined.set(rec.id, { title: rec.title, score: rec.score * weights.tfidf });
    }

    for (const rec of socialRecs) {
        const existing = combined.get(rec.id);
        if (existing) {
            existing.score += rec.score * weights.social;
        } else {
            combined.set(rec.id, { title: rec.title, score: rec.score * weights.social });
        }
    }

    return [...combined.entries()]
        .map(([id, val]) => ({ id, title: val.title, score: val.score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}


export async function recommendMoviesForUser(userId) {
    const profileText = await getUserProfileText(userId);

    const allMovies = await Movie.findAll();
    const movieCorpus = allMovies.map(movie => ({
        id: movie.id,
        title: movie.title,
        text: [movie.genre, movie.director, movie.actor].join(" ")
    }));

    const tfidfRecs = getTfidfRecommendations(profileText, movieCorpus);

    const similarUser = await findMostSimilarUser(userId);
    let socialRecs = [];
    if (similarUser) {
        socialRecs = await getRecommendationsFromSimilarUser(userId, similarUser.id, similarUser.similarity);
    }

    return combineRecommendations(tfidfRecs, socialRecs);
}
