var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
const users_data_path = path.join(__dirname, "./../model/users.json");
let user_id = 0;

/* GET users listing. */
router.get("/", function(req, res, next) {
  fs.readFile(users_data_path, (err, data) => {
    if (err) return console.log("Error occured: " + err);
    let existingUsers = JSON.parse(data);
    res.render("users-list", { users: existingUsers });
  });
});

router.get("/edit/:id", function(req, res, next) {
  if (req.params.id) {
    fs.readFile(users_data_path, (err, data) => {
      if (err) console.log(err);
      let users = JSON.parse(data);
      let user = users.find(u => {
        return u.id == req.params.id;
      });
      if (user) {
        res.render("edit-user", { user: user, errorCode: null });
      } else {
        res.render("edit-user", { user: null, errorCode: 404 });
      }
    });
  } else res.send("invalid url");
});

router.post("/edit/:id", function(req, res, next) {
  if (req.params.id) {
    fs.readFile(users_data_path, (err, data) => {
      if (err) console.log(err);

      let existingUsers = JSON.parse(data);
      console.log("existint user: " + existingUsers);
      let updatedUsers = existingUsers.map(user => {
        if (user.id == req.params.id) {
          user = req.body;
        }
        return user;
      });

      fs.writeFile(
        users_data_path,
        JSON.stringify(updatedUsers),
        (err, result) => {
          res.redirect("/users");
        }
      );
    });
  } else {
    res.send("Invalid Url");
  }
});

router.get("/delete/:id", (req, res, next) => {
  if (req.params.id) {
    fs.readFile(users_data_path, (err, data) => {
      if (err) console.log(err);
      let existingUsers = JSON.parse(data);
      let updatedUsers = existingUsers.filter(user => user.id != req.params.id);

      fs.writeFile(
        users_data_path,
        JSON.stringify(updatedUsers),
        (err, result) => {
          if (err) console.log(err);
          res.redirect("/users");
        }
      );
    });
  } else {
    console.log("invalid url");
  }
});

router.get("/create", function(req, res, next) {
  res.render("create-user");
});

router.post("/create", function(req, res, next) {
  fs.readFile(users_data_path, (err, data) => {
    if (err) return console.log("Error occured: " + err);
    let existingUsers = JSON.parse(data);
    req.body.id = existingUsers.length + 1;
    existingUsers.push(req.body);
    fs.writeFile(
      users_data_path,
      JSON.stringify(existingUsers),
      (err, result) => {
        if (err) return console.log(err);
        console.log("new user is added to the file");
        res.redirect("/users");
      }
    );
  });
});

module.exports = router;
