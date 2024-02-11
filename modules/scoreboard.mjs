
export default class Scoreboard {

    constructor(html, data) {
        this.css_sidebar = html.find('.sidebar');
        this.css_targetElement = html.find('.favorites');

        this.targActor = data.actor;
        this.scoreboard = data.actor.flags["heirs-of-the-maelstrom"].Scoreboard;
    }

    injectHook() {
        const post = `<div style="display:flex; flex-direction: column; align-items: center;">
			<img src="${this.targActor.img}" data-edit="img" title="Avatar" height="256" width="256">
			<h3>${this.targActor.name}</h3>
			<h3>Current Score: ${this.scoreboard}</h3></span>
			</div>`;

        this.css_targetElement.before(this._html_scoreboardButtons())

        // Add an onClick function to the button
        this.css_sidebar.find('.macroScoreboardPost').click(() => {
            ChatMessage.create({ content: post });
        });
        this.css_sidebar.find('.adjustScoreboard').click(() => {
            this._scoreBoardMenu(this.targActor, this.scoreboard)
        });
    }

    async _scoreBoardMenu() {
        let element = `
			<div style="display:flex; flex-direction: column; align-items: center;">
			<img src="${this.targActor.data.img}" data-edit="img" title="Avatar" height="256" width="256">
			<span style="flex:1"><h3>Score: ${this.scoreboard}</h3></span>
			<span style="flex:1">Value: <input id="scoreVal" type="number" value ="5"/></span>
			<span style="flex:1"></span>
			</div>`;

        return new Dialog({
            title: `Scoreboard: ${this.targActor.name}`,
            content: element,
            buttons: {

                reset: {
                    label: "Reset",
                    callback: () => { this._resetScoreboard(this.targActor); }
                },

                increment5: {
                    label: "Add",
                    callback: (element) => { this._adjustScore(this.targActor, element.find("#scoreVal")[0].valueAsNumber); }
                },

                decrement5: {
                    label: "Remove",
                    callback: (element) => { this._adjustScore(this.targActor, -element.find("#scoreVal")[0].valueAsNumber); }
                }
            }
        }).render(true);
    }

    _html_scoreboardButtons() {
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

    async _hasScoreBoard() {
        let check = await this.targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard");

        if (check != null) { return true; }
        return false;
    }

    _postModifiedScore(prefixText, value) {
        let html = `<div style="display:flex; flex-direction: column; align-items: center;">
			<h3>${this.targActor.name}</h3>
			<h3>${prefixText}: ${value}</h3></span>
		</div>`;

        ChatMessage.create({ content: html });
    }

    async _resetScoreboard() {
        this._postModifiedScore("Reset Score to", 0);
        await this.targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", 0);
    }

    async _adjustScore(value) {
        console.log(! await this._hasScoreBoard(this.targActor));
        if (! await this._hasScoreBoard(this.targActor)) {
             await this._resetScoreboard(); 
        }
        let currentScore = await this.targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard");

        this._postModifiedScore(this.targActor, "Modifies Score", value)
        await this.targActor.setFlag("heirs-of-the-maelstrom", "Scoreboard", currentScore + value)
    }

}