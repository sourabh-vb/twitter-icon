/*!
 Simple Responsive Social Sharing Buttons
*/

+(function(window, $, undefined) {
    'use strict';
    var schema = {
      size: {min: 0.1, max: 10, default: 1},
      shrink: {min: 0.2, max: 1, default: 0.8},
      regrow: {min: 0.2, max: 1, default: 0.8},
      minRows: {min: 1, max: 99, default: 1},
      maxRows: {min: 1, max: 99, default: 2},
      maxPrefix: {min: 0, max: 0.8, default: 0.3},
    };

    /**
     * Public function to configure all sets of buttons on the page.
     */
    window.rrssbConfigAll = function(settings) {
      $('.rrssb').each(function(){
         $(this).rrssbConfig(settings);
      });
    }

    /**
     * Public function to configure the set of buttons.
     * $(this) points to an instance of .rrssb
     */
    $.fn.rrssbConfig = function(settings) {
      if ($(this).data('settings') && !settings) {
        return;
      }

      var checkedSettings = {};
      for (var param in schema) {
        if (settings && settings[param] !== '') {
         checkedSettings[param] = Math.min(schema[param].max, Math.max(schema[param].min, settings[param]));
        }
        else {
          checkedSettings[param] = schema[param].default;
        }
      }

      $(this).data('settings', checkedSettings);
      rrssbFix.call(this);
    };

    /**
     * Store original attribute values.
     * $(this) points to an instance of .rrssb
     */
    var rrssbInit = function() {
      // Store original values.
      var orig = {
        width: 0,
        buttons: 0,
        height: $('li', this).innerHeight(),
        fontSize: parseFloat($(this).css("font-size")),
        prefixWidth: $('.rrssb-prefix', this).innerWidth(),
      };

      $('li', this).each(function() {
        orig.width = Math.max(orig.width, $(this).innerWidth());
        orig.buttons++;
      });

      $(this).data('orig', orig);
      return orig;
    }

    /**
     * Fix all sets of buttons on the page.
     */
    var fixAll = function() {
      $('.rrssb').each(rrssbFix);
    }

    /**
     * Main recalculte sizes function.
     * $(this) points to an instance of .rrssb
     */
    var rrssbFix = function() {
      var orig = $(this).data('orig');
      if (!orig) {
        orig = rrssbInit.call(this);
      }
      var settings = $(this).data('settings');
      var buttonWidth = orig.width * settings.size;
      var buttons = orig.buttons;

      // Modern browsers have sub-pixel support, so an element can have a fractional width internally.
      // This can get rounded up in the result of innerWidth, so subtract 1px to get a safe width.
      var containerWidth = $(this).innerWidth() - 1;

      // Set all buttons to match width of largest.
      // This width stays no matter what sizing, but it may get constrained down by a max-width.
      // In the case where the buttons are in a float with no fixed width, having the full
      // width set on each button ensures that the float is able to grow back up from no-labels to having labels again.
      // However, the container can't shrink below the size of one button.
      // For small containers make sure we have small buttons.
      // After changing this we need to let the browser recalculate then run again.
      var mini = (containerWidth <= buttonWidth);
      var lastMini = $(this).data('mini');
      if (mini != lastMini) {
        $(this).data('mini', mini);

        if (mini) {
          $('li', this).width('');
          $(this).addClass('no-label');
        }
        else {
          $('li', this).width(buttonWidth);
        }

        delayedFixAll(1);
        return;
      }

      var prefixWidth = orig.prefixWidth * settings.size;
      if (prefixWidth > containerWidth * settings.maxPrefix) {
        prefixWidth = 0;
      }

      var availWidth = containerWidth / settings.shrink - prefixWidth;
      var buttonsPerRow = Math.floor(availWidth / buttonWidth);
      var rowsNeeded = Math.max(settings.minRows, Math.ceil(buttons / buttonsPerRow));

      // Fix labels.
      if (rowsNeeded > settings.maxRows) {
        $(this).addClass('no-label');
        // Without label, button is square so width equals original height.
        buttonWidth = orig.height * settings.size;
        buttonsPerRow = Math.max(1, Math.floor(availWidth / buttonWidth));
        rowsNeeded = Math.max(settings.minRows, Math.ceil(buttons / buttonsPerRow));
      }
      else {
        $(this).removeClass('no-label');
      }

      // Set max width.
      buttonsPerRow = Math.ceil(buttons / rowsNeeded);
      var percWidth = Math.floor(10000 / buttonsPerRow) / 100;
      $('li', this).css('max-width', percWidth + '%');

      // Fix font size.
      var desiredWidth = buttonWidth * buttonsPerRow + prefixWidth;
      var scale = Math.min(1, containerWidth / desiredWidth);
      if (rowsNeeded > settings.minRows) {
        scale = Math.min(scale, settings.regrow);
      }

      var fontSize = orig.fontSize * settings.size;
      if (scale < 1) {
        // Reduce font size.
        // Reduce calculated value slightly as browser size calculations have some rounding and approximation.
        fontSize *= scale * 0.95;
      }
      $(this).css('font-size', fontSize + 'px');

      desiredWidth *= scale;
      if (containerWidth > desiredWidth) {
         // Set padding to ensure the buttons wrap evenly, for example 6 => 3+3 not 4+2.
         // Use a percentage to ensure that we don't have padding > size after a radical rescale.
        var padding = Math.floor(10000 * (containerWidth - desiredWidth) / containerWidth) / 100;
        $(this).css('padding-right', padding + '%');
      }
      else {
        $(this).css('padding-right', '');
      }

      //$(this).css('padding-left', prefixWidth * scale + 'px');
    };

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

    var timer;
    var delayedFixAll = function(ms) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(fixAll, ms ? ms : 200);
    };

    /**
     * Ready function
     */
    $(document).ready(function() {
        // Register event listners
        $('.rrssb-buttons a.popup').click(function popUp(e) {
            popupCenter($(this).attr('href'), $(this).find('.rrssb-text').html(), 580, 470);
            e.preventDefault();
        });

        $(window).resize(delayedFixAll);

        // Add another ready callback that will be called after all others.
        // Configure any buttons that haven't already been configured.
        $(document).ready(configAll);
    });

})(window, jQuery);
