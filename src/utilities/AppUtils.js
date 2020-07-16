import axios from "axios";

const AppUtils = {
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
};

export default AppUtils;
