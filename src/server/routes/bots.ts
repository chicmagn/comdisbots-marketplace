import express from "express";
const bots = express.Router();
import axios from "axios";
import Datastore from "nedb";

const botsDB = new Datastore({ filename: "db/bots.db", autoload: true });
botsDB.loadDatabase();

const getApplicationInfo = async (token: any, appId: any) => {
    const response = await axios.get(
      `https://discord.com/api/v9/applications/${appId}`,
      {
        headers: {
          authorization: `Bot ${token}`,
        },
      }
    );
  
    return response.data;
  };

bots.get("/api/bot", async (req, res) => {
  try {
    const info = await getApplicationInfo(req.query.token, req.query.appId);
    res.status(200).send(info);
  } catch (err: any) {
    res.status(500).send({ success: false, msg: err });
  }
});

bots.post("/api/bot/upvote", async (req, res) => {
  try {
    const { botId } = req.body;
    botsDB.findOne({ clientID: botId }, (err: any, doc: any) => {
      if (err) {
        res.status(500).send({ success: false, msg: err });
      } else {
        const vote = doc["vote"];
        doc[vote] = vote + 1;
        botsDB.update(
          { clientID: botId },
          { $set: { vote: vote + 1 } },
          {},
          (error: any, numReplaced: any) => {
            if (error) {
              res.status(500).send({ success: false, msg: error });
            } else {
              res.status(200).send({ success: true });
            }
          }
        );
      }
    });
  } catch (err: any) {
    res.status(500).send({ success: false, msg: err });
  }
});

bots.get("/api/bots", (req, res) => {
  try {
    console.log(req.query);
    const { search, user } = req.query;
    let filter = {};

    if (search === "mine")
      filter = {
        "owner.id": user,
      };
    botsDB.find(filter, (err: any, docs: any) => {
      if (err) {
        res.status(500).send({ success: false, msg: err });
      } else {
        res.status(200).send({ success: true, bots: docs });
      }
    });
  } catch (err: any) {
    res.status(500).send({ success: false, msg: err });
  }
});

bots.post("/api/bot/add", async (req, res) => {
  try {
    const {
      botToken,
      clientID,
      shortDesc,
      desc,
      cmdPrefix,
      website,
      inviteLink,
      serverInvite,
    } = req.body;
    const {
      name,
      icon,
      description: appDesc,
      type,
      cover_image: coverImage,
      bot,
      summary,
      tags,
      owner,
    } = await getApplicationInfo(botToken, clientID);

    botsDB.insert(
      {
        botToken,
        clientID,
        shortDesc,
        desc,
        cmdPrefix,
        website,
        inviteLink,
        serverInvite,
        name,
        icon,
        appDesc,
        type,
        coverImage,
        bot,
        summary,
        tags,
        owner,
        vote: 0,
      },
      (err: any) => {
        if (err) res.status(200).send({ success: false, msg: err });
        else res.status(200).send({ success: true, msg: "Saved" });
      }
    );
  } catch (err: any) {
    res.status(500).send({ success: false, msg: err });
  }
});

export default bots;
