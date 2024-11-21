const express = require('express');
const route = express.Router();
const {
    getRecipe, // Import all controller methods
    postRecipe,
    putRecipe,
    deleteRecipe,
    getRecipeById
} = require('../controllers/recipeController'); // Make sure the path is correct
const auth = require('../middleware/auth'); // JWT-based authentication middleware
const { body, validationResult } = require('express-validator'); // Import validation

// Middleware for logging requests
route.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// Middleware for validating input
const validateRecipeInput = [
    body('RecipeName').notEmpty().withMessage('Recipe Name is required'),
    // Add other validation rules as necessary
];

// Route for getting recipes based on optional filters (taste, occasion, category, course)
route.get('/', getRecipe); // Controller handles the filters and returns recipes

// Route for creating a new recipe
route.post('/', validateRecipeInput, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    postRecipe(req, res, next); // Call the original controller method
});

// Route for updating an existing recipe by ID (protected)
route.put('/:id', auth, validateRecipeInput, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    putRecipe(req, res, next); // Call the original controller method
});

// Route for deleting a recipe by ID (protected)
route.delete('/:id', auth, deleteRecipe); // Requires JWT authentication

// Route for getting a single recipe by ID
route.get('/:id', getRecipeById); // Route to get recipe by ID

// Optional: Route for searching recipes
route.get('/search', (req, res, next) => {
    const query = req.query.q; // Example: Query parameter for search
    // Implement your search logic or delegate to a controller
    // searchRecipeController(req, res, next);
    res.send(`Search functionality not implemented yet. Query: ${query}`);
});

// Error handling middleware
route.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = route;
