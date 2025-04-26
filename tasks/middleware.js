import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';    // Cross-platform file path utilities  // Security middleware for Express apps to protect against common vulnerabilities (xss)
import compression from 'compression';
import { engine } from 'express-handlebars';
import { users } from '../config/mongoCollections.js';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



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
    // Security headers
    app.use(compression());

    app.get('/', (req, res) => {
        const isAuthenticated = req.session && req.session.userId;
        const userName = req.session && req.session.userName;
        console.log('Root route accessed');
        res.render('home', {
            title: 'Home',
            isAuthenticated,
            userName,
        });
    });

    app.use('/auth', async (req, res, next) => {

        
        try {
            const timestamp = new Date().toUTCString();
            req.isAuthenticated = req.session && req.session.userId;
            req.userType = null;
    
            if (req.isAuthenticated) {
                if (!req.session.userType) {
                const usersCollection = await users();
                const user = await usersCollection.findOne({ _id: new ObjectId(req.session.userId) });
            
                req.session.userType = user ? user.userType : null;
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
    
        next();   
    
    } catch (error) {
        console.error('Error in middleware:', error);
        res.status(500).send('Internal Server Error');
    }     
    });
    



    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', path.join(path.resolve(), 'views'));
    app.get('/favicon.ico', (req, res) => res.status(204).end());

};