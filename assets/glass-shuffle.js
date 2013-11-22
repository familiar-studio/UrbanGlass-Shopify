var SHUFFLE = (function( $ ) {
  'use strict';

  var $grid = $('#grid'),
      $filterOptions = $('.filter-options'),
      $sizer = $grid.find('.shuffle__sizer'),

  init = function() {
    // None of these need to be executed synchronously
    setTimeout(function() {
      listen();
      setupSorting();
    }, 100);

    // instantiate the plugin
    $grid.shuffle({
      itemSelector: '.sort',
      sizer: $sizer
    });
  },

  setupSorting = function() {
    // Sorting options
    $('.sort-options').on('change', function() {
      console.log("Sorting.");
      var sort = this.value,
          opts = {};

      // We're given the element wrapped in jQuery
      if ( sort === 'price' ) {
        opts = {
          reverse: true,
          by: function($el) {
            return $el.data('price');
          }
        };
      } else if ( sort === 'title' ) {
        opts = {
          by: function($el) {
            return $el.data('title').toLowerCase();
          }
        };
      }
      console.log(opts);
      // Filter elements
      $grid.shuffle('sort', opts);
    });
  },


  // Re layout shuffle when images load. This is only needed
  // below 768 pixels because the .picture-item height is auto and therefore
  // the height of the picture-item is dependent on the image
  // I recommend using imagesloaded to determine when an image is loaded
  // but that doesn't support IE7
  listen = function() {
    var debouncedLayout = $.throttle( 300, function() {
      $grid.shuffle('update');
    });

    // Get all images inside shuffle
    $grid.find('img').each(function() {
      var proxyImage;

      // Image already loaded
      if ( this.complete && this.naturalWidth !== undefined ) {
        return;
      }

      // If none of the checks above matched, simulate loading on detached element.
      proxyImage = new Image();
      $( proxyImage ).on('load', function() {
        $(this).off('load');
        debouncedLayout();
      });

      proxyImage.src = this.src;
    });

    // Because this method doesn't seem to be perfect.
    setTimeout(function() {
      debouncedLayout();
    }, 500);
  };

  return {
    init: init
  };
}( jQuery ));



$(document).ready(function() {
  SHUFFLE.init();
});