var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/login_lab");

module.exports.User = require("./user");
