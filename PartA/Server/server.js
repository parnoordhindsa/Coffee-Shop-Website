"use strict";

// load package
const http = require("http");
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE DATABASE IF NOT EXISTS partA";
  con.query(sql, (err) => {
    if (err) throw err;
    console.log("Database created");
  });
  var sql = "USE partA";
  con.query(sql, (err) => {
    if (err) throw err;
    console.log("Database selected");
  });

  var sql =
    "CREATE TABLE IF NOT EXISTS menu (menuID INT NOT NULL AUTO_INCREMENT, item VARCHAR(50) NOT NULL, price FLOAT NOT NULL, PRIMARY KEY(menuID) )";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table Menu Created");
  });

  var sql =
    "CREATE TABLE IF NOT EXISTS orders (orderID INT NOT NULL AUTO_INCREMENT, totalPrice FLOAT NOT NULL, isCompleted BOOLEAN NOT NULL, orderDetail VARCHAR(50) NOT NULL, timestamp DATETIME NOT NULL, PRIMARY KEY (orderID))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table Orders Created");
  });
});

app.get("/Menu", (req, res) => {
  var sql = "SELECT * FROM menu";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/addItemToMenu", (req, res) => {
  var sql = "INSERT INTO menu(item, price) VALUES ?";
  var values = [[req.body.item, req.body.price]];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    res.send("ok");
  });
});

app.post("/addOrder", (req, res) => {
  var timestamp = new Date();
  var sql =
    "INSERT INTO orders (totalPrice, isCompleted, orderDetail, timestamp) VALUES ?";

  var values = [
    [req.body.total, req.body.isCompleted, req.body.detail, timestamp],
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    res.send(result.insertId + "");
  });
});

app.get("/selectOrders", (req, res) => {
  var sql = "SELECT * FROM orders ORDER BY timestamp ASC";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/upcomingOrders", (req, res) => {
  var sql = "SELECT * FROM orders WHERE isCompleted = 0 ORDER BY timestamp ASC";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.put("/completedOrders/:id", (req, res) => {
  var sql = "UPDATE orders SET isCompleted=1 WHERE orderID = ?";
  var values = [req.params.id];
  con.query(sql, values, function (err) {
    if (err) throw err;
    res.send("updated");
  });
});

app.get("/orderStatus/:id", (req, res) => {
  var id = req.params.id;
  var sql = "SELECT isCompleted from orders WHERE orderID=?";
  con.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/cancelOrder/:id", (req, res) => {
  var id = req.params.id;
  var sql = "DELETE FROM orders WHERE orderID=?";
  con.query(sql, [id], (err, result) => {
    if (err) throw err;

    res.send(result.affectedRows + "");
  });
});

app.put("/changeItemPrice/:id/:price", (req, res) => {
  var sql = "UPDATE menu SET price=? WHERE menuID = ?";
  var values = [req.params.price, req.params.id];
  con.query(sql, values, function (err) {
    if (err) throw err;
    res.send("updated");
  });
});

app.post("/removeItemFromMenu/:id", (req, res) => {
  var id = req.params.id;
  var sql = "DELETE FROM menu WHERE menuID=?";
  con.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result.affectedRows + "");
  });
});

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server Started");
});
