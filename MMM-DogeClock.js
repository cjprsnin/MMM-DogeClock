Module.register("MMM-DogeClock", {
  defaults: {
    updateInterval: 60000, // Update every 60 seconds
  },

  start: function () {
    this.dogeData = null;
    this.getDogeClockData();
    this.scheduleUpdate();
  },

  getDogeClockData: function () {
    var self = this;
    var url = "https://dogegov.com/dogeclock";
    var retry = true;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        self.dogeData = data;
        self.updateDom();
      })
      .catch((error) => {
        console.error("MMM-DogeClock: Error fetching data", error);
        if (retry) {
          setTimeout(() => self.getDogeClockData(), 10000);
        }
      });
  },

  scheduleUpdate: function () {
    var self = this;
    setInterval(() => {
      self.getDogeClockData();
    }, this.config.updateInterval);
  },
  
  getStyles: function () {
  return ["MMM-DogeClock.css"];
},

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.style.textAlign = "center";
    wrapper.style.color = "white";
    
    if (!this.dogeData) {
      wrapper.innerHTML = "Loading DogeClock...";
      return wrapper;
    }
    
    wrapper.innerHTML = `
      <h1>${this.dogeData.days_left} Days</h1>
      <p>until ${this.dogeData.target_date}</p>
      <h2>$${this.dogeData.total_savings}B</h2>
      <p>Taxpayer Dollars Saved*</p>
      <div style="background: #222; padding: 10px; border-radius: 10px;">
        <p style="color: #0f0; font-size: 1.5em;">$${this.dogeData.total_savings}B</p>
        <p>Total Savings</p>
        <p style="color: #0f0;">${this.dogeData.progress}%</p>
        <p>Progress to Goal</p>
        <p style="color: #0f0;">$${this.dogeData.savings_per_taxpayer}</p>
        <p>Savings per Taxpayer</p>
        <p style="color: #0f0;">${this.dogeData.total_initiatives}</p>
        <p>Total Initiatives</p>
        <div style="width: 100%; background: #444; height: 10px; border-radius: 5px; overflow: hidden;">
          <div style="width: ${this.dogeData.progress}%; background: #0f0; height: 100%;"></div>
        </div>
      </div>
    `;
    return wrapper;
  }
});
