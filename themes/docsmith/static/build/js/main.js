var client = algoliasearch('KGUN8FAIPF','d4847002cd30392fe0fbd00a1da933ed');
var index = client.initIndex('linode-docs');
var search = autocomplete('.search-box', { hint: false }, [
  {
    source: autocomplete.sources.hits(index, { hitsPerPage: 10 }),
    autoselect: true,
    displayKey: 'title',
    templates: {
      suggestion: function(suggestion) {
        return suggestion.title;
      }
    }
  }
]).on('autocomplete:selected', function(event, suggestion, dataset) {
  window.location.href = suggestion.href;
});

var urlParams = new URLSearchParams(window.location.search);
var query = urlParams.get('q');

if (query) {
  search.autocomplete.setVal(query);
  search.autocomplete.open();
}
(function($) {

    $("pre").each(function () {
      // Separate selector for file excerts
      if (!$(this).closest("td").length) {
        $(this).before('<div class="btn-copy" />');
      };
    });

    // Select odd to omit line numbers in pre tags
    $("tr td.lntd:odd pre").each(function () {
        $(this).before('<div class="btn-copy" />');
    });

    function generate_copy_code_buttons() {
      var $copy_button = $("<a>", {"class": "copy-code"}).append(
        $("<span>", {"class": "glyphicon glyphicon-copy", "text": ""})
      );

      $(".btn-copy").prepend($copy_button);
      var clipboard = new Clipboard(".copy-code", {
        target: function(trigger) {
          return trigger.parentNode.nextElementSibling;
        }
      })

      clipboard.on('success', function(e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
      });

      clipboard.on('error', function(e) {
        setTooltip(e.trigger, 'Press Ctrl + c');
        hideTooltip(e.trigger);
      });
    };

    generate_copy_code_buttons();

    // Use bootstrap tooltip for on-click message
    // https://stackoverflow.com/questions/37381640/tooltips-highlight-animation-with-clipboard-js-click/37395225
    $(".copy-code").tooltip({
      trigger: 'click'
    });

    function setTooltip(btn, message) {
      $(btn).tooltip('hide')
        .attr('data-original-title', message)
        .tooltip('show');
    };

    function hideTooltip(btn) {
      setTimeout(function () {
        // Destroy tooltip in case of consecutive presses
        $(btn).tooltip('destroy');
      }, 500);
    };

    // Forgive me for I have sinned
    $("pre").hover(
      function () {
        $(this).prev('.btn-copy').find('.copy-code').css({"opacity": 1, "transition": "opacity .25s ease-in-out"});
      }, function () {
        $(this).prev('.btn-copy').find('.copy-code').css("opacity", "");
      });

})(jQuery);

//shortcodes disclosure-note and quick-start-note rely on this JS
$(function () {
  $('.hidden-content').each(function () {
    $(this).css("cursor", "pointer")
      .click(function () { toggleHiddenContent($(this)) });
    $(this).children('div').first()
      .css("height", '2.8em')
      .css("opacity", .5);
  });
  $('.btn').click(function () {
    $('.btn.feedback').attr("disabled", "true");
  });
});

function toggleHiddenContent(hiddenContent) {
  hiddenContentTitle = hiddenContent.children('span').first();
  arrowIcon = hiddenContentTitle.children('img.toggle-hidden-content-icon').first();
  hideableDiv = hiddenContentTitle.next('div')
  if (hiddenContent.hasClass('unhidden')) {
    hideableDiv.animate(
      {
        height: '2.8em',
        opacity: .5
      },
      200,
      function () {
        hiddenContentTitle.css("cursor", "pointer")
          .unbind('click');
        hiddenContent.css("cursor", "pointer")
          .unbind('click').click(function () { toggleHiddenContent($(this)); });
      });
  }
  else {
    hideableDiv.animate(
      {
        height: hideableDiv.children('.height-preservation-wrapper').first().height(),
        opacity: 1
      },
      200,
      function () {
        hiddenContent.css("cursor", "default")
          .unbind('click');
        hiddenContentTitle.css("cursor", "pointer")
          .unbind('click').click(function () { toggleHiddenContent($(this).parent()); });
      });
  }
  hiddenContent.toggleClass('unhidden');
}
(function($) {

    Page = {
        isMobile: function() {
            return $(window).width() <= 768;
        },
        param: function(sVar) {
            return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" +
                encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        },
        Toggle: {
            init: function(element) {
                var $element = $(element);
                var $child = $($element.data("target"));

                if ($child.hasClass("in")) {
                    $element.find(".toggle-open").show();
                    $element.find(".toggle-closed").hide();
                } else {
                    $element.find(".toggle-closed").show();
                    $element.find(".toggle-open").hide();
                }
            },

            update: function(element) {
                var $element = $(element);
                if ($element.find(".toggle-closed").is(":visible")) {
                    $element.find(".toggle-open").show();
                    $element.find(".toggle-closed").hide();
                } else {
                    $element.find(".toggle-closed").show();
                    $element.find(".toggle-open").hide();
                }
            }
        }
    };


    Handlebars.registerHelper('formatDate', function(object) {
        var date = new Date(object),
            months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

        return months[date.getMonth()] + ' ' + (date.getDay() + 1) + ', ' + date.getFullYear();
    });

    // toggle
    $(".toggle").each(function(i, element) {
        Page.Toggle.init(element);
    });
    $(".toggle").click(function(event) {
        Page.Toggle.update($(event.target).parent()[0]);
    });

    if (Page.param('format') === 'app') {
        $('header').hide();
        $('.breadcrumb-row').hide();
        $('.first-section').addClass('library-section-app');
        $('footer').hide();
        $("[href^='/docs']").each(function() {
            var u;
            if (this.href.match(/format=app/)) return;
            u = new URL(this.href);
            u.search = u.search + (u.search.match(/^\?/) ? '&' : '?') + 'format=app';
            this.href = u.toString();
        });
    }

    // navigation toggle
    $('.primary-nav__link.dropdown').each(function() {
        $(this).on('click', function() {
            var SubMenuAttr = $(this).attr('data-submenu');
            var targetSubMenu = $('#header').find("#"+SubMenuAttr)
            targetSubMenu.siblings('.sub-menu').addClass('visually-hidden visibility-hidden');
            targetSubMenu.toggleClass('visually-hidden visibility-hidden');
            setTimeout(function() {
                if (targetSubMenu.hasClass('visually-hidden')) {
                    $('body').removeClass('oh');
                }
                else if (!targetSubMenu.siblings('.sub-menu').hasClass('visually-hidden')) {
                    $('body').removeClass('oh');
                }
                else {
                    $('body').addClass('oh');
                }
            }, 50)
        })
    })

    $('#header').on('click', function(e) {
        if (!$(e.target).hasClass('primary-nav__link') && !$(e.target).parents('.sub-menu').length > 0) {
            $('.sub-menu').addClass('visually-hidden visibility-hidden');
            $('body').removeClass('oh');
        }
    })

    // mobile navigation toggle
    $('.header__link.mobile').on('click', function() {
        var mm = $('#mobile-menus');
        mm.toggleClass('active');
        $('.header-mobile-icon svg').toggle();
        if (mm.hasClass('active')) {
            $('body').addClass('m-oh')
        }
        else {
            $('body').removeClass('m-oh');
        }
    })


})(jQuery);

(function($) {

    function search(query, searchStore) {
        // Fuzzy search with sensitivity set to one character
        var result = searchStore.index.search(query + '~1');
        var resultList = $('#ds-search-list');
        var MAX_DEPRECATED_GUIDES = 5;
        var deprecatedResults = [];
        var hiddenGuides = [];
        var item, doc;
        resultList.empty();
        for (var i = 0; i < result.length; i++) {
            item = result[i];
            doc = searchStore.store[item.ref];

            // We could add a threshold with score, but that would not show single results with low score ("Ubuntu" being one example).
            if (i > 30) {
                break;
            }
            var title = doc.h1 || doc.title
            var url = item.ref
            var badge = ''
            var deprecated = doc.deprecated
            var hiddenguide = doc.hiddenguide
            if (deprecated) {
              badge = '<span class="search-deprecated">DEPRECATED</span>'
             }
            var searchitem = '<li class="list-group-item"><a href="' + url + '">' + title + badge + '</a></li>';

            // Deprecated search results to end of list
            if (deprecated) {
              if (deprecatedResults.length < MAX_DEPRECATED_GUIDES) {
                deprecatedResults.push(searchitem)
              }
            }
            else if (hiddenguide) {
              hiddenGuides.push(searchitem)
            }
            else {
              resultList.append(searchitem)
            }
        }

        deprecatedResults.forEach(function(result) {
          resultList.append(result);
          resultList = resultList.filter(function(val) {
                return hiddenGuides.indexOf(val) == -1;
            });
        });
        resultList.show();
    }

    function toggleAndSearch(searchStore, query) {
        $('#ds-search-modal').modal('toggle');
        query = query || $('#ss_keyword').val();
        $('#ds-search').val(query);
        search(query, searchStore);
    }

    function initModal() {
        var options = {
            "backdrop": true,
            "show": false
        }

        var elem = $('#ds-search-modal')

        elem.modal(options);

        elem.on("shown.bs.modal", function() {
            $('#ds-search').focus();
        });
    }

})(jQuery);


function articleHeadersChangedVisibility() {
    function navListElementForHeaderID(id) {
        var href = "#" + id;
        return $('#TableOfContents > ul').find('a[href="' + href + '"]').first().parent();
    }

    var articleBody = $('div#article-body');

    var visibleHeaders = articleBody
        .find(':header')
        .not("div:hidden :header");
    visibleHeaders.each(function() {
        navListElementForHeaderID(this.id).show();
    });

    var hiddenHeaders = articleBody
        .find(':header')
        .filter("div:hidden :header");
    hiddenHeaders.each(function() {
        navListElementForHeaderID(this.id).hide();
    });

    $('body').scrollspy('refresh')
}

// Hugo's .TableOfContents shortcode 
// (which relies on the Blackfriday markdown
// renderer to compile the table of contents)
// does not include headers from embedded 
// shortguides. buildNav() rebuilds the nav, 
// including embedded shortguides.
function buildNav() {
    function addListTagsForHeaderToNav(parentList, currentHeaderElement, previousHeaderElement) {
        function headerLevel(headerElement) {
            return parseInt(headerElement.prop('tagName').slice(1));
        }
        var currentHeaderLevel = headerLevel(currentHeaderElement);
        var previousHeaderLevel = headerLevel(previousHeaderElement);
    
        function anchorElement(headerElement) {
            return $("<a />").attr("href", "#" + headerElement.prop('id'))
                .text($(headerElement.contents()[0]).text());
        }
    
        if (currentHeaderLevel === previousHeaderLevel) {
            var li = $("<li></li>").appendTo(parentList);
            anchorElement(currentHeaderElement).appendTo(li);
        }
        else if (currentHeaderLevel > previousHeaderLevel) {
            for (var i = 0; i < currentHeaderLevel - previousHeaderLevel; i++) {
                parentList = $("<ul></ul>").appendTo(parentList.children("li:last"));
                $("<li></li>").appendTo(parentList);
            }
            anchorElement(currentHeaderElement).appendTo(parentList.children("li:last"));
        }
        else if (currentHeaderLevel < previousHeaderLevel) {
            for (var i = 0; i < previousHeaderLevel - currentHeaderLevel; i++) {
                parentList = parentList.parent().closest("ul");
            }
            var li = $("<li></li>").appendTo(parentList);
            anchorElement(currentHeaderElement).appendTo(li);
        }
    
        return parentList;
    }

    var parentList = $('#TableOfContents > ul');
    // All of .TableOfContent's elements were embedded in 
    // #TableOfContents > ul > li
    parentList.children('li:first').empty();

    var headers = $('div#article-body')
        .find(':header');
    for (var i = 1; i < headers.length; i++) {
        parentList = addListTagsForHeaderToNav(parentList, headers.eq(i), headers.eq(i-1));
    }
}

(function($) {

    buildNav();

    SidebarScroll = {
        init: function() {
            var tocElemID = '#doc-sidebar';

            /* activate scrollspy menu */
            var $body = $(document.body);

            // The y position of the sticky nav element
            var scrollSpyOffset = 20;

            $body.scrollspy({
                target: tocElemID,
                offset: scrollSpyOffset
            });

            /*  scrollspy Table of contents, adapted from https://www.bootply.com/100983
                license: MIT
                author: bootply.com
             */
            /* smooth scrolling sections */
            $('a[href*=\\#]:not([href=\\#])').click(function() {
                if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        // Add 1 to push the scroll position past the scrollspy threshold
                        // for the header. Otherwise, the header prior to the target would be
                        // highlighted in the nav at the end of the scroll animation.
                        $('html,body').animate({
                            scrollTop: target.offset().top - scrollSpyOffset + 1
                        }, 1000);
                        /* Change the hash location in URL */
                        window.location.hash = this.hash;
                        return false;
                    }
                }
            });
        }

    }

})(jQuery);
