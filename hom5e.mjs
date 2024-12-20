import { Scoreboard } from "./modules/scoreboard.mjs";

function onRenderActorSheet(app, html, data) {
	Scoreboard.injectActorSheet(app, html, data);
}

Hooks.on("renderActorSheet", onRenderActorSheet);
Hooks.once("ready", Scoreboard.onReady);