//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import express from "express";
const router = express.Router();

router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file

  try {

    // Render to home.handlebars
    res.render("home", {
      title: "Welcome to hackme.corp",
    })

  } catch (e) {

    // Return 404 for other URLs
    console.log(e.toString());
    return res.status(404).json({error: e.toString()});
  }

});

//export router
export default router;