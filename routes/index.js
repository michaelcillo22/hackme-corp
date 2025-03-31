import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import router from './router';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware config
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.use('/', router);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:5000`);
});
