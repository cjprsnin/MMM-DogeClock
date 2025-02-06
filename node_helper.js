var NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-DogeClock helper started...");
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_DOGE_DATA") {
      this.fetchDogeData();
    }
  },

  fetchDogeData: function () {
    var self = this;
    var url = "https://dogegov.com/dogeclock";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        self.sendSocketNotification("DOGE_DATA", data);
      })
      .catch((error) => {
        console.error("MMM-DogeClock: Error fetching data", error);
      });
  }
});
