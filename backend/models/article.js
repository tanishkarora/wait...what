    const mongoose = require('mongoose');

    // Define the article schema
    const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 400, // Restrict the length of title
    },
    date: {
        type: Date,
        required: true,
    },
    snippet: {
        type: String,
        required: true,
        maxlength: 500, // Limit the length of snippet
    },
    significance: {
        type: Number,
        required: true,
        enum: [1, 2, 3], // Limit values to 1, 2, or 3
    },
    thumbnail: {
        type: String,
        default: null, // Default to null if no image URL is provided
    },
    theme: {
        type: String,
        default: null, // Set the default value of theme to null
    },
    });

    // Create a model based on the schema
    const Article = mongoose.model('Article', articleSchema);

    module.exports = Article;