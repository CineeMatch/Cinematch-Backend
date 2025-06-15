import User from '../models/user.js';
import Movie from '../models/movie.js';
import Category from '../models/category.js';
import MovieCategory from '../models/movieCategory.js';
import UserBadge from '../models/userBadge.js';
import Badge from '../models/badge.js';
import Friend from '../models/friend.js';
import CoMatchSuggestion from '../models/coMatchSuggestion.js';
import Conversation from '../models/conversation.js';
import Recommendation from '../models/recommendation.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';
import Like from '../models/like.js';
import CommentLike from '../models/commentLike.js';
import Notification from '../models/notification.js';
import NotificationType from '../models/notificationType.js';
import Challenge from '../models/challenge.js';
import ChallangeQuestion from '../models/challengeQuestion.js';
import MovieType from '../models/movieType.js';


export default function defineAssociations() {
  Movie.belongsTo(Category, { foreignKey: 'categoryId' });
  Category.hasMany(Movie, { foreignKey: 'categoryId' });

  // MovieCategories -> Movies, Categories
  Movie.belongsToMany(Category, {
    through: MovieCategory,
    foreignKey: 'movie_id',
    otherKey: 'category_id',
    as: 'categories',
  });
  Category.belongsToMany(Movie, {
    through: MovieCategory,
    foreignKey: 'category_id',
    otherKey: 'movie_id',
  });

  // userBadges -> Users, Badges
  User.hasMany(UserBadge, { foreignKey: 'user_id' });
  Badge.hasMany(UserBadge, { foreignKey: 'badge_id' });
  UserBadge.belongsTo(User, { foreignKey: 'user_id' });
  UserBadge.belongsTo(Badge, { foreignKey: 'badge_id' });

  // Friends -> Users (iki yönlü)
  User.hasMany(Friend, { foreignKey: 'user_id', as: 'friends' });
  User.hasMany(Friend, { foreignKey: 'friend_id', as: 'friendOf' });

  // CoMatchSuggestion -> Users
  User.hasMany(CoMatchSuggestion, { foreignKey: 'user_id' });
  User.hasMany(CoMatchSuggestion, { foreignKey: 'match_id' });

  // Conversations -> Users
  User.hasMany(Conversation, { foreignKey: 'sender_id', as: 'sentMessages' });
  User.hasMany(Conversation, { foreignKey: 'receiver_id', as: 'receivedMessages' });

  // Recommendation -> Users, Movies
  User.hasMany(Recommendation, { foreignKey: 'user_id' });
  Movie.hasMany(Recommendation, { foreignKey: 'movie_id' });

  // Posts -> Users, Movies
  User.hasMany(Post, { foreignKey: 'user_id' });
  Movie.hasMany(Post, { foreignKey: 'movie_id' });
  Post.belongsTo(User, { foreignKey: 'user_id' });
  Post.belongsTo(Movie, { foreignKey: 'movie_id' });

  // Comments -> Users, Posts
  User.hasMany(Comment, { foreignKey: 'user_id' });
  Post.hasMany(Comment, { foreignKey: 'post_id' });
  Comment.belongsTo(User, { foreignKey: 'user_id' });
  Comment.belongsTo(Post, { foreignKey: 'post_id' });

  // Likes -> Users, Posts
  User.hasMany(Like, { foreignKey: 'user_id' });
  Post.hasMany(Like, { foreignKey: 'post_id' });

  // commentLikes -> Users, Comments
  User.hasMany(CommentLike, { foreignKey: 'user_id' });
  Comment.hasMany(CommentLike, { foreignKey: 'comment_id' });

  // Notification -> Users, NotificationType
  User.hasMany(Notification, { foreignKey: 'sender_id', as: 'notificationsSent' });
  User.hasMany(Notification, { foreignKey: 'reciver_id', as: 'notificationsReceived' });
  NotificationType.hasMany(Notification, { foreignKey: 'type_id' });

  // Challenges -> Users, Movies
  Movie.hasMany(Challenge, { foreignKey: 'movie_id' });
  User.hasMany(Challenge, { foreignKey: 'creator_id', as: 'createdChallenges' });
  User.hasMany(Challenge, { foreignKey: 'opponent_id', as: 'opponentChallenges' });

  // ChallangeQuestion -> Challenges, Users
  Challenge.hasMany(ChallangeQuestion, { foreignKey: 'challenge_id' });
  User.hasMany(ChallangeQuestion, { foreignKey: 'created_by' });
  User.hasMany(ChallangeQuestion, { foreignKey: 'directed_to' });

  // MovieTypes.movie_id > MovieCategories.id (mantıksal olarak movie_id -> Movie.id olması gerek)
  Movie.hasMany(MovieType, { foreignKey: 'movie_id' });
  MovieType.belongsTo(Movie, { foreignKey: 'movie_id' });
  User.hasMany(MovieType, { foreignKey: 'user_id' });
  MovieType.belongsTo(User, { foreignKey: 'user_id' });

  // Friend.js
  Friend.belongsTo(User, { foreignKey: 'user_id', as: 'initiator' });
  Friend.belongsTo(User, { foreignKey: 'friend_id', as: 'receiver' });

  Movie.hasMany(MovieCategory, { foreignKey: 'movie_id' });
  MovieCategory.belongsTo(Category, { foreignKey: 'category_id' });
  MovieCategory.belongsTo(Movie, { foreignKey: 'movie_id' });

}