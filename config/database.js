const mongoose = require('mongoose');


const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/tutorials'

module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database Connected');

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}