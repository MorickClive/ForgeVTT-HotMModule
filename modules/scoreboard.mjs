export class Scoreboard {

    static targActor;
    static scoreboard;
    static html;
    static data;

    static onReady(){
        let div = "=".repeat(40);
        let URL = "https://github.com/MorickClive/ForgeVTT-HotMModule/tree/feature-customFlags";
        let version = "1.0.1"; // Ideally fetch dynamically from a config

        console.log(`%c${div}\nModule: 📗 Heirs of the Maelstrom: (v${version})\n${div}\nURL: ${URL}\n`,
                'background: #000; color: #006400;');
        console.log(`HOM WITH UI CLASSES`);
    }
   
    static async injectActorSheet(app, html, data){
        Scoreboard.targActor = null;
        Scoreboard.targActor = data.actor;
        Scoreboard.html = html;
        Scoreboard.data = data;

        if (!await Scoreboard.hasScoreBoard()) {
            await Scoreboard.setFlag("Scoreboard", 0);
        }

        // Buttons
        let css_sidebar = html.find('.sidebar');
        // inject
        if (html.find('.favorites .scoreboard').length === 0) {
            html.find('.favorites').before(Scoreboard.html_scoreboardButtons());
        }
        let postScoreMacro = css_sidebar.find('.macroScoreboardPost');
        let adjustScoreboard = css_sidebar.find('.adjustScoreboard');
        
        Scoreboard.scoreboard = data.actor.flags["heirs-of-the-maelstrom"].Scoreboard;
        
        const post = `<div style="display:flex; flex-direction: column; align-items: center;">
            <img src="${Scoreboard.targActor.img}" data-edit="img" title="Avatar" height="256" width="256">
            <h3>${Scoreboard.targActor.name}</h3>
            <h3>Current Score: ${Scoreboard.scoreboard}</h3>
            </div>`;

        // Add an onClick function to the button
        postScoreMacro.click(() => {
            ChatMessage.create({ content: post });
        });
        adjustScoreboard.click(() => {
            Scoreboard.scoreBoardMenu();
        });
    }

    static postScore(prefixText, value) {
        let html = `<div style="display:flex; flex-direction: column; align-items: center;">
            <h3>${Scoreboard.targActor.name}</h3>
            <h3>${prefixText}: ${value}</h3>
        </div>`;

        ChatMessage.create({ content: html });
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
                                <span id="scoreboard_sheet" class="value">${Scoreboard.scoreboard}</span>
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

    // Main
    static async scoreBoardMenu() {
        const content = `
            <div style="display:flex; flex-direction: column; align-items: center;">
            <img src="${Scoreboard.targActor.system.img}" data-edit="img" title="Avatar" height="256" width="256">
            <span style="flex:1"><h3>Score: ${Scoreboard.scoreboard}</h3></span>
            <span style="flex:1">Value: <input id="scoreVal" type="number" value ="5"/></span>
            <span style="flex:1"></span>
            </div>`;

        return new Dialog({
            title: `Scoreboard: ${Scoreboard.targActor.name}`,
            content: content,
            buttons: {
                reset: {
                    label: "Reset",
                    callback: () => { Scoreboard.resetScoreboard(); }
                },

                increment5: {
                    label: "Add",
                    callback: (element) => { Scoreboard.adjustScore(element.find("#scoreVal")[0].valueAsNumber); }
                },

                decrement5: {
                    label: "Remove",
                    callback: (element) => { Scoreboard.adjustScore(-element.find("#scoreVal")[0].valueAsNumber); }
                }
            }
        }).render(true);
    }

    static async hasScoreBoard() {
        return (await Scoreboard.targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard")) != null;
    }

    static async setFlag(flag, value) {
        Scoreboard.targActor.setFlag("heirs-of-the-maelstrom", flag, value);
        //refresh the scoreboard on sheet
        Scoreboard.html.find('#scoreboard_sheet').text(Scoreboard.scoreboard);
    }

    // Actions
    static async resetScoreboard() {
        Scoreboard.postScore("Reset Score to", 0);
        await Scoreboard.setFlag("Scoreboard", 0);
    }

    static async adjustScore(value) {
        console.log(!await Scoreboard.hasScoreBoard());
        if (!await Scoreboard.hasScoreBoard()) {
            await Scoreboard.resetScoreboard();
        }
        let currentScore = await Scoreboard.targActor.getFlag("heirs-of-the-maelstrom", "Scoreboard");

        Scoreboard.postScore("Modifies Score", value);
        await Scoreboard.setFlag("Scoreboard", currentScore + value);
    }
}