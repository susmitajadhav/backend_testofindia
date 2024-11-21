// controllers/recipeController.js
const Recipe = require('../models/recipe'); // Ensure the Recipe model is imported

// Helper function to create regex for matching exact phrases (e.g., "west indian") and ignore partial matches
const createExactRegex = (input) => {
    // If it's a multi-word phrase like "west indian", we want to treat it as a single exact match
    if (input.split(' ').length > 1) {
        return new RegExp('^' + input.trim().replace(/\s+/g, '\\s+') + '$', 'i');  // Match the exact phrase only, case-insensitive
    }
    // For single words, allow space/dash flexibility and handle singular/plural
    return new RegExp(input.trim().replace(/[-\s]/g, '[-\\s]*') + '(s)?', 'i');  // Case-insensitive match
};

// Function to add regex conditions to a query for a specific field (e.g., category, meals, course, cuisine)
const addFieldToQuery = (field, query, value) => {
    const keywords = value.split(',').map(item => item.trim());  // Split multiple values requested by frontend
    const regexList = keywords.map(item => createExactRegex(item));   // Convert each value into a regex

    // Add the regex list to the query for both lowercase and capitalized versions of the field
    query.$or = [
        ...(query.$or || []), // Keep existing $or conditions
        { [field]: { $in: regexList } },   // Field in lowercase (e.g., 'cuisine')
        { [field.charAt(0).toUpperCase() + field.slice(1)]: { $in: regexList } }  // Capitalized version (e.g., 'Cuisine')
    ];

    console.log(`${field} Regex: ${regexList}`);  // Debugging line to check the regex
};

// Get recipes with filters (taste, occasion, category, course, meals, cuisine)
exports.getRecipe = async (req, res) => {
    try {
        const { taste, occasion, category, course, meals, cuisine } = req.query; // Destructure query params from the request

        // Initialize an empty query object
        let query = {};

        // If the 'category' parameter is present in the request, add it to the query
        if (category) {
            addFieldToQuery('category', query, category); // Handle case-insensitive matching for 'category'
        }

        // If the 'meals' parameter is present, add it to the query
        if (meals) {
            addFieldToQuery('meals', query, meals); // Handle case-insensitive matching for 'meals'
        }

        // If the 'taste' parameter is present, add it to the query
        if (taste) {
            const tasteKeywords = taste.split(',').map(item => createExactRegex(item)); // Split taste into multiple values
            query.$or = [
                ...(query.$or || []),
                { taste: { $in: tasteKeywords } },  // Lowercase 'taste' field
                { Taste: { $in: tasteKeywords } }   // Capitalized 'Taste' field
            ];
            console.log(`Taste Regex: ${tasteKeywords}`);
        }

        // If the 'occasion' parameter is present, add it to the query
        if (occasion) {
            const occasionRegex = createExactRegex(occasion); // Create regex for occasion
            query.$or = [
                ...(query.$or || []),
                { occasion: occasionRegex },      // Lowercase 'occasion'
                { Occasion: occasionRegex }       // Capitalized 'Occasion'
            ];
            console.log(`Occasion Regex: ${occasionRegex}`);
        }

        // If the 'course' parameter is present, add it to the query
        if (course) {
            addFieldToQuery('course', query, course);  // Handle case-insensitive matching for 'course'
        }

        // If the 'cuisine' parameter is present, add it to the query
        if (cuisine) {
            const cuisineKeywords = cuisine.split(',').map(item => createExactRegex(item)); // Split cuisine into multiple values
            query.$or = [
                ...(query.$or || []),
                { cuisine: { $in: cuisineKeywords } },  // Lowercase 'cuisine' field
                { Cuisine: { $in: cuisineKeywords } }   // Capitalized 'Cuisine' field
            ];
            console.log(`Cuisine Regex: ${cuisineKeywords}`);
        }

        // Log the constructed query for debugging purposes
        console.log('Constructed query:', JSON.stringify(query, null, 2));

        // Use the constructed query to find matching recipes in the database
        const recipes = await Recipe.find(query);

        // If no recipes are found, return a message to the user
        if (recipes.length === 0) {
            return res.status(200).json({ errors: false, message: "No recipes found for the given filter." });
        }

        // If recipes are found, return them to the frontend
        return res.json({ errors: false, data: recipes });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error fetching recipes:', error);
        return res.status(400).json({ errors: true, message: error.message });
    }
};

// Create a new recipe
exports.postRecipe = async (req, res) => {
    try {
        const newRecipe = await Recipe.create(req.body); // Create a new recipe
        return res.status(201).json({ errors: false, data: newRecipe });
    } catch (error) {
        console.error('Error creating recipe:', error); // Log any error during recipe creation
        return res.status(400).json({ errors: true, message: "Failed to create recipe. Check the input data." });
    }
};

// Get a single recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipeId = req.params.id; // Get the recipe ID from params
        const recipe = await Recipe.findById(recipeId); // Find the recipe by ID
        
        if (!recipe) {
            return res.status(404).json({ errors: true, message: "Recipe not found." });
        }
        
        return res.json({ errors: false, data: recipe });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return res.status(400).json({ errors: true, message: error.message });
    }
};

// Update an existing recipe by ID 
exports.putRecipe = async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRecipe) {
            return res.status(404).json({ errors: true, message: "Recipe not found." });
        }
        return res.json({ errors: false, data: updatedRecipe });
    } catch (error) {
        console.error('Error updating recipe:', error); // Log any error during recipe update
        return res.status(400).json({ errors: true, message: "Failed to update recipe. Check the input data." });
    }
};

// Delete a recipe by ID
exports.deleteRecipe = async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) {
            return res.status(404).json({ errors: true, message: "Recipe not found." });
        }
        return res.json({ errors: false, message: "Recipe successfully deleted." });
    } catch (error) {
        console.error('Error deleting recipe:', error); // Log any error during recipe deletion
        return res.status(400).json({ errors: true, message: "Failed to delete recipe. Try again later." });
    }
};
