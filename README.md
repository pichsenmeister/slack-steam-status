# slack-steam-status

A simple Slack app that updates your Slack status to the game you currently play on Steam.

This app uses the [Bolt for Slack](https://slack.dev/bolt/concepts) framework.

## Steam configuration

1. Get a Steam API key [here](https://steamcommunity.com/dev/apikey)
2. Get your numeric Steam ID 
  - Add your `STEAM_API_KEY` to the `.env` file and call `/id?username=<your Steam display name>`

## Slack app configuration

1. Create an [app](https://api.slack.com/apps) on Slack
2. Add `User Token Scopes` in `OAuth & Permissions`
  - `users.profile:read`
  - `users.profile:write`
3. Install App

## Run the app

1. Install dependencies via `npm` or `yarn`
2. Create a `.env` file and with following keys
  - `SLACK_USER_TOKEN=<your Slack app's user token>`
  - `STEAM_API_KEY=<your Steam API key>`
  - `STEAM_ID=<your numeric Steam ID>`
3. Create a cronjob (or something similar) that calls `/ping` to update your status  

## Remix on Glitch

[Remix on Glitch](https://glitch.com/edit/#!/remix/slack-steam-status)