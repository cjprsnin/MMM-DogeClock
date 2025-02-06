Module.register("MMM-DogeClock", {
  defaults: {
    updateInterval: 60000, // Update every 60 seconds
  },

  start: function () {
    this.dogeData = null;
    this.sendSocketNotification("GET_DOGE_DATA");
    this.scheduleUpdate();
  },

  getStyles: function () {
    return ["MMM-DogeClock.css"];
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "DOGE_DATA") {
      this.dogeData = payload;
      this.updateDom();
    }
  },

  scheduleUpdate: function () {
    var self = this;
    setInterval(() => {
      self.sendSocketNotification("GET_DOGE_DATA");
    }, this.config.updateInterval);
  },

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.className = "MMM-DogeClock";
    
    if (!this.dogeData) {
      wrapper.innerHTML = "Loading DogeClock...";
      return wrapper;
    }
    
    wrapper.innerHTML = `
      <h1>${this.dogeData.days_left} Days</h1>
      <p>until ${this.dogeData.target_date}</p>
      <h2>$${this.dogeData.total_savings}B</h2>
      <p>Taxpayer Dollars Saved*</p>
      <div class="container">
        <p class="highlight">$${this.dogeData.total_savings}B</p>
        <p>Total Savings</p>
        <p class="highlight">${this.dogeData.progress}%</p>
        <p>Progress to Goal</p>
        <p class="highlight">$${this.dogeData.savings_per_taxpayer}</p>
        <p>Savings per Taxpayer</p>
        <p class="highlight">${this.dogeData.total_initiatives}</p>
        <p>Total Initiatives</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${this.dogeData.progress}%;"></div>
        </div>
      </div>
    `;
    return wrapper;
  }
});
