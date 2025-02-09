const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-DogeClock helper started...");
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_DOGE_DATA") {
      this.fetchDogeData();
    }
  },

  fetchDogeData: async function () {
    try {
      const response = await fetch("https://www.doge-tracker.com/embed");
      const body = await response.text();
      const $ = cheerio.load(body);

      // Extract data from the page
      const diffDays = parseInt($("#diffDays").text().trim());
      const totalSavings = parseFloat($("#totalSavings").text().replace(/[^0-9.-]+/g, ""));
      const savingsPerTaxpayer = parseFloat($("#savingsPerTaxpayer").text().replace(/[^0-9.-]+/g, ""));
      const progressPercentage = parseFloat($("#progressPercentage").text().replace(/[^0-9.-]+/g, ""));
      const totalInitiatives = parseInt($("#totalInitiatives").text().trim());

      const dogeData = {
        diffDays,
        totalSavings,
        savingsPerTaxpayer,
        progressPercentage,
        totalInitiatives
      };

      this.sendSocketNotification("DOGE_DATA", dogeData);
    } catch (error) {
      console.error("MMM-DogeClock: Error fetching data", error);
    }
  }
});
