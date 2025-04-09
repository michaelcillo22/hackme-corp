import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';    // Cross-platform file path utilities
import helmet from 'helmet';    // Security middleware for Express apps to protect against common vulnerabilities (xss)
import compression from 'compression';
import { engine } from 'express-handlebars';


export default (app) => {

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
app.use(express.static(path.join(path.resolve(), 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(path.resolve(), 'views'));

};