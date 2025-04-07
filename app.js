//Here is where you'll set up your server as shown in lecture code
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import path from 'path';
import {fileURLToPath} from 'url';

// Obtain the correct path automatically
const fileName = fileURLToPath(import.meta.url);
const directoryName = path.dirname(fileName);

// Set the views directory to the correct folder
app.set('views', path.join(directoryName, 'views'));

// Utilized from lecture 8
const rewriteUnsupportedBrowserMethods = (req, res, next) => {

  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // Let the next middleware run
  next();
};

// Ensure our folders are in tact
app.use('/public', express.static(path.join(directoryName, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'productMain'}));
app.set('view engine', 'handlebars');

configRoutes(app);

// Run server
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000/products');
});