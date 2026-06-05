import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    email: {
      type: String,
      unique: true,
    },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    likedMovies: {
      type: 'simple-json',
      nullable: true,
    },
    dislikedMovies: {
      type: 'simple-json',
      nullable: true,
    },
    watchlist: {
      type: 'simple-json',
      nullable: true,
    },
    isDeveloper: {
      type: Boolean,
      default: false,
    },
  },
});

export default User;
