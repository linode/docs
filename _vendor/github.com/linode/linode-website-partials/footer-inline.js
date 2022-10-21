(() => {
  // src/js/Footer/storage.js
  var now = new Date();
  function daysFromNow(days = 0) {
    let d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1e3);
    return d;
  }
  function expireFromLocal(name) {
    if (localStorage.getItem(name) === null)
      return;
    let now2 = new Date(), exp_value = localStorage.getItem(`${name}_exp`), exp_date = exp_value !== null ? new Date(exp_value) : now2;
    if (isNaN(exp_date)) {
      localStorage.removeItem(`${name}_exp`);
      return;
    }
    if (now2 < exp_date)
      return;
    localStorage.removeItem(name);
    localStorage.removeItem(`${name}_exp`);
  }
  function saveToLocal(name, value, exp_date = null, overwrite = true) {
    let saved = localStorage.getItem(name);
    if (saved !== null && saved !== value && !overwrite)
      return;
    localStorage.setItem(name, value);
    if (exp_date !== null) {
      localStorage.setItem(`${name}_exp`, exp_date.toUTCString());
    }
  }
  function saveToCookie(name, value, exp_date = null, overwrite = true) {
    value = encodeURIComponent(value);
    if (document.cookie.indexOf(`${name}=`) >= 0 && document.cookie.indexOf(`${name}=${value}`) < 0 && !overwrite)
      return;
    let expires = exp_date !== null ? `expires=${exp_date.toUTCString()}; ` : "";
    document.cookie = `${name}=${value}; domain=.linode.com; ${expires}path=/; secure; samesite=lax; `;
  }
  function storeParams(args) {
    let url = new URL(window.location.href), param_value = url.searchParams.get(args.param);
    if (args.local)
      expireFromLocal(args.local);
    if (!param_value)
      return;
    if (args.regex && !param_value.match(args.regex))
      return;
    let exp_date = args.days ? daysFromNow(args.days) : null;
    if (args.local)
      saveToLocal(args.local, param_value, exp_date);
    if (args.cookie)
      saveToCookie(args.cookie, param_value, exp_date);
  }

  // src/js/Footer/referral-codes.js
  storeParams({
    "param": "r",
    "cookie": "referralCode",
    "days": 14,
    "regex": /^[0-9a-f]{40}$/i
  });
  var cookies = Object.fromEntries(document.cookie.split(/\s*;\s*/).map((c) => c.split(/\s*=\s*/)));
  var body = document.getElementsByTagName("body")[0];
  if (cookies.referralCode) {
    body.classList.add("js-is-referral");
  }

  // src/js/Footer/promo-codes.js
  storeParams({
    "param": "promo",
    "cookie": "promoCode",
    "local": "promoCode",
    "days": 1,
    "regex": /^[0-9a-z-_]*$/i
  });
  storeParams({
    "param": "promo_length",
    "cookie": "promoLength",
    "local": "promoLength",
    "days": 1,
    "regex": /^[0-9]*$/
  });
  storeParams({
    "param": "promo_value",
    "cookie": "promoValue",
    "local": "promoValue",
    "days": 1,
    "regex": /^[0-9]*$/
  });
  function updatePromoCodes(promo, should_override) {
    if (typeof promo !== "string" || promo.match(/[^a-zA-Z0-9_\-]/))
      return;
    let $links = Array.from(document.querySelectorAll('a[href*="login.linode.com"]'));
    $links = $links.filter(($link) => {
      let link_url = new URL($link.href);
      if (!link_url.pathname.match(/\/signup/))
        return false;
      if (link_url.searchParams.has("promo")) {
        if (!should_override)
          return false;
        if (!$link.hasAttribute("data-promo-override"))
          return false;
      }
      return true;
    });
    $links.forEach(($link) => {
      let link_url = new URL($link.href);
      if (promo) {
        link_url.searchParams.set("promo", promo);
      } else {
        link_url.searchParams.delete("promo");
      }
      $link.href = link_url.toString();
    });
  }
  var cookies2 = Object.fromEntries(document.cookie.split(/\s*;\s*/).map((c) => c.split(/\s*=\s*/)));
  var localPromoCode = localStorage.getItem("promoCode");
  if (cookies2.referralCode) {
    updatePromoCodes("", true);
  } else if (localPromoCode || cookies2.promoCode) {
    updatePromoCodes(localPromoCode || cookies2.promoCode, true);
  } else {
    fetch("https://www.linode.com/wp-json/linode/v1/promo-data").then((response) => {
      if (!response.ok)
        throw new Error("");
      return response;
    }).then((response) => response.json()).then((data) => {
      if (data.global && data.global.promo_code) {
        updatePromoCodes(data.global.promo_code, false);
      }
    }).catch((error) => {
    });
  }
})();
