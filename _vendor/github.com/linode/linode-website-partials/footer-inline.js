(function () {
  'use strict';

  function paramsToCookies(args) {
    var url = new URL(window.location.href); // if param found, stash in cookies (don't overwrite)

    let pval = url.searchParams.get(args.param);

    if (pval != null && pval.length) {
      let d = new Date();
      d.setTime(d.getTime() + args.days * 24 * 60 * 60 * 1000);
      let expires = d.toUTCString();
      pval = encodeURIComponent(pval);

      if (document.cookie.indexOf("".concat(args.cookie, "=").concat(pval)) < 0) {
        document.cookie = "".concat(args.cookie, "=").concat(pval, " ;domain=.linode.com ;expires=").concat(expires, " ;path=/ ;secure ;samesite=lax");
      }
    }
  }

  paramsToCookies({
    'param': 'r',
    'cookie': 'referralCode',
    'days': 14
  });

  paramsToCookies({
    'param': 'promo',
    'cookie': 'promoCode',
    'days': 1
  });
  paramsToCookies({
    'param': 'promo_length',
    'cookie': 'promoLength',
    'days': 1
  });
  paramsToCookies({
    'param': 'promo_value',
    'cookie': 'promoValue',
    'days': 1
  }); // add query variable to all links to login.linode.com

  function updateSignupLinks(promo) {
    // find all login URL links
    let $links = Array.from(document.querySelectorAll('a[href*="login.linode.com"]')); // filter the list

    $links = $links.filter($link => {
      let link_url = new URL($link.href);
      return link_url.pathname.match(/\/signup/) // must have `signup` in the path
      && ($link.hasAttribute('data-promo-override') // ... and must either be overridable
      || !link_url.searchParams.has('promo') // ... or NOT already have `promo` query arg
      );
    }); // iterate again

    $links.forEach($link => {
      // append promo code
      let link_url = new URL($link.href);
      link_url.searchParams.set('promo', promo);
      $link.href = link_url.toString();
    });
  } // look for saved cookie promo value


  let cookies = Object.fromEntries(document.cookie.split(/\s*;\s*/).map(c => c.split(/\s*=\s*/)));

  if (cookies.promoCode) {
    updateSignupLinks(cookies.promoCode);
  }

})();
