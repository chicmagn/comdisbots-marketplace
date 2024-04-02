import express from 'express';
const servers = express.Router();
import Datastore from "nedb";
const serverDB = new Datastore({ filename: "db/servers.db", autoload: true });
serverDB.loadDatabase();
export default servers;