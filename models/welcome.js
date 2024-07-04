const {model, Schema} = require('./index');
const logger = require('../logger');

const welcomeSchema = new Schema({
    Guild: String,
    Channel: String,
    Message: String,
    Reaction: String
})

const Welcome = model('Welcome', welcomeSchema);

module.exports = {Welcome};