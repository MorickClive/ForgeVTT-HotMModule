
export async function phyrexianRandomManaPicker(manaImgPath) {
	console.log("Hello World");
	const phyrexianTable = game.tables.get("17CZSugmOAWhW5hs");
	const iconCSS = "width:32px;height:32px;border:0;margin-left:15px;padding:1px;background:black;border-radius: 50px;";

	let roll = await new Roll("1d5").evaluate({ async: true });
	let result = phyrexianTable.getResultsForRoll(roll.result);
	let messageOwner = ChatMessage.getSpeaker({ alias: `Mana: ${result[0].text}` });
	let message = "";

	message = `
	<div style="display: flex;align-items: center;">
		<img src= "${manaImgPath}${result[0].text}.png" style="${iconCSS}" />
	</div>
	`;

	ChatMessage.create(
		{
			speaker: messageOwner,
			content: message
		});
}

export async function scoreBoardTracker() {

	let select = canvas.tokens.controlled;
	if (select.length == 0) {
		ui.notifications.error("Nothing selected!");
	}
	else if (select.length > 1) {
		ui.notifications.error("Too many tokens selected!");
	} else {

		let targActor = select[0].actor;
		console.log(targActor);

		if (targActor.system.scoreboard == undefined || targActor.system.scoreboard == NaN) {
			targActor.system.scoreboard = 0;
		}

		let menuDesc = `
	<div style="display:flex; flex-direction: column; align-items: center;">
	<img src="${targActor.img}" data-edit="img" title="Avatar" height="256" width="256">
	<span style="flex:1"><h3>Score: ${targActor.system.scoreboard}</h3></span>
	<span style="flex:1">Value: <input id="scoreVal" type="number" value ="5"/></span>
	<span style="flex:1"></span>
	</div>
	
	`;

		let menu = new Dialog(
			{
				title: `Scoreboard: ${targActor.name}`,
				content: menuDesc,
				buttons: {

					reset: {
						label: "Reset",
						callback: () => { targActor.system.scoreboard = 0 }
					},

					increment5: {
						label: "Add",
						callback: (menuDesc) => { targActor.system.scoreboard += menuDesc.find("#scoreVal")[0].valueAsNumber; }
					},

					decrement5: {
						label: "Remove",
						callback: (menuDesc) => {
							targActor.system.scoreboard -= menuDesc.find("#scoreVal")[0].valueAsNumber;
						}
					}
				}
			}).render(true);

	}
}

export async function viewSelectedToken() {

	let select = canvas.tokens.controlled;
	
	//canvas.tokens.selectObjects([])
	//canvas.tokens.objects.children.filter(x => x.targeted.size > 0)[0].actor
	if (select.length == 0) {
		ui.notifications.error("Nothing selected!");
	}
	else if (select.length > 1) {
		ui.notifications.error("Too many tokens selected!");
	} else {

		let targActor = select[0].actor;
		let targTexture = select[0].document.texture;
		console.log(targActor);
		console.log(targTexture.src);

		let menuDesc = `
		<h2>${targActor.prototypeToken.name}</h2>
		<img src="${targTexture.src}" data-edit="img" style="width:256px;height:256px;border:0;">
		`;

		ChatMessage.create({
			content: menuDesc
		})

	}
}

export async function openMainGMSheet() {
	let sheet = game.actors.get("MzcyZGQ3ZTM4ZDk4").sheet;

	if (sheet.rendered) {
		if (sheet._minimized) sheet.maximize();
		else sheet.close();
	}
	else sheet.render(true);

	return sheet;
}
