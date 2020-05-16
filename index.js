require("dotenv").config();
const { App, ExpressReceiver } = require("@slack/bolt");
const axios = require("axios");

const expressReceiver = new ExpressReceiver({});
const app = new App({
  // authorize: oauth.authorize,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_USER_TOKEN,
  receiver: expressReceiver,
  logLevel: "DEBUG"
});

const emojis = {
  "rocket-league": ":rocket-league:",
  "duck-game": ":duck-game:"
};

const express = expressReceiver.app;

express.get('/id', async (req, res) => {
  const username = req.query.username
  
  const result = await axios.get(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${username}`)
  return res.send(result.data.response.steamid)
})

// ping function to keep glitch alive
express.get("/ping", async (req, res) => {
  console.log("<3");
  const gameInfo = await getSteamStatus();

  if (gameInfo) {
    const key = gameInfo.toLowerCase().replace(" ", "-");
    const emoji = emojis[key] || ":video_game:";
    await setStatus(gameInfo, emoji);
  }

  if (!gameInfo) {
    const status = await getSlackStatus();
    // only unset status if it's a game status
    if (isGameStatus(status)) await unsetStatus();
  }

  return res.send("pong");
});

// check if the current Slack status is a game status
const isGameStatus = status => {
  const key = status.emoji.replace(/:/g, '')
  return status.text.startsWith('playing') && (status.emoji === ":video_game:" || emojis[key]);
};

const getSlackStatus = async () => {
  const profile = await app.client.users.profile.get({
    token: process.env.SLACK_USER_TOKEN
  });
  return {
    emoji: profile.profile.status_emoji,
    text: profile.profile.status_text
  }
};

const unsetStatus = async () => {
  await app.client.users.profile.set({
    token: process.env.SLACK_USER_TOKEN,
    profile: {
      status_text: "",
      status_emoji: ""
    }
  });
};

const setStatus = async (gameInfo, emoji) => {
  await app.client.users.profile.set({
    token: process.env.SLACK_USER_TOKEN,
    profile: {
      status_text: `playing ${gameInfo}`,
      status_emoji: `${emoji}`
    }
  });
};

const getSteamStatus = async () => {
  const res = await axios.get(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${process.env.STEAM_ID}`
  );
  const gameInfo = res.data.response.players[0].gameextrainfo;

  return gameInfo;
};

app.error(error => {
  console.error(error);
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
