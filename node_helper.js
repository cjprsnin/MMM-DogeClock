const NodeHelper = require("node_helper");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node_helper for MMM-DogeClock");

    // Fetch data periodically
    this.scheduleUpdate();
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_DOGE_DATA") {
      console.log("Received GET_DOGE_DATA notification with payload:", payload);
      this.fetchDogeData(payload.targetDate);
    }
  },

  scheduleUpdate: function () {
    this.fetchDogeData(); // Fetch immediately
    setInterval(() => {
      this.fetchDogeData();
    }, 60000); // Fetch every 60 seconds
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

      console.log("Fetched DOGE data:", dogeData);
      this.sendSocketNotification("DOGE_DATA", dogeData);
    } catch (error) {
      console.error("Error fetching DOGE data:", error);
    }
  },
});
