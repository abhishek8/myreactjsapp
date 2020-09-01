import axios from "axios";

const AppUtils = {
  getLocalItem(itemName) {
    let sessionVal = sessionStorage.getItem(itemName);
    if (sessionVal) return sessionVal;
    let localVal = localStorage.getItem(itemName);
    if (localVal) return localVal;
    return null;
  },

  getQueryParamValue(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase();
    name = name.toLowerCase().replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },

  getShortText(text, length = 100) {
    if (text.length > length) return text.substring(0, length - 3) + "...";
    else if (text.length === 0) return text + " " + "\xa0".repeat(length);
    else {
      return text;
    }
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  checkImageExists(imgURL) {
    return axios
      .head(imgURL, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => res.status !== 404)
      .catch((err) => false);
  },

  formatDateString(date) {
    const formattedDate = new Date(date).toDateString();
    const [, month, day, year] = formattedDate.split(" ");
    const ddMmmYyyy = `${day}-${month}-${year}`;
    return ddMmmYyyy;
  },

  getPublishedDateString(date) {
    const publishedDate = new Date(date);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - publishedDate);
    let dateString = "";

    if (diffTime < 3600000)
      dateString = Math.floor(diffTime / 60000).toString() + " minutes ago";
    else if (diffTime < 86400000)
      dateString = Math.floor(diffTime / 3600000).toString() + " hours ago";
    else if (diffTime < 604800000)
      dateString = Math.floor(diffTime / 86400000).toString() + " days ago";
    else if (diffTime < 2592000000)
      dateString = Math.floor(diffTime / 604800000).toString() + " weeks ago";
    else if (diffTime < 31104000000)
      dateString = Math.floor(diffTime / 2592000000).toString() + " months ago";
    else
      dateString = Math.floor(diffTime / 31104000000).toString() + " years ago";

    dateString =
      dateString.charAt(0) === "1" ? dateString.replace("s", "") : dateString;

    return dateString;
  },
};

export default AppUtils;
