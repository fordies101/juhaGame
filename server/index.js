const express = require('express');
const cors = require("cors");
const axios = require('axios');
const app = express()
//import {v4 as uuidv4} from "uuid";
//const sqlite3 = require('sqlite3').verbose();

var userId = 0;

app.use(cors({
  origin:"http://localhost:3000",
  methods:["GET" , "POST"]
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//const DB_LOCATION = "C:\\Users\\fordi\\OneDrive\\Desktop\\mgashimim\\Refael Work\\NodeJs-Project\\backend\\attacksDB.sqlite"

app.post('/api/login', async (req, res)  => {
    const context = {};
    const input = req.body.user;
    userId++;
    //const userId = uuidv4();
    console.log(input);
    console.log(parseInt(userId));
    res.json({"user": input , "id":parseInt(userId)})
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});