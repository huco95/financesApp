const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        name: { type: String },
        description: { type: String },
        type: { type: String, enum: ['income', 'expense']},
        color: { type: String },
        icon: { type: String },
    },
    {
        timestamps: true
    }
);

categorySchema.index({ name: 1, type: 1}, { unique: true });

let Category = mongoose.model("Category", categorySchema);
module.exports = Category;