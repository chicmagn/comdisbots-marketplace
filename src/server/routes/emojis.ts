import express from 'express';
const emojis = express.Router();
import Datastore from "nedb";

const emojiDB = new Datastore({ filename: "db/emojis.db", autoload: true });


emojiDB.loadDatabase();
export default emojis;