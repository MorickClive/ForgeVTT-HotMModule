(() => {
	const adventureName = 'Custom: HotM Test Code';
	const moduleName = 'heirs-of-the-maelstrom';

	/**
	* welcomeJournal (if set) will automatically be imported and opened after the first activation of a
	* scene imported from the module compendium.
	* The name here corresponds to a Journal entry in your compendium and must match exactly (it is case
	* sensitive).
	* Set to the following to disable:
	*   const welcomeJournal = '';
	*/
	const welcomeJournal = 'This might be what I suspect is the equal of a README file for repos, in this case a module seems to need this to display what it\'s about.';
	/**
	* additionalJournals will automatically be imported. This is a list of Journals by name that should
	* also be imported.
	* Set to the following to disable:
	*   const additionalJournals = [];
	*/
	const additionalJournals = [];
	/**
	* additionalMacros will automatically be imported. Each name must match exactly and are case sensitive.
	* Set to the following to disable:
	*   const additionalMacros = [];
	*/
	const additionalMacros = [];
	/**
	* creaturePacks is a list of compendium packs to look in for Actors by name (in prioritised order).
	* If the creature is not found in the first pack, it will search through each subsequent pack.
	* Set to the following to disable:
	*   const creaturePacks = [];
	*/
	const creaturePacks = [];
	/**
	* journalPacks is a list of compendium packs to look in for Journals by name (in prioritised order).
	* Set to the following to disable:
	*   const journalPacks = [];
	*/
	const journalPacks = [];
	/**
	* macroPacks is a list of compendium packs to look in for Macros by name (in prioritised order).
	* Set to the following to disable:
	*   const macroPacks = [];
	*/
	const macroPacks = [];
	/**
	* playlistPacks is a list of compendium packs to look in for Playlists by name (in prioritised order).
	* Set to the following to disable:
	*   const playlistPacks = [];
	*/
	const playlistPacks = [];
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
			adventureName,
			moduleName,
			creaturePacks,
			journalPacks,
			macroPacks,
			playlistPacks,
			additionalModulePacks,
			welcomeJournal,
			additionalJournals,
			additionalMacros,
			allowImportPrompts: true, // Set to false if you don't want the initial popup
		});
	});

	Hooks.on("renderActorSheet", (app, html, data) => {
		let featuresTab = html.find('.tab.features');
		let featuresList = featuresTab.find('.items-list.inventory-list');
		const targActor = data.actor.data;

		const post = `<div style="display:flex; flex-direction: column; align-items: center;">
		<img src="${targActor.img}" data-edit="img" title="Avatar" height="256" width="256">
		<h3>targActor.name</h3>
		<h3>Current Score: ${targActor.flags["heirs-of-the-maelstrom"].Scoreboard}</h3></span>
		</div>`;

		let newSection = `<li class="items-header flexrow">
			<h3 class="item-name flexrow">Scoreboard</h3>
		</li>
		<ol class="item-list">
                    <li class="item flexrow " draggable="true">
						<button class="macroScoreboardPost">Post Scoreboard to Chat</button>            
                    </li>
                </ol>
		</div>`;

		featuresList.prepend(newSection);

		// Add an onClick function to the button
		featuresList.find('.macroScoreboardPost').click(() => {
			ChatMessage.create({ content: post });
		});
	});

	const div = "=".repeat(40);
	const URL = "https://github.com/MorickClive/ForgeVTT-HotMModule/tree/feature-customFlags";
	console.log(`%c${div}\nModule: 📗 Heirs of the Maelstrom (ACTIVE)\n${div}\nURL: ${URL}\n`, 'background: #000; color: #006400;');

})();

