(function () {
  'use strict';

  // elements we'll be listening on or manipulating
  var $html, $header, $main_menu, $sub_menus; // bind to new DOM

  var mount = function mount() {
    bindElements();

    if ($header && $main_menu && $sub_menus) {
      bindEvents();
      setActiveMenuItem();
    }
  }; // element bindings


  var bindElements = function bindElements() {
    $header = document.querySelector('.c-site-header');
    $main_menu = document.querySelector('.c-main-menu');
    $sub_menus = document.querySelectorAll('.c-sub-menu');
  }; // event bindings


  var bindEvents = function bindEvents() {
    // sub menu switch click handlers
    $main_menu.addEventListener('click', function (event) {
      var $clicked_link = event.target.closest('a'); // Not a switch

      if (null === $clicked_link || '#' !== $clicked_link.getAttribute('href').charAt(0)) return;
      var $target_sub_menu = document.querySelector($clicked_link.getAttribute('href')); // If clicked menu is already active
      // Just deactivate it

      if ($target_sub_menu.classList.contains('active')) {
        closeAllSubMenus();
        $clicked_link.blur();
        $clicked_link.classList.remove('active');
        $target_sub_menu.classList.remove('active');
        setHtmlScrollState(true); // Else clicked menu was not active
        // Deactivate others, activate target
      } else {
        closeAllSubMenus();
        $clicked_link.classList.add('active');
        $target_sub_menu.classList.add('active');
        setHtmlScrollState(false);
      }

      event.preventDefault();
      return false;
    }); // submenu row click handlers

    $sub_menus.forEach(function ($sub_menu) {
      $sub_menu.addEventListener('click', function (event) {
        if (event.target.classList.contains('c-sub-menu')) {
          closeAllSubMenus();
          setHtmlScrollState(true);
          return false;
        }
      });
    }); // Keyboard Events

    document.addEventListener('keyup', function (event) {
      switch (event.keyCode) {
        case 27:
          // esc
          closeAllSubMenus();
          document.activeElement.blur();
          setHtmlScrollState(true);
          break;
      }
    });
  };

  var closeAllSubMenus = function closeAllSubMenus() {
    $sub_menus.forEach(function ($sub_menu) {
      $sub_menu.classList.remove('active');
    });
  };

  var setActiveMenuItem = function setActiveMenuItem() {
    var current_path = window.location.pathname,
        $header_links = []; // Home page, return early

    if ('/' === current_path) {
      return; // Adjust current_path for some special cases
      // ... such as community pages
    } else if (current_path.match(/^\/community\/questions\/.+/)) {
      current_path = '/community/questions/'; // ... such as single post types
    } else if (current_path.match(/^\/blog|marketplace\/.+/)) {
      current_path = current_path.replace(/^\/([^\/]+)\/.+/, '/$1/');
    } else if (current_path.match(/^\/event\/.+/)) {
      current_path = '/events/';
    } else if (current_path.match(/^\/content\/.+/)) {
      current_path = '/resources/';
    } else if (current_path.match(/^\/spotlight\/.+/)) {
      current_path = '/craft-of-code/';
    } else if (current_path.match(/^\/award|media\-coverage|press\-release\/.+/)) {
      current_path = '/company/press/';
    } // find all header links


    $header_links = $header.querySelectorAll('a.o-menu__link');

    for (var i = 0; i < $header_links.length; i++) {
      // strip the URL string and/or fragment identifier
      var $link = $header_links[i];
      var href_path = $link.getAttribute('href').split(/[?]/)[0]; // skip if not a match

      if (!href_path.endsWith(current_path)) {
        continue;
      } // add "current" class to found item


      $link.classList.add('current'); // find any parent submenus

      var $sub_menu = $link.closest('.c-sub-menu');

      if (null !== $sub_menu) {
        // identify links that trigger submenus
        var $parent_links = $header.querySelectorAll('a[href="#' + $sub_menu.id + '"]');
        $parent_links.forEach(function ($link) {
          // add "current" class to parent item
          $link.classList.add('current');
        });
      }
    }
  };

  var setHtmlScrollState = function setHtmlScrollState(state) {
    // disable scroll if any submenu is active
    $html.style.overflow = state ? '' : 'hidden';
  }; // Initialize...
  // bind <html> element


  var $html = document.querySelector('html'); // only mount when page builder is not in use

  if (!$html.classList.contains('fl-builder-edit')) {
    mount();
  } // remount if dom content is replaced


  document.addEventListener('turbolinks:render', function (event) {
    mount();
  });

}());
