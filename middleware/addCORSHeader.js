const allowedOrigins = require("../config/allowedOrigins");

const addCORSHeader = (req, res, next) => {
  if (allowedOrigins.includes(req.header.origin)) {
    res.header();
  }
};
