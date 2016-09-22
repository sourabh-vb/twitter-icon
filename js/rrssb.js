/*!
 Simple Responsive Social Sharing Buttons
*/

+(function(window, $, undefined) {
    'use strict';
    // @@ Use of global
    var settings = {
      shrink: 0.7,
      minRows: 1,
      maxRows: 2,
    };

    /*
     * Public Function
     */
    $.fn.rrssb = function(options) {

      // Settings that $.rrssb() will accept.  @@ Test
      settings = $.extend(settings, options);

    };

    function rrssbInit() {
      $('.rrssb-buttons').each(function(index) {
          $(this).addClass('rrssb-'+(index + 1));
          var buttonWidth = 0;
          $('li', this).each(function() {
              buttonWidth = Math.max(buttonWidth, $(this).innerWidth());
          });
          // Set all buttons to match width of largest.
          // This width stays no matter what sizing, but it may get constrained down by a max-width.
          // In the case where the buttons are in a float with no fixed width, having the full
          // width set on each button ensures that the float is able to grow back up from no-labels to having labels again.
          $('li', this).width(buttonWidth);
          $(this).attr('orig-width', buttonWidth);
          $(this).attr('orig-height', $('li', this).innerHeight());
          $(this).attr('orig-font-size', parseFloat($(this).css("font-size")));
      });

      $('.rrssb-buttons').each(rrssbFix);
    };

    function rrssbFix() {
      var buttonWidth = $(this).attr('orig-width');
      var buttons = $('li', this).length;
      // Modern browsers have sub-pixel support, so an element can have a fractional width internally.
      // This can get rounded up in the result of innerWidth, so subtract 1px to get a safe width.
      var containerWidth = $(this).innerWidth() - 1;
      var buttonsPerRow = Math.floor(containerWidth / (buttonWidth * settings.shrink));
      var rowsNeeded = Math.ceil(buttons / buttonsPerRow);

      // Fix labels.
      if (rowsNeeded > settings.maxRows) {
        $(this).addClass('no-label');
        buttonWidth = $(this).attr('orig-height');
        buttonsPerRow = Math.floor(containerWidth / (buttonWidth * settings.shrink));
        rowsNeeded = Math.ceil(buttons / buttonsPerRow);
      }
      else {
        $(this).removeClass('no-label');
      }

      // Fix sizes.
      // Can't use a percent width as it doesn't work well if the buttons are inside a non-fixed-size container.
      buttonsPerRow = Math.ceil(buttons / rowsNeeded);
      var calcWidth = Math.floor(Math.min(buttonWidth, containerWidth / buttonsPerRow));
      var percWidth = Math.floor(10000 / buttonsPerRow) / 100;
      $('li', this).css('max-width', percWidth + '%');

      if (calcWidth < buttonWidth) {
        // Reduce font size.  Take account of padding, which is a fixed amount.
        // Reduce calculated value slightly as browser size calculations have some rounding and approximation.
        var buttonPadding = $('li', this).innerWidth() - $('li', this).width();
        var scale = (calcWidth - buttonPadding) / (buttonWidth - buttonPadding);
        var fontSize = $(this).attr('orig-font-size') * scale  * 0.97;
        $(this).css('font-size', fontSize + 'px');
        $(this).css('padding-right', '');
      }
      else {
        // Set padding to ensure the buttons wrap evenly, for example 6 => 3+3 not 4+2.
        var padding = containerWidth - buttonsPerRow * buttonWidth;
        $(this).css('padding-right', padding + 'px');
        $(this).css('font-size', '');
      }
    }

    var popupCenter = function(url, title, w, h) {
      // Fixes dual-screen position                         Most browsers      Firefox
      var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
      var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

      var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      var left = ((width / 2) - (w / 2)) + dualScreenLeft;
      var top = ((height / 3) - (h / 3)) + dualScreenTop;

      var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

      // Puts focus on the newWindow
      if (newWindow && newWindow.focus) {
        newWindow.focus();
      }
    };

    var waitForFinalEvent = (function () {
        var timers = {};
        return function (callback, ms, uniqueId) {
          if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
          }
          if (timers[uniqueId]) {
            clearTimeout (timers[uniqueId]);
          }
          timers[uniqueId] = setTimeout(callback, ms);
        };
    })();

    // init load
    $(document).ready(function(){
        /*
        * Event listners
        */

        $('.rrssb-buttons a.popup').click(function popUp(e) {
            var self = $(this);
            popupCenter(self.attr('href'), self.find('.rrssb-text').html(), 580, 470);
            e.preventDefault();
        });

        // resize function
        $(window).resize(function () {
            waitForFinalEvent(function() {$('.rrssb-buttons').each(rrssbFix);}, 200, "finished resizing");
        });

        rrssbInit();
    });

})(window, jQuery);
