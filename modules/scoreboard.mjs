export default class Scoreboard {

    static targActor;
    static scoreboard;

    static onReady(){
        this.div = "=".repeat(40);
        this.URL = "https://github.com/MorickClive/ForgeVTT-HotMModule/tree/feature-customFlags";
        this.version = "1.0.1"; // Ideally fetch dynamically from a config

        console.log(`%c${div}\nModule: 📗 Heirs of the Maelstrom: (v${version})\n${div}\nURL: ${URL}\n`,
                'background: #000; color: #006400;');
        console.log(`HOM WITH UI CLASSES`);
   }
   
   static injectActorSheet(app, html, data){
        // Buttons
        let css_sidebar = html.find('.sidebar');
        let postScoreMacro = css_sidebar.find('.macroScoreboardPost')
        let adjustScoreboard = css_sidebar.find('.adjustScoreboard')

        this.targActor = null
        this.targActor = data.actor;

        if(!this.hasScoreBoard()){
            this.setFlag("heirs-of-the-maelstrom", "Scoreboard", 0);
        }
        
        this.scoreboard = data.actor.flags["heirs-of-the-maelstrom"].Scoreboard;
        
        const post = `<div style="display:flex; flex-direction: column; align-items: center;">
            <img src="${this.targActor.img}" data-edit="img" title="Avatar" height="256" width="256">
            <h3>${this.targActor.name}</h3>
            <h3>Current Score: ${this.scoreboard}</h3></span>
            </div>`;

        // inject
        if (html.find('.favorites .scoreboard').length === 0) {
            html.find('.favorites').before(this.html_scoreboardButtons())
        }

        // Add an onClick function to the button
        postScoreMacro.click(() => {
            ChatMessage.create({ content: post });
        });
        adjustScoreboard.click(() => {
            this.scoreBoardMenu()
        });
    }
    
    // Supporting html
    static html_scoreboardButtons() {
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
								<span class="value">${this.scoreboard}</span>
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

    // Main
    static async scoreBoardMenu() {
        const content = `
			<div style="display:flex; flex-direction: column; align-items: center;">
			<img src="${this.targActor.data.img}" data-edit="img" title="Avatar" height="256" width="256">
			<span style="flex:1"><h3>Score: ${this.scoreboard}</h3></span>
			<span style="flex:1">Value: <input id="scoreVal" type="number" value ="5"/></span>
			<span style="flex:1"></span>
			</div>`;

        return new Dialog({
            title: `Scoreboard: ${this.targActor.name}`,
            content: content,
            buttons: {
                reset: {
                    label: "Reset",
                    callback: () => { this.resetScoreboard(this.targActor); }
                },

                increment5: {
                    label: "Add",
                    callback: (element) => { this.adjustScore(this.targActor, element.find("#scoreVal")[0].valueAsNumber); }
                },

                decrement5: {
                    label: "Remove",
                    callback: (element) => { this.adjustScore(this.targActor, -element.find("#scoreVal")[0].valueAsNumber); }
                }
            }
        }).render(true);
    }

    static async hasScoreBoard() {
        return (await this.targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard")) != null;
    }

    static async setFlag(flag, value) {
        await targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", 0);
    }

    // Actions
    static async resetScoreboard() {
        this.postModifiedScore("Reset Score to", 0);
        await this.targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", 0);
    }

    static async adjustScore(value) {
        console.log(! await this._hasScoreBoard());
        if (! await this._hasScoreBoard()) {
             await this.resetScoreboard(); 
        }
        let currentScore = await this.targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard");

        this.postModifiedScore("Modifies Score", value)
        await this.targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", currentScore + value)
    }

    static postModifiedScore(prefixText, value) {
        let html = `<div style="display:flex; flex-direction: column; align-items: center;">
			<h3>${this.targActor.name}</h3>
			<h3>${prefixText}: ${value}</h3></span>
		</div>`;

        ChatMessage.create({ content: html });
    }
   
}