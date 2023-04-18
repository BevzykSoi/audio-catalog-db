const mongoose = require('mongoose');
mongoose.set('strictPopulate', false);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected successfully!'))
  .catch((error) => console.log(error));