import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';    // Cross-platform file path utilities
import helmet from 'helmet';    // Security middleware for Express apps to protect against common vulnerabilities (xss)
import compression from 'compression'; 
import { MongoClient } from 'mongodb';
import router from './router';  

// Initialize app with express
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB configuration
const MONGO_URI = 'mongodb://localhost:27017'; 
const DB_NAME = 'CS546_FinalProject_Group2_Hackmazon'; 

// DB connection
const client = new MongoClient(MONGO_URI);

(async () => {
  try {
    await client.connect(); 
    console.log('Connected to MongoDB!');
    
    const db = client.db(DB_NAME);
    app.locals.db = db; 
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); 
  }
})();

// Middleware Configuration
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(session({
  secret: 'your-session-secret', // need to replace with our secret session
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(helmet()); // Security headers
app.use(compression()); // Response compression
app.use(express.static(path.join(path.resolve(), 'public'))); // Serve static files

// Template engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));

// Use Routes
app.use('/', router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000`);
});
