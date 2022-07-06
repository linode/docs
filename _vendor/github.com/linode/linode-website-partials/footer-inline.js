(() => {
  // src/js/Footer/cookies.js
  function paramsToCookies(args) {
    var url = new URL(window.location.href);
    let pval = url.searchParams.get(args.param);
    if (pval != null && pval.length) {
      let d = new Date();
      d.setTime(d.getTime() + args.days * 24 * 60 * 60 * 1e3);
      let expires = d.toUTCString();
      pval = encodeURIComponent(pval);
      if (document.cookie.indexOf(`${args.cookie}=${pval}`) < 0) {
        document.cookie = `${args.cookie}=${pval} ;domain=.linode.com ;expires=${expires} ;path=/ ;secure ;samesite=lax`;
      }
    }
  }

  // src/js/Footer/referral-codes.js
  paramsToCookies({
    "param": "r",
    "cookie": "referralCode",
    "days": 14
  });

  // src/js/Footer/promo-codes.js
  paramsToCookies({
    "param": "promo",
    "cookie": "promoCode",
    "days": 1
  });
  paramsToCookies({
    "param": "promo_length",
    "cookie": "promoLength",
    "days": 1
  });
  paramsToCookies({
    "param": "promo_value",
    "cookie": "promoValue",
    "days": 1
  });
  function updateSignupLinks(promo, should_override) {
    if (!promo)
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
      link_url.searchParams.set("promo", promo);
      $link.href = link_url.toString();
    });
  }
  function checkForPromoCodes() {
    const cookies = Object.fromEntries(document.cookie.split(/\s*;\s*/).map((c) => c.split(/\s*=\s*/)));
    if (cookies.promoCode) {
      updateSignupLinks(cookies.promoCode, true);
      return;
    }
    fetch("https://www.linode.com/wp-json/linode/v1/promo-codes").then((response) => {
      if (!response.ok)
        throw new Error("");
      return response;
    }).then((response) => response.json()).then((data) => updateSignupLinks(data.promo_code, false)).catch((error) => {
    });
  }
  checkForPromoCodes();
})();
