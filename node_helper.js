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
    this.fetchDebtData();
    this.debtInterval = setInterval(() => this.fetchDebtData(), this.config.updateInterval);
  },

  async fetchDebtData() {
    try {
      const response = await axios.get(this.config.debtApiUrl);
      
      // Validate response structure
      if (!response.data?.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid API response structure');
      }

      // Get most recent entry
      const latestEntry = response.data.data.reduce((newest, current) => {
        const currentDate = new Date(current.record_date);
        return (!newest || currentDate > new Date(newest.record_date)) ? current : newest;
      }, null);

      if (!latestEntry?.tot_pub_debt_out_amt) {
        throw new Error('No valid debt amount found in response');
      }

      const baseDebt = parseFloat(latestEntry.tot_pub_debt_out_amt.replace(/,/g, ''));
      this.sendSocketNotification('DEBT_UPDATE', baseDebt);

    } catch (error) {
      console.error('[DebtTicker] Fetch error:', error.message);
      this.sendSocketNotification('ERROR', `API Error: ${error.message}`);
    }
  }
});
