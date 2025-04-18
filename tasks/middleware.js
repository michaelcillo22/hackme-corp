import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';    // Cross-platform file path utilities
import helmet from 'helmet';    // Security middleware for Express apps to protect against common vulnerabilities (xss)
import compression from 'compression';
import { engine } from 'express-handlebars';
import { users } from '../config/mongoCollections.js';


export default (app) => {
    
    app.use(express.static(path.join(path.resolve(), 'public')));
    app.use(session({
        name: 'AuthState',  
        secret: 'your-session-secret', // need to replace with our secret session
        resave: false,
        saveUninitialized: false,
      }));
    app.use(flash());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet()); // Security headers
    app.use(compression());

    app.use('/', async (req, res, next) => {

        if (req.originalUrl.startsWith('/public')) {
            return next();
        }
        try {
            const timestamp = new Date().toUTCString();
            req.isAuthenticated = req.session && req.session.userId;
            req.userType = null;
    
            if (req.isAuthenticated) {
                if (!req.session.userType) {
                const usersCollection = await users();
                const user = await usersCollection.findOne({ _id: new ObjectId(req.session.userId) });
            
                req.session.userType = user ? user.userType : null;
                } else {
                    req.userType = null;
                }
                
            }
        
        console.log(`Current Timestamp: ${timestamp}, Request Method: ${req.method}, Request Route: ${req.originalUrl}`);
        if (req.isAuthenticated) {
            console.log('User is authenticated');
        } else {
            console.log('User has not been authenticated');
        }
    
        res.locals.isAuthenticated = req.isAuthenticated;
        res.locals.userType = req.userType;

        if (req.isAuthenticated && req.originalUrl === 'auth/login') {
            console.log('Authenticated user trying to access login, redirected to home');
            return res.redirect('auth/home');
        }
    
        else if (req.isAuthenticated && !['auth/logout', 'auth/error', 'auth/login', 'auth/register']) {
            console.log('Redirecting authenticated user to home');
            return res.redirect('/home');
        }  
    
        next();   
    
    } catch (error) {
        console.error('Error in middleware:', error);
        res.status(500).send('Internal Server Error');
    }     
    });

     
 


 // Response compression


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(path.resolve(), 'views'));
app.get('/favicon.ico', (req, res) => res.status(204).end());

};