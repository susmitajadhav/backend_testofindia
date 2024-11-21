const mongoose = require('mongoose');

// Check if the model is already defined
const searchRecipeModel = mongoose.models.SearchRecipe || mongoose.model('SearchRecipe', new mongoose.Schema({
    RecipeName: { type: String, required: true },
    // Include all other fields as necessary
    Images: { type: String },
    Process: { type: String },
    TotalCookTime: { type: String },
    PrepTime: { type: String },
    CookTime: { type: String },
    SettingTime: { type: String },
    SoakingTime: { type: String },
    RestingTime: { type: String },
    Serves: { type: String },
    Taste: { type: String },
    Color: { type: String },
    Course: { type: [String] }, // Assuming multiple courses
    Meals: { type: String },
    Difficulties: { type: Number },
    State: { type: String },
    VideoLink: { type: String },
    CookingType: { type: String },
    Cuisine: { type: String },
    Occasion: { type: String },
    Drinks: { type: String },
    SugarSugarFree: { type: String },
    Ingredients: { type: String },
    Category: { type: String },
}));

// Export the model
module.exports = searchRecipeModel;
