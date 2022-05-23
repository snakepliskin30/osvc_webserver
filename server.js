const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const multer = require("multer");
const upload = multer();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const PORT = process.env.PORT || 5300;
let CONFIG_SETTINGS = [];

const addConfigSetting = (req, res, next) => {
  req.custom_config = CONFIG_SETTINGS;
  next();
};

app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware to handle form-data
app.use(upload.array());

app.use("/osvc", addConfigSetting, require("./routes/oicapi"));

app.all("*", (req, res) => {
  res.status(404);
  res.json({ error: "404 Not Found" });
});

app.listen(PORT, async () => {
  const username_password = `${process.env.OSVC_USERNAME}:${process.env.OSVC_PASSWORD}`;
  //   const encoded = btoa(username_password);
  const encoded = Buffer.from(username_password).toString("base64");
  const response = await fetch(
    "https://gpcservice--tst1.custhelp.com/services/rest/connect/v1.4/configurations?fields=name,value",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
        "OSvC-CREST-Application-Context": "config query",
      },
    }
  );
  if (response.ok) {
    const data = await response.json();
    CONFIG_SETTINGS = data.items.map((item) => {
      return { name: item.name, value: item.value };
    });
    // console.log(CONFIG_SETTINGS);
    console.log(`Server listening at port ${PORT}`);
  } else {
    console.log(`Problem during fetch. Server listening at port ${PORT}`);
  }
});
