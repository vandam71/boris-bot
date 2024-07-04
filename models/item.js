const {model, Schema} = require('./index');
const logger = require('../logger');

const itemSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    emote: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

itemSchema.statics.findById = function (id) {
    return this.findOne({id: id});
};

itemSchema.statics.findByName = function (name) {
    return this.findOne({name: name});
}

itemSchema.statics.getItemString = async function (id, quantity) {
    let item = await this.findById(id);
    return quantity + ' <' + item.emote + '> ' + item.name + '\n';
};

itemSchema.statics.getCategory = async function (id) {
    let item = await this.findById(id);
    return item.category;
}

const Item = model('Item', itemSchema);

module.exports = Item;