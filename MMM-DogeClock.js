Module.register("MMM-DogeClock", {
    defaults: {
        updateInterval: 60000,  // Update every minute
        targetDate: "2026-07-04"
    },

    start: function () {
        this.dogeData = null;
        this.sendSocketNotification("GET_DOGE_DATA", { targetDate: this.config.targetDate });
        this.scheduleUpdate();
    },

    scheduleUpdate: function () {
        setInterval(() => {
            this.sendSocketNotification("GET_DOGE_DATA", { targetDate: this.config.targetDate });
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "DOGE_DATA") {
            console.log("Received DOGE_DATA:", payload);
            this.dogeData = payload;
            this.updateDom();
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.id = "us-debt-container";

        if (!this.dogeData) {
            wrapper.innerHTML = "Loading...";
            return wrapper;
        }

        const { totalSavings, savingsPerTaxpayer, progressToGoal, totalInitiatives, countdownDays } = this.dogeData;

        wrapper.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: bold;">
                    ${countdownDays} Days Until ${this.config.targetDate}
                </div>
                <div style="font-size: clamp(1.2rem, 3vw, 2rem);">
                    Total Savings: $${(totalSavings / 1000000000).toFixed(2)}B
                </div>
            </div>
            <div style="background-color: rgba(20, 20, 20, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: clamp(8px, 1.5vh, 15px); flex: 1 1 auto; min-height: 0px; display: flex; flex-direction: column;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: clamp(8px, 1.5vh, 15px); margin-bottom: clamp(8px, 1.5vh, 15px);">
                    <div>
                        <div style="color: rgb(74, 238, 74); font-size: clamp(0.9rem, 2.5vw, 1.3rem); font-weight: 500;">
                            <span>$${savingsPerTaxpayer.toFixed(2)}</span>
                        </div>
                        <div style="opacity: 0.7; font-size: clamp(0.7rem, 1.8vw, 0.9rem);">
                            Savings per Taxpayer
                        </div>
                    </div>
                    <div>
                        <div style="color: rgb(74, 238, 74); font-size: clamp(0.9rem, 2.5vw, 1.3rem); font-weight: 500;">
                            ${progressToGoal.toFixed(2)}%
                        </div>
                        <div style="opacity: 0.7; font-size: clamp(0.7rem, 1.8vw, 0.9rem);">
                            Progress to Goal
                        </div>
                    </div>
                    <div>
                        <div style="color: rgb(74, 238, 74); font-size: clamp(0.9rem, 2.5vw, 1.3rem); font-weight: 500;">
                            ${totalInitiatives}
                        </div>
                        <div style="opacity: 0.7; font-size: clamp(0.7rem, 1.8vw, 0.9rem);">
                            Total Initiatives
                        </div>
                    </div>
                </div>
            </div>
        `;

        return wrapper;
    }
});
