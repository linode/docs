(() => {
  // src/js/Main/main-menu.js
  var $html = document.querySelector("html");
  var $header;
  var mount = function() {
    $header = document.querySelector(".c-site-header");
    if (!$header)
      return;
    bindEvents();
    setActiveMenuItem();
  };
  var bindEvents = function() {
    window.addEventListener("scroll", function() {
      document.documentElement.style.setProperty("--site-scroll-y", window.scrollY + "px");
    });
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
    } else if (current_path.match(/^\/content|content-type|featuring|series\/.+/)) {
      current_path = "/content/";
    } else if (current_path.match(/^\/award|media\-coverage|press\-release\/.+/)) {
      current_path = "/company/press/";
    }
    var $current_links = $header.querySelectorAll(':scope a.o-menu__link[href*="' + current_path + '"');
    if (!$current_links)
      return;
    Array.from($current_links).forEach(($link) => {
      if (!$link.getAttribute("href").split(/[?#]/)[0].endsWith(current_path))
        return;
      $link.classList.add("current");
      const $sub_menu = $link.closest(".c-submenu");
      if (null === $sub_menu)
        return;
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

  // src/js/Main/header-notification.js
  var $html2;
  var $notification;
  var $notification_link;
  var $notification_tag;
  var $notification_message;
  var mount2 = function() {
    $notification = document.querySelector(".c-site-header .c-notification");
    if ($notification) {
      let api_url = "https://www.linode.com/wp-json/linode/v1/header-notification", lang = getLanguageString();
      if (lang) {
        api_url = `https://www.linode.com/${lang}/wp-json/linode/v1/header-notification?lang=${lang}`;
      }
      $notification_link = $notification.querySelector(".c-notification__link");
      $notification_tag = $notification.querySelector(".c-notification__tag");
      $notification_message = $notification.querySelector(".c-notification__message");
      fetch(api_url).then(handleFetchErrors).then((response) => response.json()).then((data) => updateDOM(data)).catch((error) => console.log(error));
    }
  };
  var updateDOM = function(data) {
    if (data && data.url && data.message && $notification && $notification_link && $notification_tag && $notification_message) {
      $notification_link.href = data.url;
      if (data.tag) {
        $notification_tag.textContent = data.tag;
      } else {
        $notification_tag.remove();
      }
      $notification_message.innerHTML = safeHTML(data.message);
      $notification.classList.add("--show");
    }
  };
  var $html2 = document.querySelector("html");
  if (!$html2.classList.contains("fl-builder-edit")) {
    mount2();
  }
  document.addEventListener("turbolinks:render", function(event) {
    mount2();
  });

  // src/js/Main/header-featured.js
  var $html3;
  var mount3 = function() {
    let api_url = "https://www.linode.com/wp-json/linode/v1/header-featured", lang = getLanguageString();
    if (lang) {
      api_url = `https://www.linode.com/${lang}/wp-json/linode/v1/header-featured?lang=${lang}`;
    }
    fetch(api_url).then(handleFetchErrors).then((response) => response.json()).then((data) => updateDOM2(data)).catch((error) => console.log(error));
  };
  var updateDOM2 = function(data) {
    data.forEach((item) => {
      let $slot = document.querySelector('.c-site-header [data-featured="' + item.slot + '"]');
      if (!$slot)
        return;
      let $feature = generateFeature(item);
      if (!$feature)
        return;
      $slot.appendChild($feature);
    });
  };
  var generateImage = function(data) {
    let $img = document.createElement("img");
    $img.src = data.src;
    $img.width = data.width;
    $img.height = data.height;
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
  var $html3 = document.querySelector("html");
  if (!$html3.classList.contains("fl-builder-edit")) {
    mount3();
  }
  document.addEventListener("turbolinks:render", function(event) {
    mount3();
  });

  // src/js/Main/switcher.js
  var $html4 = document.querySelector("html");
  var mount4 = function() {
    bindEvents2();
  };
  var bindEvents2 = function() {
    $html4.addEventListener("click", handleClick);
  };
  var handleClick = function(e) {
    const $trigger = e.target.closest("[data-toggle]");
    if (null === $trigger)
      return;
    if (null !== e.target.closest("form"))
      return;
    const $target = $trigger.dataset.toggle ? $html4.querySelector($trigger.dataset.toggle) : $trigger;
    if (null === $target)
      return;
    const $anchor = e.target.closest("a");
    if ($anchor) {
      if ($anchor === $trigger) {
        e.preventDefault();
      } else {
        const $url = new URL($anchor.getAttribute("href"));
        if ($url && $url.pathname !== window.location.pathname)
          return;
        $anchor.blur();
      }
    }
    toggle($target, $trigger);
  };
  var toggle = function($target, $trigger) {
    const target_active = $target.classList.contains("active"), group = $target.dataset.group, $active = group ? $html4.querySelectorAll('[data-group="' + group + '"].active') : null, toggle_event = new CustomEvent(
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
  if (!$html4.classList.contains("fl-builder-edit")) {
    mount4();
  }
  document.addEventListener("turbolinks:render", function(event) {
    mount4();
  });
})();
