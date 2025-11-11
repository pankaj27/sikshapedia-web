
!(function($) {
  "use strict";

  // Toggle .headerFixed class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 1) {
      $('body').addClass('headerFixed');
      $('body').removeClass('withBannerHeader');
    } else {
      $('body').removeClass('headerFixed');
      $('body').addClass('withBannerHeader');
    }
  });

  // if ($(window).scrollTop() > 100) {
  //   $('body').addClass('headerFixed');
  // }



  // Intro carousel
  var heroCarousel = $("#heroCarousel");
  var heroCarouselIndicators = $("#hero-carousel-indicators");
  heroCarousel.find(".carousel-inner").children(".carousel-item").each(function(index) {
    (index === 0) ?
    heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "' class='active'></li>"):
      heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "'></li>");
  });
  heroCarousel.on('slid.bs.carousel', function(e) {
    $(this).find('h2').addClass('animate__animated animate__fadeInDown');
    $(this).find('p, .btn-get-started').addClass('animate__animated animate__fadeInUp');
  });


  var featyredSlider = new Swiper('#featyredSlider', {
    spaceBetween: 1,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 5,
      },
      1200: {
        slidesPerView: 6,
      },
    }
  });

  var collegeExmSlider = new Swiper('#collegeExmSlider', {
    spaceBetween: 22,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 4,
      },
      1024: {
        slidesPerView: 5,
      },
      1200: {
        slidesPerView: 6,
      },
    }
  });


  var quickLookThumb = new Swiper('#quickLookThumb', {
    slidesPerView: 'auto',
    spaceBetween: 10,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  var quickLookGal = new Swiper('#quickLookGal', {
    slidesPerView: 1,
    spaceBetween: 10,
    thumbs: {
      swiper: quickLookThumb
    }
  });
  

  // Clients carousel (uses the Owl Carousel library)
  $(".clients-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 2
      },
      768: {
        items: 4
      },
      900: {
        items: 6
      }
    }
  });

})(jQuery);



jQuery(document).ready(function($){
  
  $(".nicescroll").niceScroll();

  //open/close lateral filter
  $('.isa-filter-trigger').on('click', function(){
      triggerFilter(true);
  });
  $('.isa-filter .isa-close').on('click', function(){
      triggerFilter(false);
  });

  function triggerFilter($bool) {
      var elementsToTrigger = $([$('.isa-filter-trigger'), $('.isa-filter'), $('.isa-tab-filter'), $('.isa-filter-result')]);
      elementsToTrigger.each(function(){
          $(this).toggleClass('filter-is-visible', $bool);
          $("body").toggleClass('filter-is-visible', $bool);
      });
  }

  //mobile version - detect click event on filters tab
  var filter_tab_placeholder = $('.isa-tab-filter .placeholder a'),
      filter_tab_placeholder_default_value = 'Select',
      filter_tab_placeholder_text = filter_tab_placeholder.text();
  
  $('.isa-tab-filter li').on('click', function(event){
   
      //detect which tab filter item was selected
      var selected_filter = $(event.target).data('type');
          
      //check if user has clicked the placeholder item
      if( $(event.target).is(filter_tab_placeholder) ) {
          (filter_tab_placeholder_default_value == filter_tab_placeholder.text()) ? filter_tab_placeholder.text(filter_tab_placeholder_text) : filter_tab_placeholder.text(filter_tab_placeholder_default_value) ;
          $('.isa-tab-filter').toggleClass('is-open');

      //check if user has clicked a filter already selected 
      } else if( filter_tab_placeholder.data('type') == selected_filter ) {
          filter_tab_placeholder.text($(event.target).text());
          $('.isa-tab-filter').removeClass('is-open');	

      } else {
          //close the dropdown and change placeholder text/data-type value
          $('.isa-tab-filter').removeClass('is-open');
          filter_tab_placeholder.text($(event.target).text()).data('type', selected_filter);
          filter_tab_placeholder_text = $(event.target).text();
          
          //add class selected to the selected filter item
          $('.isa-tab-filter .selected').removeClass('selected');
          $(event.target).addClass('selected');
      }
  });
  
  //close filter dropdown inside lateral .isa-filter 
  $('.isa-filter-block h4').on('click', function(){
      $(this).toggleClass('closed').siblings('.isa-filter-content').slideToggle(300);
  })



  var clickEvent = false;
	$('#newsCarousel').carousel({
		interval:   4000	
	}).on('click', '.list-group li', function() {
			clickEvent = true;
			$('.list-group li').removeClass('active');
			$(this).addClass('active');		
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.list-group').children().length -1;
			var current = $('.list-group li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count == id) {
				$('.list-group li').first().addClass('active');	
			}
		}
		clickEvent = false;
  });
  

  $(".news-slider").owlCarousel({
    items : 3,
    itemsDesktop:[1199,3],
    itemsDesktopSmall:[980,2],
    itemsMobile : [600,1],
    autoPlay:true
});


});

$(window).load(function() {
  var boxheight = $('#newsCarousel .carousel-inner').innerHeight();
  var itemlength = $('#newsCarousel .carousel-item').length;
  var triggerheight = Math.round(boxheight/itemlength+1);
$('#newsCarousel .list-group-item').outerHeight(triggerheight);
});


var window_width = jQuery(window).width();
if(window_width >1170){
  $('.isa-filter-trigger,.isa-filter-result,.isa-filter, body').addClass('filter-is-visible');
}else{
  $('.isa-filter-trigger,.isa-filter-result,.isa-filter, body').removeClass('filter-is-visible'); 
}