(() => {
  // src/js/Main/main-menu.js
  var $html = document.querySelector("html");
  var $header;
  var mount = function() {
    $header = document.querySelector(".c-site-header");
    if (!$header) return;
    bindEvents();
    setActiveMenuItem();
  };
  var setScrollY = function() {
    document.documentElement.style.setProperty("--site-scroll-y", window.scrollY + "px");
  };
  var bindEvents = function() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setScrollY);
    } else {
      setScrollY();
    }
    window.addEventListener("scroll", setScrollY);
    $header.addEventListener("toggle:on", function(event) {
      setHtmlScrollState(false);
    });
    $header.addEventListener("toggle:off", function(event) {
      setHtmlScrollState(true);
    });
    document.addEventListener("keyup", function(event) {
      switch (event.keyCode) {
        case 27:
          $header.querySelectorAll(".active").forEach(($item) => $item.classList.remove("active"));
          document.activeElement.blur();
          setHtmlScrollState(true);
          break;
      }
    });
  };
  var setActiveMenuItem = function() {
    var current_path = window.location.pathname;
    if ("/" === current_path) {
      return;
    } else if (current_path.match(/^\/community\/questions\/.+/)) {
      current_path = "/community/questions/";
    } else if (current_path.match(/^\/docs\/.+/)) {
      current_path = "/docs/";
    } else if (current_path.match(/^\/blog|marketplace\/.+/)) {
      current_path = current_path.replace(/^\/([^\/]+)\/.+/, "/$1/");
    } else if (current_path.match(/^\/event\/.+/)) {
      current_path = "/events/";
    } else if (current_path.match(/^\/content|content-type|featuring|resources|series\/.+/)) {
      current_path = "/resources/";
    } else if (current_path.match(/^\/media\-coverage|press\-release\/.+/)) {
      current_path = "/company/press/";
    }
    var $current_links = $header.querySelectorAll(':scope a.o-menu__link[href*="' + current_path + '"');
    if (!$current_links) return;
    Array.from($current_links).forEach(($link) => {
      if (!$link.getAttribute("href").split(/[?#]/)[0].endsWith(current_path)) return;
      $link.classList.add("current");
      const $sub_menu = $link.closest(".c-submenu");
      if (null === $sub_menu) return;
      const $trigger_links = $header.querySelectorAll(
        `:scope [data-toggle="#${$sub_menu.id}"]`
      );
      Array.from($trigger_links).forEach(($trigger) => $trigger.classList.add("current"));
    });
  };
  var setHtmlScrollState = function(state) {
    $html.style.overflow = state ? "" : "hidden";
  };
  if (!$html.classList.contains("fl-builder-edit")) {
    mount();
  }
  document.addEventListener("turbolinks:render", function(event) {
    mount();
  });

  // src/js/Main/handle-fetch-errors.js
  function handleFetchErrors(response) {
    if (!response.ok) {
      let errorMessage = "";
      if (response.statusText) {
        errorMessage = response.statusText;
      } else if (response.status === 404) {
        errorMessage = "Resource not found";
      } else {
        errorMessage = "Problem fetching resource";
      }
      throw new Error(`${errorMessage} (${response.url})`);
    }
    return response;
  }

  // src/js/Main/i18n.js
  var languages = ["de", "es", "fr", "it", "ja", "ko", "pt-br", "pt", "zh"];
  function getLanguageString() {
    let lang = document.documentElement.lang;
    if (lang && languages.includes(lang)) {
      return lang;
    } else {
      return "";
    }
  }

  // src/js/Main/safe-html.js
  function safeHTML(input, allow_tags = ["b", "br", "em", "i", "span", "strong", "u"]) {
    let tmp = document.createElement("div");
    tmp.textContent = input;
    let output = tmp.innerHTML;
    let allow_regex = new RegExp(`&lt;(/?(${allow_tags.join("|")}))&gt;`, "gi");
    output = output.replace(allow_regex, "<$1>");
    return output;
  }

  // src/js/Main/header-featured.js
  var $html2;
  var mount2 = function() {
    let api_url = "https://www.linode.com/wp-json/linode/v1/header-featured", lang = getLanguageString();
    if (lang) {
      api_url = `https://www.linode.com/${lang}/wp-json/linode/v1/header-featured?lang=${lang}`;
    }
    fetch(api_url).then(handleFetchErrors).then((response) => response.json()).then((data) => updateDOM(data)).catch((error) => console.log(error));
  };
  var updateDOM = function(data) {
    data.forEach((item) => {
      let $slot = document.querySelector('.c-site-header [data-featured="' + item.slot + '"]');
      if (!$slot) return;
      let $feature = generateFeature(item);
      if (!$feature) return;
      while ($slot.firstChild) {
        $slot.removeChild($slot.firstChild);
      }
      $slot.appendChild($feature);
    });
  };
  var generateImage = function(data) {
    let $img = document.createElement("img");
    $img.src = data.src;
    $img.width = data.width;
    $img.height = data.height;
    $img.loading = "lazy";
    $img.fetchPriority = "low";
    if (data.alt) {
      $img.alt = data.alt;
    }
    if (data.srcset) {
      $img.srcset = data.srcset;
    }
    if (data.sizes) {
      $img.sizes = data.sizes;
    }
    return $img;
  };
  var generateFeature = function(data) {
    let $base = document.createElement("div"), $h6 = document.createElement("h6"), $a = document.createElement("a"), $text = document.createElement("div"), $headline = document.createElement("div"), $excerpt = document.createElement("div"), $button = document.createElement("span"), $style = document.createElement("style");
    $h6.textContent = data.eyebrow;
    $a.classList.add("c-featured");
    $a.id = `c-featured--${data.slot}`;
    $a.href = data.link_url;
    $a.setAttribute("style", data.wrap_styles);
    $a.setAttribute("data-analytics-event", `${data.ga_category} | ${data.ga_action} | ${data.ga_label}`);
    $text.classList.add("c-featured__text");
    $headline.classList.add("c-featured__headline");
    $headline.innerHTML = safeHTML(data.headline);
    $excerpt.classList.add("c-featured__excerpt");
    $excerpt.innerHTML = data.excerpt;
    $button.classList.add("c-featured__button");
    $button.textContent = data.link_text;
    $style.type = "text/css";
    $style.textContent = data.css;
    $text.appendChild($headline);
    $text.appendChild($excerpt);
    $text.appendChild($button);
    if (data.background_image.src) {
      let $bg = generateImage(data.background_image);
      $bg.classList.add("c-featured__background");
      $a.appendChild($bg);
    }
    if (data.foreground_image.src) {
      let $fg = generateImage(data.foreground_image);
      $fg.classList.add("c-featured__image");
      $a.appendChild($fg);
    }
    $a.appendChild($text);
    $base.appendChild($h6);
    $base.appendChild($a);
    $base.appendChild($style);
    return $base;
  };
  var $html2 = document.querySelector("html");
  if (!$html2.classList.contains("fl-builder-edit")) {
    mount2();
  }
  document.addEventListener("turbolinks:render", function(event) {
    mount2();
  });

  // src/js/Main/switcher.js
  var $html3 = document.querySelector("html");
  var mount3 = function() {
    bindEvents2();
  };
  var bindEvents2 = function() {
    $html3.addEventListener("click", handleClick);
  };
  var handleClick = function(e) {
    const $trigger = e.target.closest("[data-toggle]");
    if (null === $trigger) return;
    if (null !== e.target.closest("form")) return;
    const $target = $trigger.dataset.toggle ? $html3.querySelector($trigger.dataset.toggle) : $trigger;
    if (null === $target) return;
    const $anchor = e.target.closest("a");
    if ($anchor) {
      if ($anchor === $trigger) {
        e.preventDefault();
      } else {
        const $url = new URL($anchor.getAttribute("href"));
        if ($url && $url.pathname !== window.location.pathname) return;
        $anchor.blur();
      }
    }
    toggle($target, $trigger);
  };
  var toggle = function($target, $trigger) {
    const target_active = $target.classList.contains("active"), group = $target.dataset.group, $active = group ? $html3.querySelectorAll('[data-group="' + group + '"].active') : null, toggle_event = new CustomEvent(
      "toggle:" + (target_active ? "off" : "on"),
      {
        bubbles: true
      }
    );
    if ($active) {
      $active.forEach(($item) => $item.classList.remove("active"));
    }
    if (!target_active) {
      $target.classList.add("active");
      $trigger.classList.add("active");
    } else {
      $trigger.blur();
    }
    $target.dispatchEvent(toggle_event);
  };
  if (!$html3.classList.contains("fl-builder-edit")) {
    mount3();
  }
  document.addEventListener("turbolinks:render", function(event) {
    mount3();
  });

  // src/js/Main/consent.js
  window.addEventListener("click", (e) => {
    if (e.target.matches('a[href*="#open-consent-prefs"]') || e.target.matches("span#open-consent-prefs")) {
      e.preventDefault();
      if (typeof window.OneTrust !== "undefined") {
        window.OneTrust.ToggleInfoDisplay();
      }
    }
  });
})();
