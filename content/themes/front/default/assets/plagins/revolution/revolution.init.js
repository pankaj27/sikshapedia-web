
!(function($) {
  "use strict";

    /*=================
    Revolution slider
    ============*/

    $("#rev_slider_19_1").show().revolution({
      sliderType: "standard",
      jsFileLocation: "//localhost:82/revslider/revslider/public/assets/js/",
      sliderLayout: "fullscreen",
      dottedOverlay: "none",
      delay: 4000,
      navigation: {
          keyboardNavigation: "off",
          keyboard_direction: "horizontal",
          mouseScrollNavigation: "off",
          mouseScrollReverse: "default",
          onHoverStop: "on",
          bullets: {
              enable: false,
              hide_onmobile: true,
              hide_under: 767,
              style: "wexim",
              hide_onleave: false,
              direction: "vertical",
              h_align: "left",
              v_align: "center",
              h_offset: 30,
              v_offset: 0,
              space: 5,
              tmp: '<div class="tp-bullet-inner"></div><div class="tp-line"></div>'
          },
           arrows: {
                 style: "gyges",
                 enable: true,
                 hide_onmobile: true,
                 hide_under: 767,
                 hide_onleave: false,
                 tmp: '',
                 left: {
                     h_align: "left",
                     v_align: "center",
                     h_offset: 20,
                     v_offset: 0
                 },
                 right: {
                     h_align: "right",
                     v_align: "center",
                     h_offset: 20,
                     v_offset: 0
                 }
             },
          touch: {
              touchenabled: "on",
              swipe_threshold: 75,
              swipe_min_touches: 1,
              swipe_direction: "horizontal",
              drag_block_vertical: false
          },
      },
      responsiveLevels: [1240, 1024, 778, 480],
      gridwidth: [1140, 1024, 750, 480],
      gridheight: [600, 500, 500, 350],
      lazyType: "none",
      scrolleffect: {
          on_slidebg: "on",
      },
      parallax: {
          type: "mouse",
          origo: "slidercenter",
          speed: 2000,
          speedbg: 0,
          speedls: 0,
          levels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          disable_onmobile: "on"
      },
      shadow: 0,
      spinner: "off",
      stopLoop: "off",
      stopAfterLoops: -1,
      stopAtSlide: -1,
      onHoverStop: "on",
      shuffle: "off",
      autoHeight: "off",
      fullScreenAutoWidth: "off",
      fullScreenAlignForce: "off",
      fullScreenOffsetContainer: "",
      fullScreenOffset: "90px",
      disableProgressBar: "off",
      hideThumbsOnMobile: "on",
      hideSliderAtLimit: 0,
      hideCaptionAtLimit: 0,
      hideAllCaptionAtLilmit: 0,
      debugMode: false,
      fallbacks: {
          simplifyAll: "off",
          nextSlideOnWindowFocus: "off",
          disableFocusListener: false,
      }
  });


      /*==========================================
      rev slider
      ============================================*/



})(jQuery);





