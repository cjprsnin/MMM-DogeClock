Module.register("MMM-DogeClock", {
  defaults: {
    url: "https://dogegov.com/dogeclock.html",
    width: "100%",
    height: "300px"
  },
getDom: function() {
  const iframe = document.createElement("iframe");
  iframe.src = this.config.url;
  iframe.style.width = this.config.width;
  iframe.style.height = this.config.height;
  iframe.style.border = "none";
  iframe.setAttribute("scrolling", "no"); // Disable scrollbars
  return iframe;
}
