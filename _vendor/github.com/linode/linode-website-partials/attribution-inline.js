(() => {
  // src/js/attribution-inline.js
  function getCookie(e, o) {
    return null == (o = RegExp("(^|; )" + encodeURIComponent(e) + "=([^;]*)").exec(document.cookie)) ? void 0 : o[2] ? o[2] : void 0;
  }
  function setCookie(firstLast, cookieName, cookieValue) {
    var cS = "; max-age=31536000; domain=.linode.com; path=/";
    document.cookie = firstLast + cookieName + "=" + cookieValue + cS;
  }
  var parseQueryString = function() {
    var e = window.location.search.toLowerCase(), r = {};
    return e.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function(e2, n, a, o) {
      r[n] = o;
    }), r;
  };
  var pFA = parseQueryString();
  var aV = {
    FullQuery: window.location.search || getCookie("atr_lastFullQuery") || "",
    GA_ID: getCookie("_ga") || getCookie("atr_lastGA_ID") || getCookie("atr_firstGA_ID") || "",
    GCLID: getCookie("_gcl_aw") || getCookie("atr_lastGCLID") || getCookie("atr_firstGCLID") || "",
    Custom1: "true",
    Custom5: getCookie("_fbc") || getCookie("atr_lastCustom5") || getCookie("atr_firstCustom5") || "",
    Custom4: getCookie("_fbp") || getCookie("atr_lastCustom4") || getCookie("atr_firstCustom4") || "",
    Custom3: window.location.pathname || "",
    Path: window.location.pathname || "",
    UTM_Campaign: pFA["utm_campaign"] || getCookie("atr_lastUTM_Campaign") || getCookie("atr_firstUTM_Campaign") || "",
    UTM_Source: pFA["utm_source"] || getCookie("atr_lastUTM_Source") || getCookie("atr_firstUTM_Source") || "",
    UTM_Medium: pFA["utm_medium"] || getCookie("atr_lastUTM_Medium") || getCookie("atr_firstUTM_Medium") || "",
    UTM_Content: pFA["utm_content"] || getCookie("atr_lastUTM_Content") || getCookie("atr_firstUTM_Content") || "",
    UTM_Term: pFA["utm_term"] || getCookie("atr_lastUTM_Term") || getCookie("atr_firstUTM_Term") || ""
  };
  var aVEvery = ["Custom1", "Custom3", "Custom4", "Custom5", "GA_ID", "GCLID"];
  if (document.cookie.indexOf("atr1_sessionValsStores=") == -1 && (window.location.search.indexOf("utm") != -1 || window.location.search.indexOf("gclid") != -1 || document.cookie.indexOf("_fbp=") != -1 || document.cookie.indexOf("_fbc=") != -1 || document.cookie.indexOf("_gcl_aw=") != -1)) {
    document.cookie = "atr1_sessionValsStores=true; expires=0; domain=.linode.com; path=/";
    if (document.cookie.indexOf("atr1_firstSource=") == -1) {
      for (key in aV) {
        if (aV.hasOwnProperty(key)) {
          setCookie("atr_first", key, aV[key]);
        }
      }
      setCookie("atr1_first", "Source", "true");
      document.cookie = "atr1_isFirst=true; expires=0; domain=.linode.com; path=/";
    }
    for (key in aV) {
      if (aV.hasOwnProperty(key)) {
        setCookie("atr_last", key, aV[key]);
      }
    }
  } else {
    for (i = 0; i < aVEvery.length; i++) {
      if (document.cookie.indexOf("atr1_firstSource=") == -1 || document.cookie.indexOf("atr1_isFirst=") != -1) {
        setCookie("atr_first", aVEvery[i], aV[aVEvery[i]]);
      }
      setCookie("atr_last", aVEvery[i], aV[aVEvery[i]]);
    }
  }
  var key;
  var i;
})();
