import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    title: {
      type: String,
      unique: true,
    },
    rating: { type: Number },
  },
});

export default User;
