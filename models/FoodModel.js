var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FoodSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    foodDescription: {
        type: String,
        default: ""
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ["Available", "Unavailable"],
        }],
        default: ["Available"],
    },
    categoryId: Schema.ObjectId,
    imageUrl: {
        type: String,
    },
});

//seter
FoodSchema.path("name").set((input) => {
    /**TODO: something before add to database**/
    return input[0].toUpperCase() + input.slice(1);
});

module.exports = mongoose.model("Food", FoodSchema);