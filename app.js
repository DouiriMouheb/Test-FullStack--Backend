const express = require("express");


const mysql = require("mysql");
const cors = require('cors');
const request = require("request");


const app = express();
const port = 3000;

app.use(cors({origin: 'http://localhost:3001'}));



//connexion à la base de données MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testFullStack",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

///////////////////////////////////////////

app.get("/add-data", (req, res) => {
  request("https://dummyjson.com/todos", (error, res, body) => {
    if (error) throw error;
    const data = JSON.parse(body);
    const todos = Array.from(JSON.parse(JSON.stringify(data.todos)));
    for (var item in todos) {
      db.query(
        "INSERT INTO todos(id,todo,completed,userId) VALUES (?,?,?,?)",
        [
          todos[item].id,
          todos[item].todo,
          todos[item].completed,
          todos[item].userId,
        ],
        (err, result) => {
          if (err) throw err;
          console.log("Data added to MySQL");
        }
      );
    }
  });
});

//////////////////////////////////////////////////

app.get("/display-data", (req, res) => {
  db.query("SELECT * FROM todos", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => 
  console.log(`Server listening at http://localhost:${port}`)
);
