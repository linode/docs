(() => {
  // src/js/Main/main-menu.js
  var $html;
  var $header;
  var $main_menu;
  var $sub_menus;
  var mount = function() {
    bindElements();
    if ($header && $main_menu && $sub_menus) {
      bindEvents();
      setActiveMenuItem();
    }
  };
  var bindElements = function() {
    $header = document.querySelector(".c-site-header");
    $main_menu = document.querySelector(".c-main-menu");
    $sub_menus = document.querySelectorAll(".c-sub-menu");
  };
  var bindEvents = function() {
    $main_menu.addEventListener("click", function(event) {
      var $clicked_link = event.target.closest("a");
      if ($clicked_link === null)
        return;
      var $submenu_selector = $clicked_link.dataset.subMenu || $clicked_link.getAttribute("href") || "";
      if (!$submenu_selector || $submenu_selector.charAt(0) !== "#")
        return;
      var $target_sub_menu = document.querySelector($submenu_selector);
      if ($target_sub_menu.classList.contains("active")) {
        deactivateAll();
        $clicked_link.blur();
        setHtmlScrollState(true);
      } else {
        deactivateAll();
        $clicked_link.classList.add("active");
        $target_sub_menu.classList.add("active");
        setHtmlScrollState(false);
      }
      event.preventDefault();
      return false;
    });
    $sub_menus.forEach(($sub_menu) => {
      $sub_menu.addEventListener("click", function(event) {
        if (event.target.classList.contains("c-sub-menu")) {
          deactivateAll();
          setHtmlScrollState(true);
          return false;
        }
      });
    });
    document.addEventListener("keyup", function(event) {
      switch (event.keyCode) {
        case 27:
          deactivateAll();
          document.activeElement.blur();
          setHtmlScrollState(true);
          break;
      }
    });
  };
  var deactivateAll = function() {
    $header.querySelectorAll(".active").forEach(($item) => $item.classList.remove("active"));
  };
  var setActiveMenuItem = function() {
    var current_path = window.location.pathname, $header_links = [];
    if (current_path === "/") {
      return;
    } else if (current_path.match(/^\/community\/questions\/.+/)) {
      current_path = "/community/questions/";
    } else if (current_path.match(/^\/blog|marketplace\/.+/)) {
      current_path = current_path.replace(/^\/([^\/]+)\/.+/, "/$1/");
    } else if (current_path.match(/^\/event\/.+/)) {
      current_path = "/events/";
    } else if (current_path.match(/^\/content\/.+/)) {
      current_path = "/resources/";
    } else if (current_path.match(/^\/spotlight\/.+/)) {
      current_path = "/craft-of-code/";
    } else if (current_path.match(/^\/award|media\-coverage|press\-release\/.+/)) {
      current_path = "/company/press/";
    }
    $header_links = $header.querySelectorAll("a.o-menu__link");
    for (let i = 0; i < $header_links.length; i++) {
      let $link = $header_links[i];
      let href_path = $link.getAttribute("href").split(/[?]/)[0];
      if (!href_path.endsWith(current_path)) {
        continue;
      }
      $link.classList.add("current");
      let $sub_menu = $link.closest(".c-sub-menu");
      if ($sub_menu !== null) {
        let $parent_links = $header.querySelectorAll('a[data-sub-menu="#' + $sub_menu.id + '"], a[href="#' + $sub_menu.id + '"]');
        $parent_links.forEach(($link2) => {
          $link2.classList.add("current");
        });
      }
    }
  };
  var setHtmlScrollState = function(state) {
    $html.style.overflow = state ? "" : "hidden";
  };
  var $html = document.querySelector("html");
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

  // src/js/Main/safe-html.js
  function safeHTML(input, allow_tags = ["b", "br", "em", "i", "strong"]) {
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
      $notification_link = $notification.querySelector(".c-notification__link");
      $notification_tag = $notification.querySelector(".c-notification__tag");
      $notification_message = $notification.querySelector(".c-notification__message");
      fetch("https://www.linode.com/wp-json/linode/v1/header-notification").then(handleFetchErrors).then((response) => response.json()).then((data) => updateDOM(data)).catch((error) => console.log(error));
    }
  };
  var updateDOM = function(data) {
    if (data && data.url && data.message && $notification && $notification_link && $notification_message) {
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
    fetch("https://www.linode.com/wp-json/linode/v1/header-featured").then(handleFetchErrors).then((response) => response.json()).then((data) => updateDOM2(data)).catch((error) => console.log(error));
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
    $base = document.createElement("div");
    let $h6 = document.createElement("h6"), $a = document.createElement("a"), $text = document.createElement("div"), $headline = document.createElement("div"), $excerpt = document.createElement("div"), $button = document.createElement("span"), $style = document.createElement("style");
    $h6.textContent = data.eyebrow;
    $a.classList.add("c-featured");
    $a.id = `c-featured--${data.slot}`;
    $a.href = data.link_url;
    $a.setAttribute("style", data.wrap_styles);
    $a.setAttribute("onclick", `featureClick( '${data.ga_category}', '${data.ga_action}', '${data.ga_label}')`);
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
})();
