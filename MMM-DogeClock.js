Module.register("MMM-DogeClock", {
  defaults: {
    updateInterval: 60000, // Update every minute
    targetDate: "2026-07-04"
  },

  start: function() {
    console.log("MMM-DogeClock started.");
    this.dogeData = null;
    this.sendSocketNotification("GET_DOGE_DATA", { targetDate: this.config.targetDate });
    this.scheduleUpdate();
  },

  getStyles: function() {
    return ["MMM-DogeClock.css"];
  },

  scheduleUpdate: function() {
    setInterval(() => {
      console.log("Requesting DOGE data update.");
      this.sendSocketNotification("GET_DOGE_DATA", { targetDate: this.config.targetDate });
    }, this.config.updateInterval);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "DOGE_DATA") {
      console.log("Received DOGE_DATA:", payload);
      this.dogeData = payload;
      this.updateDom();
    }
  },

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "MMM-DogeClock";

    if (!this.dogeData) {
      wrapper.innerHTML = "Loading DogeClock...";
      return wrapper;
    }

    wrapper.innerHTML = `
      <h1>${this.dogeData.countdownDays} Days</h1>
      <p>until ${this.config.targetDate}</p>
      <h2>$${(this.dogeData.totalSavings / 1e9).toFixed(2)}B</h2>
      <p>Taxpayer Dollars Saved*</p>
      <div class="container">
        <p class="highlight">$${(this.dogeData.totalSavings / 1e9).toFixed(2)}B</p>
        <p>Total Savings</p>
        <p class="highlight">${this.dogeData.progressToGoal}%</p>
        <p>Progress to Goal</p>
        <p class="highlight">$${this.dogeData.savingsPerTaxpayer.toFixed(2)}</p>
        <p>Savings per Taxpayer</p>
        <p class="highlight">${this.dogeData.totalInitiatives}</p>
        <p>Total Initiatives</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${this.dogeData.progressToGoal}%;"></div>
        </div>
      </div>
    `;
    return wrapper;
  }
});
