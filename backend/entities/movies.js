import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    tmdbId: {
      // <-- Corrigé ici (fini le "tmormId")
      type: Number,
      unique: true,
      nullable: true,
    },
    title: {
      type: String,
      unique: true,
    },
    rating: {
      type: Number,
      nullable: true,
    },
    isLiked: {
      type: Boolean,
      default: true,
    },
  },
});

export default Movie;
