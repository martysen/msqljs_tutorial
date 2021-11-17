/**
 * Tutorial for establishing a mysql database server connection with backend server developed using express/nodejs
 *
 *  Documentation available at: https://github.com/mysqljs/mysql
 */

// Import Modules
const express = require("express");
const mysql = require("mysql");

// Create a database connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "testNodeMysqlDB", // comment out if running example 1
});

/**
 * If you are not able to connect to db and get an authentication error, Run the following two commands in muysql:
 * ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
 * flush privileges;
 * See top answer: https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
 * Alternatively install using npm mysql2 rather than mysql
 */

// Establish connection with the DB
db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Successful connected to the DB....`);
  }
});
// Create express app
const app = express();

/**
 * Example 1 -- Create a NEW database from the client-side <GOOD TO KNOW, don;t actually do this>
 * NOTE - to run this you cannot specify the database parameter in the connection config file
 */
app.get("/createDB", (req, res) => {
  let sql = "CREATE DATABASE testNodeMysqlDB";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.send("Created DAtabase");
    }
  });
});

/**
 * Example 2 -- Create a table in the a selected DB
 * NOTE -- Comment out Example 1 else you will get error.
 * NOTE -- Specify database name in the config file
 */
app.get("/createuserposttable", (req, res) => {
  let sql =
    "CREATE TABLE posts(id INT AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.send("table is created~~");
    }
  });
});

/**
 * Example 3  -- Insert data into the table
 * For the posts table we created in Example 2, we are going to insert some data into it
 */
app.get("/addpost1", (req, res) => {
  /**
   * creating a post value object. Note that id is handled by the DB and not specified by user.
   * In normal instance these values will received from the user through HTML forms
   * and the request object will be parsed to extract the value
   *  */
  let post = { title: "Post One", body: "My First Post" };

  /**
   * the ? symbol is acting as a placeholder for the data that will be passed to it.
   * IF you write the data here, you are hardcoding the SQL query and users cannot give input
   * Note that in a way we are still hardcoding here, however, with the entry point of user giving data
   */
  let sql = "INSERT INTO posts SET ?";

  /**
   * The second parameter of db.query() below is replacing the ? in the above sql statement
   */
  let query = db.query(sql, post, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.send("Post 1 has been added to posts table...");
    }
  });
});

/**
 * Add some more posts to the DB
 */
app.get("/addpost2", (req, res) => {
  let post = { title: "Post Two", body: "My Second Post" };
  let sql = "INSERT INTO posts SET ?";
  let query = db.query(sql, post, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.send("Post 2 has been added to posts table...");
    }
  });
});

/**
 * Example 4 - Read all data in a table from the database
 */
app.get("/getposts", (req, res) => {
  let sql = "SELECT * FROM posts";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.send(JSON.stringify(result)); // sends JSON data back to browser
    }
  });
});

/**
 * Example 5 - Read a specific data (or set of data) in a table from the database
 * NOTE - either by using the Primary Key or Secondary Key.
 */
app.get("/getposts/:id", (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.send(JSON.stringify(result)); // sends JSON data back to browser
    }
  });
});

/**
 * Example 6 - Update an Existing data entry in a table from the database
 */
app.get("/updatepost/:id", (req, res) => {
  let newTitle = "post title updated";
  let sql = `UPDATE posts SET title = ? WHERE id = ${req.params.id}`;
  let query = db.query(sql, newTitle, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.send(`Updated the requesting post...`);
    }
  });
});

/**
 * Example 7 - Delete an existing data entry in a table from the database
 */
app.get("/deletepost/:id", (req, res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      res.send(`The requested post has been deleted from the table ...`);
    }
  });
});

// establish server port
app.listen(3000, () => {
  console.log(`Server started on port no. 3000 .... `);
});
