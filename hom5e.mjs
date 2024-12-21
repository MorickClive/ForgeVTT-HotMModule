import { Scoreboard } from "./modules/scoreboard.mjs";

Hooks.on("renderActorSheet", Scoreboard.injectActorSheet(html, data));
Hooks.once("ready", Scoreboard.onReady);