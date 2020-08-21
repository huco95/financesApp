const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moveSchema = new Schema (
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, required: true},
        amount: { type: Number, required: true  },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true  },
        description: { type: String },
        date: { type: Date, required: true  }
    },
    {
        timestamps: true
    }
);

let Move = mongoose.model("Move", moveSchema);
module.exports = Move;