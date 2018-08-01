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

$(function() {
    $('.disclosure-note').each(function() {
        $(this).css("cursor", "pointer")
            .click(function() { toggleNoteDisclosure($(this)) });
        $(this).children('div').first()
            .css("height", '3em')
            .css("opacity", .5);
    });
});

function toggleNoteDisclosure(disclosureNote) {
    disclosureNoteTitle = disclosureNote.children('span').first();
    arrowIcon = disclosureNoteTitle.children('img.disclosure-icon').first();
    disclosableDiv = disclosureNoteTitle.next('div')
    if (disclosureNote.hasClass('disclosed')) {
        disclosableDiv.animate(
            {
                height: '3em',
                opacity: .5
            }, 
            200,
            function() {
                disclosureNoteTitle.css("cursor", "pointer")
                    .unbind('click');
                disclosureNote.css("cursor", "pointer")
                    .unbind('click').click(function() { toggleNoteDisclosure($(this)); });
            });
    }
    else {
        disclosableDiv.animate(
            {
                height: disclosableDiv.children('.height-preservation-wrapper').first().height(),
                opacity: 1
            }, 
            200,
            function() {
                disclosureNote.css("cursor", "default")
                    .unbind('click');
                disclosureNoteTitle.css("cursor", "pointer")
                    .unbind('click').click(function() { toggleNoteDisclosure($(this).parent()); });
            });
    }
    disclosureNote.toggleClass('disclosed');
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

})(jQuery);

(function($) {

    function search(query, searchStore) {
        // Fuzzy search with sensitivity set to one character
        var result = searchStore.index.search(query + '~1');
        var resultList = $('#ds-search-list');
        var MAX_DEPRECATED_GUIDES = 5;
        var deprecatedResults = [];
        var hiddenGuide = [];
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
            var shortguide = doc.shortguide
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
            else if (shortguide) {
              hiddenGuide.push(searchitem)
            }
            else {
              resultList.append(searchitem)
            }
        }

        deprecatedResults.forEach(function(result) {
          resultList.append(result);
          resultList = resultList.filter(function(val) {
                return hiddenGuide.indexOf(val) == -1;
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

    Search = {

        init: function() {
            $(document).ready(function() {

                initModal();

                var setupSearch = function(json) {
                    var searchStore = {}
                    searchStore.index = lunr.Index.load(json.index);
                    searchStore.store = json.store;

                    if (window.location.pathname == '/docs/search/' && Page.param('q')) {
                        var query = decodeURIComponent(Page.param('q').replace(/\+/g, '%20'));
                        toggleAndSearch(searchStore, query);
                    };

                    $(document).on('keypress', '#ss_keyword', function(e) {
                        if (e.keyCode !== 13) {
                            return
                        }
                        var query = $(this).val();
                        toggleAndSearch(searchStore, query);

                    });

                    $('#ds-search').keyup(function(e) {
                        var query = $(this).val();
                        search(query, searchStore);
                    });

                    $(document).on('click', '#ds-search-btn', function(e) {
                        toggleAndSearch(searchStore);

                    });

                    $(document).on('click', '#ds-search-btn-modal', function(e) {
                        query = $('#ds-search').val();
                        search(query, searchStore);
                    });
                }

                $.getJSON('/docs/build/lunr.json', setupSearch);

            });

        },

    };


    // For now we assume that every page that includes this JS needs search.
    Search.init();


})(jQuery);

(function($) {

    SidebarScroll = {
        init: function() {
            var tocElemID = '#doc-sidebar';
            var toc = $(tocElemID);

            var footer = $('footer');
            var bottom = Math.round($(document).height() - footer.offset().top) + 80;

            /* activate scrollspy menu */
            var $body = $(document.body);
            var navHeight = toc.outerHeight(true) + 10;

            $body.scrollspy({
                target: tocElemID,
                offset: navHeight
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
                        $('html,body').animate({
                            scrollTop: target.offset().top - 50
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
