// MMM-DebtTicker.js
Module.register("MMM-DogeClock", {
  defaults: {
    debtApiUrl: "https://cryptic-waters-29117-09da23841b14.herokuapp.com/api/services/api/fiscal_service/v2/accounting/od/debt_to_penny",
    updateInterval: 60000, // 1 minute
    debtIncreasePerSecond: 1,
    animationSpeed: 1000
  },

  start() {
    this.data = {
      baseDebt: 0,
      lastUpdated: Date.now(),
      error: null
    };
    this.sendSocketNotification('INIT', this.config);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "debt-ticker";
    
    if (this.data.error) {
      wrapper.innerHTML = `<div class="error">${this.data.error}</div>`;
      return wrapper;
    }

    wrapper.innerHTML = `
      <div class="debt-container">
        <div class="debt-label">US National Debt</div>
        <div class="debt-amount">$${this.calculateCurrentDebt().toLocaleString()}</div>
      </div>
    `;

    return wrapper;
  },

  calculateCurrentDebt() {
    if (!this.data.baseDebt) return 0;
    const secondsElapsed = (Date.now() - this.data.lastUpdated) / 1000;
    return this.data.baseDebt + (secondsElapsed * this.config.debtIncreasePerSecond);
  },

  socketNotificationReceived(notification, payload) {
    switch(notification) {
      case 'DEBT_UPDATE':
        this.data.baseDebt = payload;
        this.data.lastUpdated = Date.now();
        break;
        
      case 'ERROR':
        this.data.error = payload;
        break;
    }
    
    this.updateDom(this.config.animationSpeed);
  }
});
