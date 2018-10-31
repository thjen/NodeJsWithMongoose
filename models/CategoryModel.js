var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
});

CategorySchema.path("name").set((input) => {
    return input[0].toUpperCase() + input.slice(1);
});

module.exports = mongoose.model("Category", CategorySchema);