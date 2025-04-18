import express from 'express';
import usersData from '../data/users.js';

import helpers from '../helpers/RDUsershelpers.js';

const router = express.Router();

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    console.log(req.body);
    try {
      res.status(200).render('usersRegister');
    } catch (e) {
      console.error(e);
      res.status(500).send('Error loading registration page');
    }

  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req.body);
    const { 
      
      userNameInput: userName,
      emailAddressInput: userID,
      passwordInput: password,
      roleInput: userType

     } = req.body;

    if (!userName || !userID || !password || !userType) {
      return res
        .status(400)
        .json({ error: 'All fields are required' });
    }

    const usersCollection = await usersData.getAllUsers();
    const existingUser = usersCollection.find((user) => user.userID === userID);
        if (existingUser) {
             return res.status(409).json({ error: 'User with this email already exists' });
            }


    try {
      const newUser = await createUser(userID, userName, password, userType);
      res.redirect('/auth/login');
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    console.log('GET /login route triggered');
    try {
      res.status(200).render('usersLogin');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error loading login page');
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const { emailAddressInput: userID, passwordInput: password } = req.body;

    if (!userID || !password) {
      return res.status(400).json({ error: 'Email address and password are required' });
    }

    try {
      
      const user = await loginUser(userID, password);
      console.log('User authenticated:', user);

      req.session.userId = user._id;
      req.session.userID = user.userID;
      req.session.userName = user.userName;
      req.session.userType = user.userType;
      res.redirect('/');
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'An error occurred.  Unable to log in.' });
    }
  });

  router.route('/logout').get(async (req, res) => {
    //code here for GET
    try {
      if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).send('Error logging out');
        }
        console.log('user logout successful');
  
        res.status(200).render('logout');
      });
    } else {
      res.redirect('/login');
    }
    } catch (e) {
      console.error(e);
      res.status(500).send('Error processing logout');
    }
  });

  router.get('/home', (req, res) => {
    res.render('home'); 
});



  export default router;