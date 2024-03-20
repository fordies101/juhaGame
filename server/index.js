const express = require('express');
const cors = require("cors");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { importPKCS8 } = require('jose');
const app = express();
app.use(express.json());
//import {v4 as uuidv4} from "uuid";
const sqlite3 = require('sqlite3').verbose();

var userId = 0;
const DB_LOCATION = "juhaDB2.sqlite"
var db = new sqlite3.Database(DB_LOCATION, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});


app.use(cors({
  origin:"http://localhost:3000",
  methods:["GET" , "POST"]
}
));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const verify = (req, res, next) => {
  const accessToken = req.body.accessToken;
  if(accessToken)
  {
    jwt.verify(accessToken , "mySecretKey" , (err,user) =>
    {
      if(err)
      {
        console.log("invalid token!")

        return res.status(403).json("invalid token!")
      }
      req.user = user;
      next();
    })
  }
  else{
    res.status(401).json("not authenticated!")
  }
}

app.post('/api/login', async (req, res)  => {
    const input = req.body.userName;
    userId++;

    console.log(userId);
    console.log(input);

    const accessToken = jwt.sign({id: userId , user:input} , "mySecretKey");
    db.run(`INSERT INTO players(id , name) VALUES(? , ?)`, [userId ,  input], function(err) {
      if (err) {
        res.status(403).json(err.message)
        return console.log(err.message);
      }
      // get the last insert id
      res.json({"id":parseInt(userId) , "user": input , accessToken})
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
});

//add middleware to check token
app.post('/api/create-lobby' , verify , async (req, res)  => {
  let players = req.body.players;
  let user = req.user;
  console.log(user)
  console.log(players);
  var ID = nanoid();

  db.run(`INSERT INTO games(gameId , players) VALUES(? , ?)`, [ID , players], function(err) {
    if (err) {
      res.status(403).json(err.message)

      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });


  db.run(`UPDATE players SET gameId = ? WHERE id = ?`, [ID , user.id], function(err) {
    if (err) {
      res.status(403).json(err.message)

      return console.log(err.message);
    }
    // get the last insert id
    res.json({"lobbyId":ID})

    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
});


app.get('/api/get-game-players' , verify , async (req, res)  => {
  

});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});