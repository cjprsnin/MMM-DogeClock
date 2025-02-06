// node_helper.js
const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
  start() {
    this.config = null;
    this.debtInterval = null;
  },

  socketNotificationReceived(notification, payload) {
    if (notification === 'INIT') {
      this.config = payload;
      this.startFetching();
    }
  },

  startFetching() {
    // Initial fetch
    this.fetchDebtData();
    
    // Set up interval
    this.debtInterval = setInterval(() => {
      this.fetchDebtData();
    }, this.config.updateInterval);
  },

  async fetchDebtData() {
    try {
      console.log("[DebtTicker] Fetching debt data from:", this.config.debtApiUrl);
      const response = await axios.get(this.config.debtApiUrl);
      console.log("[DebtTicker] API Response:", response.data);
      const debtData = response.data.data[0].tot_pub_debt_out_amt;
      const baseDebt = parseFloat(debtData.replace(/,/g, ''));
      this.sendSocketNotification('DEBT_UPDATE', baseDebt);
    } catch (error) {
      console.error("[DebtTicker] Full error:", error.config); // Log full error
      this.sendSocketNotification('ERROR', 'Failed to load debt data');
    }
  }
});
