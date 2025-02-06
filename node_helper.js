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
      const response = await axios.get(this.config.debtApiUrl);
      const debtData = response.data.data[0].tot_pub_debt_out_amt;
      const baseDebt = parseFloat(debtData.replace(/,/g, ''));
      this.sendSocketNotification('DEBT_UPDATE', baseDebt);
    } catch (error) {
      console.error('Debt fetch error:', error);
      this.sendSocketNotification('ERROR', 'Failed to load debt data');
    }
  }
});
