//models/recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    recipeName: { type: String, required: true },
    images: { type: String },
    process: { type: String, required: true },
    totalCookTime: { type: String },
    prepTime: { type: String },
    cookTime: { type: String },
    settingTime: { type: String },
    soakingTime: { type: String },
    restingTime: { type: String },
    serves: { type: String },
    taste: { type: String }, // Ensure capitalization matches your query
    Color: { type: String },
    course: { type: String },
    meals: { type: String },
    difficulties: { type: Number },
    state: { type: String },
    videoLink: { type: String },
    sugarOrSugarfree: { type: String },
    cookingType: { type: String },
    cuisine: { type: String },
    Occasion: { type: String }, // Ensure capitalization matches your query
    drinks: { type: String },
    category: { type: String }, // This is the new category field
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
