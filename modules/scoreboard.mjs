export class Scoreboard {

    static targActor;
    static scoreboard;
    static html;

    /**
     * Initialises the module.
     */
    static onReady(){
        let div = "=".repeat(40);
        let URL = "https://github.com/MorickClive/ForgeVTT-HotMModule/tree/feature-customFlags";
        let version = "1.0.1"; // Ideally fetch dynamically from a config

        console.log(`%c${div}\nModule: 📗 Heirs of the Maelstrom: (v${version})\n${div}\nURL: ${URL}\n`,
                'background: #000; color: #006400;');
        console.log(`HOM WITH UI CLASSES`);
    }

    /**
     * Injects the Scoreboard into the Actor Sheet.
     * 
     * Should be called from the renderActorSheet hook.
     * 
     * @param {JQuery} html - The HTML of the Actor Sheet
     * @param {Object} data - The data of the Actor Sheet
    */
    static async injectActorSheet(html, data){
        Scoreboard.html = html; // provides scope for the class
        Scoreboard.targActor = data.actor;
        Scoreboard.scoreboard = 0;
        
        Scoreboard.#verifyScoreboard();
        await Scoreboard.#refreshScoreboard(data.actor);
        Scoreboard.#injectSidebar(html, data.actor)
    }

    // ========================================
    static #injectSidebar(html, actor) {
        if (html.find('.favorites .scoreboard').length === 0) {
            html.find('.favorites').before(Scoreboard_HTML.sheetButtons(Scoreboard.scoreboard));
        }
        // Inject Event Listeners
        Scoreboard.#injectEventListeners(html, actor, Scoreboard.scoreboard)
    }

    static #injectEventListeners(html, actor, scoreValue) {
        let css_sidebar = html.find('.sidebar');
        let postScoreMacro = css_sidebar.find('.macroScoreboardPost');
        let adjustScoreboard = css_sidebar.find('.adjustScoreboard');

        postScoreMacro.click(() => {
            ChatMessage.create({ content: Scoreboard_HTML.scorePost(actor, scoreValue) });
        });
        adjustScoreboard.click(() => {
            Scoreboard.#createScoreboardMenu();
        });
    }

    static #postScore(text, value) {
        let html = Scoreboard_HTML.chatPost(text, value, Scoreboard.targActor);
        ChatMessage.create({ content: html });
    }

    static async #createScoreboardMenu() {
        return new Dialog({
            title: `Scoreboard: ${Scoreboard.targActor.name}`,
            content: Scoreboard_HTML.controlMenu(Scoreboard.targActor, Scoreboard.scoreboard),
            buttons: {
                reset: {
                    label: "Reset",
                    callback: () => { Scoreboard.#resetScoreboard(); }
                },

                increment5: {
                    label: "Add",
                    callback: (element) => {
                        Scoreboard.#adjustScore(element.find("#scoreVal")[0].valueAsNumber); }
                },

                decrement5: {
                    label: "Remove",
                    callback: (element) => { 
                        Scoreboard.#adjustScore(-element.find("#scoreVal")[0].valueAsNumber); }
                }
            }
        }).render(true);
    }

    /**
     * Refreshes or initialises the scoreboard value from the actor's flags.
     */
    static async #refreshScoreboard(actor) {
        Scoreboard.scoreboard = await FlagManager.getActorFlag(actor, "Scoreboard");
    }

    // Actions
    static async #hasScoreBoard() {
        return (await FlagManager.getActorFlag(Scoreboard.targActor, "Scoreboard")) != null;
    }

    static async #adjustScore(value) {
        let currentScore = await FlagManager.getActorFlag(targActor, "Scoreboard");

        Scoreboard.#postScore("Modifies Score", value);
        Scoreboard.html.find('#scoreboard_sheet').text(currentScore + value);
        await FlagManager.setActorFlag(Scoreboard.targActor, "Scoreboard", currentScore + value);
    }

    static async #resetScoreboard() {
        Scoreboard.#postScore("Reset Score to", 0);
        await FlagManager.setActorFlag(Scoreboard.targActor, "Scoreboard", 0);
    }

    static async #verifyScoreboard() {
        console.log(`Needs Scoreboard? - ${!await Scoreboard.#hasScoreBoard()}`);
        if (!await Scoreboard.#hasScoreBoard()) {
            await Scoreboard.#resetScoreboard();
        }
    }
}

class Scoreboard_HTML {
    static sheetButtons(value) {
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
                                <span id="scoreboard_sheet" class="value">${value}</span>
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
            </div>
        </div>`;
    }

    static controlMenu(actor, value){
        return `
            <div style="display:flex; flex-direction: column; align-items: center;">
            <img src="${actor.system.img}" data-edit="img" title="Avatar" height="256" width="256">
            <span style="flex:1"><h3>Score: ${value}</h3></span>
            <span style="flex:1">Value: <input id="scoreVal" type="number" value ="5"/></span>
            <span style="flex:1"></span>
            </div>`;
    }

    static scorePost(actor, value) {
        return `<div style="display:flex; flex-direction: column; align-items: center;">
        <img src="${actor.img}" data-edit="img" title="Avatar" height="256" width="256">
        <h3>${actor.name}</h3>
        <h3>Current Score: ${value}</h3>
        </div>`;
    }

    static chatPost(text, value, actor = "Missing-Name") {
        return `<div style="display:flex; flex-direction: column; align-items: center;">
            <h3>${actor.name}</h3>
            <h3>${text}: ${value}</h3>
        </div>`;
    }
}

class FlagManager {
    static async setActorFlag(actor, flag, value) {
        await actor.setFlag("heirs-of-the-maelstrom", flag, value);
    }

    static async getActorFlag(actor, flag) {
        return await actor.getFlag("heirs-of-the-maelstrom", flag);
    }
}