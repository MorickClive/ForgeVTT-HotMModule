import Scoreboard from "./modules/scoreboard.js";

async function onRenderActorSheet(app, html, data) {
	await Scoreboard.injectActorSheet(app, html, data);
}

//Hooks.once("init", onInit);
Hooks.on("renderActorSheet", onRenderActorSheet);
Hooks.once("ready", Scoreboard.onReady);