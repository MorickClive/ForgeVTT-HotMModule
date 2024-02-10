(() => {
	const adventureName = 'Custom: HotM Test Code';
	const moduleName = 'heirs-of-the-maelstrom';
	
	/**
	* additionalModulePacks is a list of modules whose compendium packs can be looked in for entities by name (in prioritised order).
	* Enter just the "name" of the module/s or system/s you want to be considered.
	*
	* By default, all packs within your module will be included along with those from the dnd5e system.
	*
	* For example, if you wanted to allow the packs from
	* the [Free Loot Tavern's Magic Item Vault]{@link https://foundryvtt.com/packages/free-loot-tavern-compendium}
	* and [Dynamic Active Effects SRD]{@link https://foundryvtt.com/packages/Dynamic-Effects-SRD}
	* modules to be searchable:
	*   const additionalModulePacks= ['free-loot-tavern-compendium', 'Dynamic-Effects-SRD'];
	*
	* Set to the following to disable:
	*   const additionalModulePacks = [];
	*/
	const additionalModulePacks = ["heirs-of-the-maelstrom"];

	Hooks.once('scenePackerReady', ScenePacker => {
		// Initialise the Scene Packer with your adventure name and module name
		let packer = ScenePacker.Initialise({
			additionalModulePacks,
			allowImportPrompts: true, // Set to false if you don't want the initial popup
		});
	});


	async function hasScoreBoard(targActor) {
		let check = await targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard");

		if (check != null) { return true; }
		return false;
	}

	async function postModifiedScore(targActor, modifierText, value){
		let html = `<div style="display:flex; flex-direction: column; align-items: center;">
			<h3>${targActor.name}</h3>
			<h3>${modifierText}: ${value}</h3></span>
		</div>`;
		ChatMessage.create({ content: html });	
	}
	
	async function resetScoreboard(targActor) {
		postModifiedScore(targActor, "Reset Score to", 0)
		await targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", 0);
	}

	async function adjustScore(targActor, value) {
		console.log(! await hasScoreBoard(targActor));
		if (! await hasScoreBoard(targActor)) { await resetScoreboard(targActor); }
		let currentScore = await targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard");
		
		postModifiedScore(targActor, "Modifies Score", value)
		await targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", currentScore + value);
	}
	
	async function scoreBoardMenu(targActor, scoreboard) {
						
		let scoreBoard_Element = `
			<div style="display:flex; flex-direction: column; align-items: center;">
			<img src="${targActor.data.img}" data-edit="img" title="Avatar" height="256" width="256">
			<span style="flex:1"><h3>Score: ${scoreboard}</h3></span>
			<span style="flex:1">Value: <input id="scoreVal" type="number" value ="5"/></span>
			<span style="flex:1"></span>
			</div>`;
			
		return new Dialog({
                title: `Scoreboard: ${targActor.name}`,
                content: scoreBoard_Element,
                buttons: {

                    reset: {
                        label: "Reset",
                        callback: () => { resetScoreboard(targActor); }
                    },

                    increment5: {
                        label: "Add",
                        callback: (scoreBoard_Element) => { adjustScore(targActor, scoreBoard_Element.find("#scoreVal")[0].valueAsNumber); }
                    },

                    decrement5: {
                        label: "Remove",
                        callback: (scoreBoard_Element) => { adjustScore(targActor, -scoreBoard_Element.find("#scoreVal")[0].valueAsNumber); }
                    }
                }
            }).render(true);
	}

	Hooks.on("renderActorSheet", (app, html, data) => {
		let sidebar = html.find('.sidebar');
		let targetElement = html.find('.favorites');
		const targActor = data.actor.data;
		let targetActorDirect = data.actor;
		let score = data.actor.flags["heirs-of-the-maelstrom"].Scoreboard;
		
		const post = `<div style="display:flex; flex-direction: column; align-items: center;">
			<img src="${targActor.img}" data-edit="img" title="Avatar" height="256" width="256">
			<h3>${targActor.name}</h3>
			<h3>Current Score: ${targActor.flags["heirs-of-the-maelstrom"].Scoreboard}</h3></span>
			</div>`;

		let newSection = `<div class="favorites scoreboard" style="flex:0;">
			<h3 class="icon">
				<i class="fas fa-star"></i>
				<span class="roboto-upper">Scoreboard</span>
			</h3>
			
			<div class="pill-lg texture background item-tooltip macroScoreboardPost">
				<img class="gold-icon" src="icons/sundries/books/book-tooled-silver-blue.webp" alt="Scoreboard" />
				<div class="name name-stacked">
					<span class="title">Score</span>
					<div class="meter-group">
						<div class="meter hit-dice progress" role="meter" aria-valuemin="0" aria-valuenow="12" aria-valuemax="13" style="--bar-percentage: 92.3076923076923%">
							<div class="label">
								<span class="value">${targActor.flags["heirs-of-the-maelstrom"].Scoreboard}</span>
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

		targetElement.before(newSection);

		// Add an onClick function to the button
		sidebar.find('.macroScoreboardPost').click(() => {
			ChatMessage.create({ content: post });
		});
		sidebar.find('.adjustScoreboard').click(() => {
			scoreBoardMenu(targetActorDirect, score)
		});
	});

	const div = "=".repeat(40);
	const URL = "https://github.com/MorickClive/ForgeVTT-HotMModule/tree/feature-customFlags";
	console.log(`%c${div}\nModule: 📗 Heirs of the Maelstrom (ACTIVE)\n${div}\nURL: ${URL}\n`, 'background: #000; color: #006400;');

})();

