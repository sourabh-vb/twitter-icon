/*!
 Ridiculously Responsive Social Sharing Buttons
 Team: @dbox, @joshuatuscan
 Site: http://www.kurtnoble.com/labs/rrssb
 Twitter: @therealkni

        ___           ___
       /__/|         /__/\        ___
      |  |:|         \  \:\      /  /\
      |  |:|          \  \:\    /  /:/
    __|  |:|      _____\__\:\  /__/::\
   /__/\_|:|____ /__/::::::::\ \__\/\:\__
   \  \:\/:::::/ \  \:\~~\~~\/    \  \:\/\
    \  \::/~~~~   \  \:\  ~~~      \__\::/
     \  \:\        \  \:\          /__/:/
      \  \:\        \  \:\         \__\/
       \__\/         \__\/
*/

+(function(window, $, undefined) {
	'use strict';

	/*
	 * Public Function
	 */

	 $.fn.rrssb = function( options ) {

		// Settings that $.rrssb() will accept.
		var settings = $.extend({
			description: undefined,
			emailAddress: undefined,
			emailBody: undefined,
			emailSubject: undefined,
			image: undefined,
			title: undefined,
			url: undefined
		}, options );

	};

	function rrssbFix() {
	  var origWidth = 0;
	  var buttons = 0;
	  $('li', this).each(function() {
	      origWidth += +$(this).attr('orig-width');
	      buttons++;
	  });
	  var containerWidth = $(this).width();
	  var fontSize = origWidth / buttons / 12;
	  if (containerWidth < origWidth) {
			$(this).addClass('small-format');
			$('li', this).addClass('small');
		}
		else {
			$(this).removeClass('small-format');
			$('li', this).removeClass('small');
			// enlarge font size if buttons get wide enough
			//$(this).css('font-size', fontSize + 'px');
			//$(this).css('font-size', '');
		}
	}
	
	var rrssbInit = function() {
		$('.rrssb-buttons').each(function(index) {
			$(this).addClass('rrssb-'+(index + 1));
		});

		//setPercentBtns();
		
		// grab initial width of each button and add as data attr
		$('.rrssb-buttons li').each(function() {
			$(this).attr('orig-width', $(this).innerWidth());
		});
		
		$('.rrssb-buttons').each(rrssbFix);
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
		if (window.focus) {
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

		$(document).click('.rrssb-buttons a.popup', {}, function popUp(e) {
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

	// Make global
	window.rrssbInit = rrssbInit;

})(window, jQuery);
