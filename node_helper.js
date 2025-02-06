var NodeHelper = require("node_helper");

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
      const response = await fetch("https://dogegov.com/dogeclock");
      const data = await response.json();
      this.sendSocketNotification("DOGE_DATA", data);
    } catch (error) {
      console.error("MMM-DogeClock: Error fetching data", error);
    }
  }
});
