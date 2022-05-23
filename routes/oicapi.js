const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.post("/", async (req, res, next) => {
  const oicUsername = req.custom_config.find(
    (cfg) => cfg.name === "CUSTOM_CFG_FCC_API_USER"
  ).value;
  const oicPassword = req.custom_config.find(
    (cfg) => cfg.name === "CUSTOM_CFG_FCC_API_PASSWORD"
  ).value;
  const oicEndpoint = req.custom_config.find(
    (cfg) => cfg.name === req.body.apiUrl
  ).value;
  const username_password = `${oicUsername}:${oicPassword}`;
  const encoded = Buffer.from(username_password).toString("base64");
  const authorization = `Basic ${encoded}`;

  console.log(
    oicUsername,
    oicPassword,
    username_password,
    encoded,
    authorization,
    oicEndpoint
  );
  const response = await fetch(oicEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: req.body.data,
  });

  const data = await response.json();
  console.log(data);

  res.json(data);
});

module.exports = router;
