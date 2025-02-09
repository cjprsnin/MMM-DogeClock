Module.register("MMM-DogeClock", {
  defaults: {
    updateInterval: 60000,  // Update every minute
    targetDate: "2026-07-04"
  },

  start: function() {
    // Request data from the node_helper immediately and on schedule
    this.sendSocketNotification("GET_DOGE_DATA", { targetDate: this.config.targetDate });
    this.scheduleUpdate();
  },

  getStyles: function() {
    return ["MMM-DogeClock.css"];
  },

  scheduleUpdate: function() {
    setInterval(() => {
      this.sendSocketNotification("GET_DOGE_DATA", { targetDate: this.config.targetDate });
    }, this.config.updateInterval);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "DOGE_DATA") {
      this.updateDebtDisplay(payload);
    }
  },

  updateDebtDisplay: function({ debt, savings, savingsPerTaxpayer, progressToGoal, totalInitiatives, countdownDays }) {
    const wrapper = document.getElementById("us-debt-container");
    if (!wrapper) return;
    
    wrapper.innerHTML = `
      <div class="us-debt-container">
        <div class="us-debt">
          <div class="national-debt">DAYS UNTIL JULY 4, 2026</div>
          <div class="debt-amount">${countdownDays} Days</div>
        </div>
        <div class="us-debt">
          <div class="national-debt">NATIONAL DEBT</div>
          <div class="debt-amount">$${(debt / 1000000000000).toFixed(2)}T</div>
        </div>
        <div class="us-debt">
          <div class="national-debt">TAXPAYER DOLLARS SAVED</div>
          <div class="debt-amount">$${(savings / 1000000000).toFixed(2)}B</div>
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${progressToGoal.toFixed(2)}%;"></div>
      </div>
      <div class="progress-label">$0 → $1T → $2T</div>
    `;
  },

getDom: function () {
  var wrapper = document.createElement("div");
  wrapper.className = "MMM-DogeClock";

  if (!this.dogeData) {
    wrapper.innerHTML = "Loading DogeClock...";
    return wrapper;
  }

  wrapper.innerHTML = `
    <h1>${this.dogeData.diffDays} Days</h1>
    <p>until July 4th, 2026</p>
    <h2>$${(this.dogeData.totalSavings / 1e9).toFixed(2)}B</h2>
    <p>Taxpayer Dollars Saved*</p>
    <div class="container">
      <p class="highlight">$${(this.dogeData.totalSavings / 1e9).toFixed(2)}B</p>
      <p>Total Savings</p>
      <p class="highlight">${this.dogeData.progressPercentage}%</p>
      <p>Progress to Goal</p>
      <p class="highlight">$${this.dogeData.savingsPerTaxpayer.toFixed(2)}</p>
      <p>Savings per Taxpayer</p>
      <p class="highlight">${this.dogeData.totalInitiatives}</p>
      <p>Total Initiatives</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${this.dogeData.progressPercentage}%;"></div>
      </div>
    </div>
  `;
  return wrapper;
}

});
