window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

});

// Case dots – initialise as early as possible (independent of jQuery)
document.addEventListener('DOMContentLoaded', function () {
  const cases = Array.from(document.querySelectorAll('#cases-wrapper [data-case]'));
  const dotsContainer = document.getElementById('cases-dots');

  if (cases.length && dotsContainer) {
    let idx = 0;
    let animating = false;
    var ANIM_DURATION = 400; // ms, must match CSS animation-duration

    // If dots already exist in HTML, use them; otherwise create them dynamically
    var existingDots = dotsContainer.querySelectorAll('.case-dot');
    if (existingDots.length === 0) {
      cases.forEach(function (_, i) {
        var dot = document.createElement('span');
        dot.classList.add('case-dot');
        dot.setAttribute('data-index', i);
        if (i === 0) dot.classList.add('is-active');
        dotsContainer.appendChild(dot);
      });
    }

    const dots = Array.from(dotsContainer.querySelectorAll('.case-dot'));

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        if (animating || i === idx) return;
        switchTo(i);
      });
    });

    function clearAnimClasses(el) {
      el.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
    }

    function switchTo(newIdx) {
      if (animating) return;
      animating = true;

      var oldIdx = idx;
      var direction = newIdx > oldIdx ? 'left' : 'right';
      var oldCase = cases[oldIdx];
      var newCase = cases[newIdx];

      // Pause all videos
      cases.forEach(function (caseEl) {
        var videos = caseEl.querySelectorAll('video');
        videos.forEach(function (video) { video.pause(); });
      });

      // Clear any leftover animation classes
      cases.forEach(function (el) { clearAnimClasses(el); });

      // Animate old case out
      oldCase.classList.add(direction === 'left' ? 'slide-out-left' : 'slide-out-right');

      // Animate new case in
      newCase.classList.add(direction === 'left' ? 'slide-in-right' : 'slide-in-left');

      // Update dots immediately
      idx = newIdx;
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === idx); });

      // After animation ends, clean up
      setTimeout(function () {
        clearAnimClasses(oldCase);
        oldCase.classList.remove('is-active');

        clearAnimClasses(newCase);
        newCase.classList.add('is-active');

        animating = false;
      }, ANIM_DURATION);
    }

    // Initial render (no animation)
    cases.forEach(function (el, i) { el.classList.toggle('is-active', i === idx); });
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === idx); });
  }
});