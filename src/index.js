// src/index.js
const express = require('express');
const session = require('express-session');
const authRouter = require('./routes/auth');
const alumniRouter=require('./routes/alumni')
const eventRouter=require('./routes/event');
const feedbackRouter = require('./routes/feedback');
const surveyRouter=require('./routes/survey')


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://stammssalumni.netlify.app/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));
// Authentication Middleware
const authMiddleware = (req, res, next) => {
    // Check if user is authenticated
    if (req.session.user) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ message: "Unauthorized" }); // User is not authenticated, return unauthorized status
    }
};
// Routes
app.use('/auth', authRouter);
app.use('/alumni',  alumniRouter); 
app.use('/events',  eventRouter); 
app.use('/feedback',feedbackRouter);
app.use('/surveys',surveyRouter)


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
