
const express = require('express');
const router = express.Router();
const {loggedin} = require('../verifyToken')

const crud = require('../controllers/crud');

//Fetch -- view
router.get("/view", loggedin, crud.fetch);
//Insert
router.post("/create", loggedin, crud.insert);
//update 
router.post("/:id/update", loggedin,crud.update);
//Delete using form
router.get("/:id/delete", loggedin, crud.delete);

module.exports = router;
