	async function hasScoreBoard(targActor) {
		let check = await targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard");

		if (check != null) { return true; }
		return false;
	}

	function  postModifiedScore(targActor, prefixText, value) {
		let html = `<div style="display:flex; flex-direction: column; align-items: center;">
			<h3>${targActor.name}</h3>
			<h3>${prefixText}: ${value}</h3></span>
		</div>`;

		ChatMessage.create({ content: html });
	}

	async function resetScoreboard(targActor) {
		postModifiedScore(targActor, "Reset Score to", 0);
		await targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", 0);
	}

	async function adjustScore(targActor, value) {
		console.log(! await hasScoreBoard(targActor));
		if (! await hasScoreBoard(targActor)) {
			await resetScoreboard(); 
		}
		let currentScore = await targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard");

		postModifiedScore(targActor, "Modifies Score", value)
		await targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", currentScore + value)
	}

	function  html_scoreboardButtons(scoreboard){ 
		return `<div class="favorites scoreboard" style="flex:0;">
			<h3 class="icon">
				<i class="fas fa-star"></i>
				<span class="roboto-upper">Scoreboard</span>
			</h3>
			
			<div class="pill-lg texture background item-tooltip macroScoreboardPost">
				<img class="gold-icon" src="icons/sundries/books/book-tooled-silver-blue.webp" alt="Scoreboard" />
				<div class="name name-stacked">
					<span class="title">Score</span>
					<div class="meter-group">
						<div class="meter hit-dice progress" role="meter" aria-valuemin="0" aria-valuenow="12" aria-valuemax="13" style="--bar-percentage: 100%">
							<div class="label">
								<span class="value">${scoreboard}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
				
			<div class="pill-lg texture background adjustScoreboard">
				<img class="gold-icon" src="icons/sundries/books/book-tooled-silver-blue.webp" alt="Scoreboard" />
				<div class="name name-stacked">
					<span class="title">Adjust Score</span>
				</div>
			</div>`;
	}

	function scoreBoardMenu(targActor, scoreboard) {
		let element = `
			<div style="display:flex; flex-direction: column; align-items: center;">
			<img src="${targActor.data.img}" data-edit="img" title="Avatar" height="256" width="256">
			<span style="flex:1"><h3>Score: ${scoreboard}</h3></span>
			<span style="flex:1">Value: <input id="scoreVal" type="number" value ="5"/></span>
			<span style="flex:1"></span>
			</div>`;

		new Dialog({
			title: `Scoreboard: ${targActor.name}`,
			content: element,
			buttons: {

				reset: {
					label: "Reset",
					callback: () => { resetScoreboard(targActor); }
				},

				increment5: {
					label: "Add",
					callback: (element) => { adjustScore(targActor, element.find("#scoreVal")[0].valueAsNumber); }
				},

				decrement5: {
					label: "Remove",
					callback: (element) => { adjustScore(targActor, -element.find("#scoreVal")[0].valueAsNumber); }
				}
			}
		}).render(true);
	}

	// ======================================== 
	//  Foundry VTT Initialization
	// ========================================

	Hooks.once("init", function() {
		// Register the new sheet class with Foundry VTT
		// Actors.registerSheet("heirs-of-the-maelstrom", MyCustomSheet, { types: ["character"], makeDefault: false });
	});

	Hooks.on("renderActorSheet", (app, html, data) => {
		let elementTarg = {
			css_sidebar :  html.find('.sidebar'),
			css_targetElement : html.find('.favorites')
		}

		let targActor = data.actor;
		let scoreboard = data.actor.flags["heirs-of-the-maelstrom"].Scoreboard;

		// ====
		const post = `<div style="display:flex; flex-direction: column; align-items: center;">
		<img src="${targActor.img}" data-edit="img" title="Avatar" height="256" width="256">
		<h3>${targActor.name}</h3>
		<h3>Current Score: ${scoreboard}</h3></span>
		</div>`;
		// ====

		// Add an onClick function to the button
		elementTarg.css_targetElement.before(html_scoreboardButtons(scoreboard));

		elementTarg.css_sidebar.find('.macroScoreboardPost').click(() => {
			ChatMessage.create({ content: post });
		});
		elementTarg.css_sidebar.find('.adjustScoreboard').click(() => {
			scoreBoardMenu(targActor, scoreboard)
		});
	});

	Hooks.once("ready", () => {
		const div = "=".repeat(40);
		const URL = "https://github.com/MorickClive/ForgeVTT-HotMModule/tree/feature-customFlags";
		console.log(`%c${div}\nModule: 📗 Heirs of the Maelstrom (ACTIVE)\n${div}\nURL: ${URL}\n`, 'background: #000; color: #006400;');
		console.log(`HOM WITH CLASSES`);
	});