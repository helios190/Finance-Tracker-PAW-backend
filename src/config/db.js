const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://bintangrestub:wyqIZszUNVYfWrkL@paw.dufoq.mongodb.net/finance-tracker?retryWrites=true&w=majority&appName=PAW', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
