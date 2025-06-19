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
import Platform from '../models/platform.js';
import MoviePlatform from '../models/moviePlatform.js';

export default function defineAssociations() {
  // Movie <-> Category (mainCategory)
  Movie.belongsTo(Category, {
    as: 'mainCategory',
    foreignKey: 'categoryId'
  });
  Category.hasMany(Movie, {
    as: 'movies',
    foreignKey: 'categoryId'
  });

  // Movie <-> Category (many-to-many)
  Movie.belongsToMany(Category, {
    through: MovieCategory,
    as: 'categories',
    foreignKey: 'movie_id',
    otherKey: 'category_id',
  });
  Category.belongsToMany(Movie, {
    through: MovieCategory,
    as: 'moviesWithRelation',
    foreignKey: 'category_id',
    otherKey: 'movie_id',
  });

  // MovieCategory birebir ilişkiler (A'dan gelen)
  Movie.hasMany(MovieCategory, { foreignKey: 'movie_id' });
  MovieCategory.belongsTo(Category, { foreignKey: 'category_id' });
  MovieCategory.belongsTo(Movie, { foreignKey: 'movie_id' });

  // Movie <-> Platform (mainPlatform)
  Movie.belongsTo(Platform, {
    as: 'mainPlatform',
    foreignKey: 'platformId'
  });
  Platform.hasMany(Movie, {
    as: 'movies',
    foreignKey: 'platformId'
  });

  // Movie <-> Platform (many-to-many)
  Movie.belongsToMany(Platform, {
    through: MoviePlatform,
    as: 'platforms',
    foreignKey: 'movie_id',
    otherKey: 'platform_id',
  });
  Platform.belongsToMany(Movie, {
    through: MoviePlatform,
    as: 'moviesWithRelation',
    foreignKey: 'platform_id',
    otherKey: 'movie_id',
  });

  // UserBadge <-> User, Badge
  User.hasMany(UserBadge, { foreignKey: 'user_id' });
  Badge.hasMany(UserBadge, { foreignKey: 'badge_id' });
  UserBadge.belongsTo(User, { foreignKey: 'user_id' });
  UserBadge.belongsTo(Badge, { foreignKey: 'badge_id' });

  // Friend -> User (iki yönlü)
  User.hasMany(Friend, { foreignKey: 'user_id', as: 'friends' });
  User.hasMany(Friend, { foreignKey: 'friend_id', as: 'friendOf' });
  Friend.belongsTo(User, { foreignKey: 'user_id', as: 'initiator' });
  Friend.belongsTo(User, { foreignKey: 'friend_id', as: 'receiver' });

  // CoMatchSuggestion -> User
  User.hasMany(CoMatchSuggestion, { foreignKey: 'user_id' });
  User.hasMany(CoMatchSuggestion, { foreignKey: 'match_id' });

  // Conversation -> User
  User.hasMany(Conversation, { foreignKey: 'sender_id', as: 'sentMessages' });
  User.hasMany(Conversation, { foreignKey: 'receiver_id', as: 'receivedMessages' });

  // Recommendation -> User, Movie
  User.hasMany(Recommendation, { foreignKey: 'user_id' });
  Movie.hasMany(Recommendation, { foreignKey: 'movie_id' });

  // Post -> User, Movie
  User.hasMany(Post, { foreignKey: 'user_id' });
  Movie.hasMany(Post, { foreignKey: 'movie_id' });
  Post.belongsTo(User, { foreignKey: 'user_id' });
  Post.belongsTo(Movie, { foreignKey: 'movie_id' });

  // Comment -> User, Post
  User.hasMany(Comment, { foreignKey: 'user_id' });
  Post.hasMany(Comment, { foreignKey: 'post_id' });
  Comment.belongsTo(User, { foreignKey: 'user_id' });
  Comment.belongsTo(Post, { foreignKey: 'post_id' });

  // Like -> User, Post
  User.hasMany(Like, { foreignKey: 'user_id' });
  Post.hasMany(Like, { foreignKey: 'post_id' });

  // CommentLike -> User, Comment
  User.hasMany(CommentLike, { foreignKey: 'user_id' });
  Comment.hasMany(CommentLike, { foreignKey: 'comment_id' });

  // Notification -> User, NotificationType
User.hasMany(Notification, { foreignKey: 'sender_id', as: 'notificationsSent' });
User.hasMany(Notification, { foreignKey: 'reciver_id', as: 'notificationsReceived' });
Notification.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Notification.belongsTo(User, { foreignKey: 'reciver_id', as: 'receiver' });
Notification.belongsTo(NotificationType, {
  foreignKey: 'type_id',
  as: 'type' 
});

  // Challenge -> User, Movie
  Movie.hasMany(Challenge, { foreignKey: 'movie_id' });
  Challenge.belongsTo(Movie, { foreignKey: 'movie_id', as: 'movie' });

  User.hasMany(Challenge, { foreignKey: 'creator_id', as: 'createdChallenges' });
  User.hasMany(Challenge, { foreignKey: 'opponent_id', as: 'opponentChallenges' });
  Challenge.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });
  Challenge.belongsTo(User, { foreignKey: 'opponent_id', as: 'opponent' });

  // ChallangeQuestion -> Challenge, User
  Challenge.hasMany(ChallangeQuestion, { foreignKey: 'challange_id' }); // Not: modeldeki alan "challange_id" ise doğru
  User.hasMany(ChallangeQuestion, { foreignKey: 'created_by' });
  User.hasMany(ChallangeQuestion, { foreignKey: 'directed_to' });

  // MovieType -> Movie, User
  Movie.hasMany(MovieType, { foreignKey: 'movie_id' });
  MovieType.belongsTo(Movie, { foreignKey: 'movie_id' });
  User.hasMany(MovieType, { foreignKey: 'user_id' });
  MovieType.belongsTo(User, { foreignKey: 'user_id' });
}
