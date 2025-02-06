Module.register("MMM-DebtTicker", {
  defaults: {
    debtApiUrl: "https://cryptic-waters-29117-09da23841b14.herokuapp.com/api/services/api/fiscal_service/v2/accounting/od/debt_to_penny",
    updateInterval: 60000,
    debtIncreasePerSecond: 1,
    animationSpeed: 1000,
    maxHistory: 5 // Keep only last 5 entries
  },

  start() {
    this.debtHistory = [];
    this.sendSocketNotification('INIT', this.config);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "debt-ticker";
    
    if (this.debtHistory.length === 0) {
      wrapper.innerHTML = '<div class="loading">Loading debt data...</div>';
      return wrapper;
    }

    const currentDebt = this.calculateCurrentDebt();
    wrapper.innerHTML = `
      <div class="debt-container">
        <div class="debt-label">US National Debt</div>
        <div class="debt-amount">$${this.formatNumber(currentDebt)}</div>
        ${this.createTrendIndicator()}
      </div>
    `;

    return wrapper;
  },

  formatNumber(num) {
    return num.toLocaleString('en-US', { 
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    });
  },

  createTrendIndicator() {
    if (this.debtHistory.length < 2) return '';
    const current = this.debtHistory[this.debtHistory.length - 1];
    const previous = this.debtHistory[this.debtHistory.length - 2];
    const trend = current > previous ? '▲' : '▼';
    return `<div class="debt-trend ${current > previous ? 'rising' : 'falling'}">${trend}</div>`;
  },

  calculateCurrentDebt() {
    const { baseDebt, timestamp } = this.debtHistory.slice(-1)[0];
    const secondsElapsed = (Date.now() - timestamp) / 1000;
    return baseDebt + (secondsElapsed * this.config.debtIncreasePerSecond);
  },

  socketNotificationReceived(notification, payload) {
    switch(notification) {
      case 'DEBT_UPDATE':
        this.debtHistory.push({
          baseDebt: payload,
          timestamp: Date.now()
        });
        // Keep only recent history
        if (this.debtHistory.length > this.config.maxHistory) {
          this.debtHistory.shift();
        }
        break;
        
      case 'ERROR':
        this.debtHistory = [];
        break;
    }
    
    this.updateDom(this.config.animationSpeed);
  }
});
