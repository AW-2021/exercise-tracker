const mongoose = require('mongoose');

const ExerciseSchema = mongoose.Schema(
    {
        _userid: {
            type: String,
            required: true,
        },

        username: {
            type: String,
            required: true,
        },

        date: {
            type: Date,
            default: Date.now
        },

        description: {
            type: String,
            required: true,
        },

        duration: {
            type: Number,
            required: true,
        },
    }
);

const Exercise = mongoose.model("Exercise", ExerciseSchema);
module.exports = Exercise;