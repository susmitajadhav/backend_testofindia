//app.js
// Load environment variables from .env file
require('dotenv').config(); 

// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Import route files
const recipeRoute = require('./routes/recipeRoute'); // Routes for handling recipes
const authRoute = require('./routes/authRoute'); // Routes for authentication (signup/login)
const Recipe = require('./models/recipe');


// Initialize the express app
const app = express();

// Middleware to parse JSON and handle CORS
app.use(express.json()); // Allows express to parse JSON request bodies
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS) for all routes

// Default route (homepage)
app.get('/', (req, res) => {
    res.send("Welcome to the Recipe API");
});

// Search endpoint
// Search endpoint
app.get('/api/recipe/search', (req, res) => {
    const query = req.query.query; // Extract the search query from request

    // Check if the query exists
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Create a flexible regex to match ignoring spaces, dashes, case, and singular/plural
    const createFlexibleRegex = (input) => {
        return new RegExp(
            input.trim().replace(/[-\s]/g, '[-\\s]*') + '(s)?$', // Match spaces or dashes, and singular/plural
            'i' // Case-insensitive matching
        );
    };

    // Create the regex for the search term
    const searchRegex = createFlexibleRegex(query);

    // Log the regex to debug if needed
    console.log('Search Regex:', searchRegex);

    // Use the Recipe model to find matching recipes
    Recipe.find({ RecipeName: { $regex: searchRegex } }) // Ensure this field matches your schema
        .then(recipes => {
            if (recipes.length === 0) {
                return res.status(200).json({ message: 'No recipes found matching the search criteria.' });
            }
            return res.json({ success: true, data: recipes }); // Include a success flag
        })
        .catch(error => {
            console.error('Error fetching recipes:', error); // Log the error for debugging
            return res.status(500).json({ error: 'Error fetching recipes', details: error.message }); // Include error details
        });
});



// Register API routes
app.use('/api/recipe', recipeRoute); // Routes related to recipes
app.use('/api/auth', authRoute); // Routes related to authentication (signup/login)

// Set the server port, defaulting to 5000 if not specified in environment variables
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// MongoDB Connection Function
async function mongoConnection() {
    try {
        // Connect to MongoDB using credentials from the environment variables
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process if MongoDB connection fails
    }
}

// Connect to the MongoDB database
mongoConnection();
