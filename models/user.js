const {model, Schema} = require('./index');
const logger = require('../logger');
const Item = require('./item');

const itemSchema = Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    level: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 1
    },
    azia: {
        type: Number,
        default: 0
    },
    coins: {
        type: Number,
        default: 0
    },
    inventory: {
        type: [itemSchema]
    }
})

userSchema.statics.findById = function (id) {
    return this.findOne({id: id});
}

userSchema.statics.getPerks = async function (id) {
    let user = await this.findById(id);
    let perks = [];
    for (const item of user.inventory) {
        if (await Item.getCategory(item.id) === 'perk') {
            perks.push({id: item.id, name: item.name, quantity: item.quantity})
        }
    }
    return perks;
};

userSchema.statics.getBalance = async function (id) {
    let user = await User.findById(id);
    return user.coins;
}

userSchema.statics.checkInventory = async function (id, itemId) {
    let user = await this.findById(id);
    return user.inventory.find(o => o.id === itemId);
};

userSchema.methods.addItem = async function (name, id) {
    let obj = this.inventory.find(x => x.name === name);
    if (!obj) {
        this.inventory.push({
            name: name,
            id: id,
            quantity: 1
        });
    } else {
        let index = this.inventory.indexOf(obj);
        this.inventory[index] = {
            name: obj.name,
            id: obj.id,
            quantity: obj.quantity + 1
        };
    }
}

userSchema.methods.removeItem = async function (name) {
    let obj = this.inventory.find(x => x.name === name);
    if (obj.quantity === 1) {
        let index = this.inventory.indexOf(obj);
        this.inventory.splice(index, 1);
    } else {
        let index = this.inventory.indexOf(obj);
        this.inventory[index] = {
            name: obj.name,
            id: obj.id,
            quantity: obj.quantity - 1
        };
    }
}

userSchema.methods.findItem = async function (name) {
    return this.inventory.find(x => x.name === name)
}

userSchema.methods.addExperience = async function (xp) {
    this.xp += xp;
    let req_xp = 69 * (this.level + 1) * (1 + (this.level + 1));
    if (this.xp >= req_xp) {
        this.level += 1;
    }
}

const User = model('User', userSchema);

async function newUserInteraction (author) {
    await User.findOne({id: author.id}).then(async user => {
        if (user === null) {
            await User.create({name: author.username, id: author.id});
            return logger.warn('New User Created (first time talking in the presence of the bot)');
        }

        user.addExperience(1);
        user.save();
    });
}

module.exports = {User, newUserInteraction};