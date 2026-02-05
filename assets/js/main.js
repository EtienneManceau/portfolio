/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (browser.name == 'ie' || browser.name == 'edge' || browser.mobile) ? function () { return $(this) } : function (intensity) {

		var $window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function () {

			var $t = $(this),
				on, off;

			on = function () {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function () {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function () {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			breakpoints.on('<=medium', off);
			breakpoints.on('>medium', on);

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function () {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Clear transitioning state on unload/hide.
	$window.on('unload pagehide', function () {
		window.setTimeout(function () {
			$('.is-transitioning').removeClass('is-transitioning');
		}, 250);
	});

	// Fix: Enable IE-only tweaks.
	if (browser.name == 'ie' || browser.name == 'edge')
		$body.addClass('is-ie');

	// Scrolly.
	$('.scrolly').scrolly({
		offset: function () {
			return $header.height() - 2;
		}
	});

	// Tiles.
	var $tiles = $('.tiles > article');

	$tiles.each(function () {

		var $this = $(this),
			$image = $this.find('.image'), $img = $image.find('img'),
			$link = $this.find('.link'),
			x;

		// Image.

		// Set image.
		$this.css('background-image', 'url(' + $img.attr('src') + ')');

		// Set position.
		if (x = $img.data('position'))
			$image.css('background-position', x);

		// Hide original.
		$image.hide();

		// Link.
		if ($link.length > 0) {

			$x = $link.clone()
				.text('')
				.addClass('primary')
				.appendTo($this);

			$link = $link.add($x);

			$link.on('click', function (event) {

				var href = $link.attr('href');

				// Prevent default.
				event.stopPropagation();
				event.preventDefault();

				// Target blank?
				if ($link.attr('target') == '_blank') {

					// Open in new tab.
					window.open(href);

				}

				// Otherwise ...
				else {

					// Start transitioning.
					$this.addClass('is-transitioning');
					$wrapper.addClass('is-transitioning');

					// Redirect.
					window.setTimeout(function () {
						location.href = href;
					}, 500);

				}

			});

		}

	});

	// Header.
	if ($banner.length > 0
		&& $header.hasClass('alt')) {

		$window.on('resize', function () {
			$window.trigger('scroll');
		});

		$window.on('load', function () {

			$banner.scrollex({
				bottom: $header.height() + 10,
				terminate: function () { $header.removeClass('alt'); },
				enter: function () { $header.addClass('alt'); },
				leave: function () { $header.removeClass('alt'); $header.addClass('reveal'); }
			});

			window.setTimeout(function () {
				$window.triggerHandler('scroll');
			}, 100);

		});

	}

	// Banner.
	$banner.each(function () {

		var $this = $(this),
			$image = $this.find('.image'), $img = $image.find('img');

		// Parallax.
		$this._parallax(0.275);

		// Image.
		if ($image.length > 0) {

			// Set image.
			$this.css('background-image', 'url(' + $img.attr('src') + ')');

			// Hide original.
			$image.hide();

		}

	});

	// Menu.
	var $menu = $('#menu'),
		$menuInner;

	$menu.wrapInner('<div class="inner"></div>');
	$menuInner = $menu.children('.inner');
	$menu._locked = false;

	$menu._lock = function () {

		if ($menu._locked)
			return false;

		$menu._locked = true;

		window.setTimeout(function () {
			$menu._locked = false;
		}, 350);

		return true;

	};

	$menu._show = function () {

		if ($menu._lock())
			$body.addClass('is-menu-visible');

	};

	$menu._hide = function () {

		if ($menu._lock())
			$body.removeClass('is-menu-visible');

	};

	$menu._toggle = function () {

		if ($menu._lock())
			$body.toggleClass('is-menu-visible');

	};

	$menuInner
		.on('click', function (event) {
			event.stopPropagation();
		})
		.on('click', 'a', function (event) {

			var href = $(this).attr('href');

			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$menu._hide();

			// Redirect.
			window.setTimeout(function () {
				window.location.href = href;
			}, 250);

		});

	$menu
		.appendTo($body)
		.on('click', function (event) {

			event.stopPropagation();
			event.preventDefault();

			$body.removeClass('is-menu-visible');

		})
		.append('<a class="close" href="#menu">Close</a>');

	$body
		.on('click', 'a[href="#menu"]', function (event) {

			event.stopPropagation();
			event.preventDefault();

			// Toggle.
			$menu._toggle();

		})
		.on('click', function (event) {

			// Hide.
			$menu._hide();

		})
		.on('keydown', function (event) {

			// Hide on escape.
			if (event.keyCode == 27)
				$menu._hide();

		});

})(jQuery);

function spawnSecretFace() {
	let x = Math.random() * (window.innerWidth - 180);
	let y = Math.random() * (window.innerHeight - 148);
	let faceVisible = true;

	const face = document.createElement("a");
	face.href = "secret.html";
	face.target = "_blank";
	face.style.position = "fixed";
	face.style.width = "180px";
	face.style.height = "148px";
	face.style.backgroundImage = "url('assets/minijeux/multiman-face.png')";
	face.style.backgroundSize = "cover";
	face.style.left = `${x}px`;
	face.style.top = `${y}px`;
	face.style.zIndex = "9999";
	face.style.transition = "left 0.2s, top 0.2s";

	function updateFace() {
		if (!faceVisible) {
			face.remove();
			return;
		}
		// Move towards the mouse cursor in a very weird way
		if (spawnSecretFace.mouse) {
			const t = Date.now();
			const targetX = spawnSecretFace.mouse.x - 90;
			const targetY = spawnSecretFace.mouse.y - 74;

			// Add weirdness: oscillate, jitter, and random jumps
			const weirdX = Math.sin(t / 120) * 30 + Math.cos(t / 333) * 18 + (Math.random() - 0.5) * 8;
			const weirdY = Math.cos(t / 200) * 25 + Math.sin(t / 444) * 15 + (Math.random() - 0.5) * 8;

			// Sometimes jump a bit
			if (Math.random() < 0.01) {
				x += (Math.random() - 0.5) * 120;
				y += (Math.random() - 0.5) * 120;
			}

			// Move with a weird, slow, oscillating interpolation
			x += ((targetX + weirdX) - x) * (0.01 + Math.abs(Math.sin(t / 1000)) * 0.02);
			y += ((targetY + weirdY) - y) * (0.01 + Math.abs(Math.cos(t / 1000)) * 0.02);
		}
		x = Math.max(0, Math.min(window.innerWidth - 180, x));
		y = Math.max(0, Math.min(window.innerHeight - 148, y));
		face.style.left = `${x}px`;
		face.style.top = `${y}px`;
		requestAnimationFrame(updateFace);
	}

	face.addEventListener("click", () => {
		faceVisible = false;
		face.remove();
	});

	window.addEventListener("mousemove", e => {
		spawnSecretFace.mouse = { x: e.clientX, y: e.clientY };
	});

	setTimeout(() => {
		document.body.appendChild(face);
		updateFace();
	}, 0);
}

// Spawn after 5 minutes (300000 ms)
setTimeout(spawnSecretFace, 300000);

