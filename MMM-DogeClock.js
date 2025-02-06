// MMM-GovEfficiency.js
Module.register("MMM-DogeClock", {
  defaults: {
    targetDate: "2026-07-04",
    initialSavings: 2290000000, // $2.29B
    dailySavingsRate: 1250000, // $1.25M/day growth
    totalTaxpayers: 150000000, // 150M taxpayers
    goal: 1000000000000, // $1T goal
    updateInterval: 1000, // Update every second
    animationSpeed: 1000
  },

  start() {
    this.daysRemaining = this.calculateDaysRemaining();
    this.currentSavings = this.config.initialSavings;
    this.lastUpdate = Date.now();
    this.totalInitiatives = 43;
    this.timer = setInterval(() => this.updateMetrics(), this.config.updateInterval);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "efficiency-tracker";

    wrapper.innerHTML = `
      <div class="header">Department of Government Efficiency Live Tracker</div>
      
      <div class="grid-container">
        <div class="metric-box">
          <div class="metric-value">${this.daysRemaining}</div>
          <div class="metric-label">Days until ${this.config.targetDate}</div>
        </div>
        
        <div class="metric-box highlight">
          <div class="metric-value">$${this.formatNumber(this.currentSavings, true)}</div>
          <div class="metric-label">Taxpayer Dollars Saved*</div>
        </div>

        <div class="metric-box">
          <div class="metric-value">$${this.formatNumber(this.currentSavings, true)}</div>
          <div class="metric-label">Total Savings</div>
        </div>

        <div class="metric-box">
          <div class="metric-value">$${this.calculatePerTaxpayer()}</div>
          <div class="metric-label">Savings per Taxpayer</div>
        </div>

        <div class="metric-box">
          <div class="metric-value">${this.calculateProgress()}%</div>
          <div class="metric-label">Progress to Goal</div>
          ${this.createProgressBar()}
        </div>

        <div class="metric-box">
          <div class="metric-value">${this.totalInitiatives}</div>
          <div class="metric-label">Total Initiatives</div>
        </div>
      </div>

      <div class="progress-scale">
        <span>$0</span>
        <span>$${this.formatNumber(this.config.goal, true)} Goal</span>
      </div>
    `;

    return wrapper;
  },

  formatNumber(num, isBillions = false) {
    if (isBillions) {
      return (num / 1000000000).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'B';
    }
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  },

  calculateDaysRemaining() {
    const target = new Date(this.config.targetDate);
    const today = new Date();
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  },

  calculatePerTaxpayer() {
    return (this.currentSavings / this.config.totalTaxpayers).toFixed(2);
  },

  calculateProgress() {
    return ((this.currentSavings / this.config.goal) * 100).toFixed(3);
  },

  createProgressBar() {
    const progress = this.calculateProgress();
    return `
      <div class="progress-container">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>
    `;
  },

  updateMetrics() {
    const now = Date.now();
    const hoursPassed = (now - this.lastUpdate) / (1000 * 60 * 60);
    this.currentSavings += this.config.dailySavingsRate * (hoursPassed / 24);
    this.daysRemaining = this.calculateDaysRemaining();
    this.lastUpdate = now;
    this.updateDom(this.config.animationSpeed);
  },

  notificationReceived(notification) {
    if (notification === "DOM_OBJECTS_CREATED") {
      this.updateMetrics();
    }
  }
});
