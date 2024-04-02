import express from "express";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";
import Session from 'express-session';

import cors from "cors";
import Datastore from "nedb";
import routes from './routes';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.use(Session({
  name: 'comdisbots-marketplace',
  secret: "comdisbots-chic-magn",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: true }
}));

app.get("/api", (req, res) => {
  res
    .status(200)
    .send({
      success: true,
      msg: "Hello Commune fam, this is a message from bot marketplace server.",
    });
});
app.use('/api', routes);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

module.exports = app