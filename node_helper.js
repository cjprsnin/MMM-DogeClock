const NodeHelper = require("node_helper");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node_helper for MMM-DogeClock");
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_DOGE_DATA") {
      this.fetchDogeData(payload.targetDate);
    }
  },

  fetchDogeData: async function (targetDate) {
    try {
      const response = await axios.get("https://www.doge-tracker.com/embed");
      const $ = cheerio.load(response.data);

      // Extract data from the page
      const totalSavingsText = $(".total-savings").text().replace(/[^0-9.]/g, "");
      const savingsPerTaxpayerText = $(".savings-per-taxpayer").text().replace(/[^0-9.]/g, "");
      const progressToGoalText = $(".progress-to-goal").text().replace(/[^0-9.]/g, "");
      const totalInitiativesText = $(".total-initiatives").text().replace(/[^0-9]/g, "");

      const totalSavings = parseFloat(totalSavingsText) * 1e9; // Convert from billions
      const savingsPerTaxpayer = parseFloat(savingsPerTaxpayerText);
      const progressToGoal = parseFloat(progressToGoalText);
      const totalInitiatives = parseInt(totalInitiativesText, 10);

      // Calculate days until target date
      const currentDate = new Date();
      const target = new Date(targetDate);
      const diffTime = Math.abs(target - currentDate);
      const countdownDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const dogeData = {
        totalSavings,
        savingsPerTaxpayer,
        progressToGoal,
        totalInitiatives,
        countdownDays,
      };

      this.sendSocketNotification("DOGE_DATA", dogeData);
    } catch (error) {
      console.error("Error fetching DOGE data:", error);
    }
  },
});
