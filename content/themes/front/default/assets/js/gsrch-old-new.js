var data_length = 12;
var data_start = 0;
var hasNext = true;
var apiUrl = "https://staging.sikshapedia.com/api/listing?data=" + _pgid + "&length=" + data_length + "&start=" + data_start;


var collegesListContainer = document.getElementById("udata_lists");
var last_response_code = 200;

// Flag to indicate whether an API request is in progress
var isFetching = false;

// Maximum number of retries
var maxRetries = 3;

// Variable to store the previous scroll position
var prevScrollPos = window.pageYOffset;

// Add an event listener for the scroll event
window.addEventListener('scroll', function () {
  // Get the current scroll position
  var currentScrollPos = window.pageYOffset;

  // Check if the user has scrolled down and no API request is in progress
  if (currentScrollPos > prevScrollPos && !isFetching && isCloseToBottom()) {
    // Retrieve a value from sessionStorage
    var _hasNext = sessionStorage.getItem('hasNext');

    // Check if _hasNext is truthy (considering it might be a string)
    if (_hasNext === 'true') {
      // Call fetchData when the user scrolls down
      fetchDataAndRender();
    }
  }

  // Update the previous scroll position
  prevScrollPos = currentScrollPos;
});

function isCloseToBottom() {
  // Calculate the distance from the bottom of the page
  var distanceToBottom = document.body.offsetHeight - (window.innerHeight + window.scrollY);

  // Adjust the threshold as needed
  return distanceToBottom < 200;
}

// Define a function to fetch data
async function fetchDataAndRender() {
  // Fetch data
  const response = await fetch(apiUrl);
  const data = await response.json();

  var apiData = data.data.colleges;
  hasNext = data.data.hasNext;
  var dataCount = data.data.count;
  // Convert hasNext to boolean and store it in sessionStorage
  sessionStorage.setItem('hasNext', Boolean(hasNext));

  if (apiData && apiData.length > 0) {

    // Your existing code for processing and rendering data
    var dt = ''; // Reset dt for the next set of data
    apiData.forEach((v, index) => {
      
 
      // Append the constructed HTML to dt
      if(v.college_facilities!=''){
        // Assuming your JSON data is stored in a variable called 'collegeData'
        var collegeFacilities = v.college_facilities;

        var facilityIcons='';

        // Loop through the facilities array and extract the 'icon' values
        for (var i = 0; i < collegeFacilities.length; i++) {
            var facilityIcon = collegeFacilities[i].icon;

            facilityIcons += '<a href="javascript::void(0);" class="swiper-slide navLink">'+
                      '<img src="'+facilityIcon+'" width="25px" height="25px;">'+
                    '</a>';
        }
      }

      var is_featured='';

      if(v.college_is_featured==='1'){
              
        is_featured+='<div class="pro-label pro-featured">'+
          '<span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>'+
        '</div>';
        
      }

      var photos='';
            
      if(v.college_photo_count>0){
        photos+='<div class="proReview">'+
          '<i class="far fa-image"></i>'+
          '<b>'+
            '<a href="'+v.college_url+'/gallery">'+
             '<span style="color:#ffffff;"> '+v.college_photo_count+'</span>'+
            '</a>'+
          '</b>'+
        '</div>';
      }

      var reviews='';

      if(v.college_review_rating>0){
        reviews+='<div class="proRating">'+
                    '<small class="d-block">REVIEW</small>'+
                    '<i class="fas fa-star-half-alt"></i> <b>'+v.college_review_rating+'/10</b>'+ 
                  '</div>';
      }

      var courses_data='';
      var exams_data='';
      // Assuming your JSON data is stored in a variable called 'collegeData'
      var courses = v.college_courses_data;
      var clength=courses.length;
      var exams = v.college_exams;
      var exlength=courses.length;

      if(v.college_courses_data!=''){

         // Loop through the facilities array and extract the 'icon' values
          for (var i = 0; i < clength; i++) {
              courses_data += '<a href="'+courses[i].course_link+'" class="infoItem">'+
                  '<h4>'+
                    '<strong> '+courses[i].course_cost+'</strong>'+
                  '</h4>'+
                  '<p style="font-size:10px;">'+courses[i].course_name+'</p>'+
                '</a>';
          }

        if(clength<2){
          if(exlength>0 && exams!='no_data'){
            for (var i = 0; i < exlength; i++) {
              courses_data += '<a href="javascript::void(0);" class="infoItem">'+
                  '<h4>'+
                    '<strong> '+exams[i].exam_short_name+'</strong>'+
                  '</h4>'+
                  '<p style="font-size:10px;">exam accepted</p>'+
                '</a>';
            }
          }else{
            courses_data += '<a href="javascript::void(0);" class="infoItem">'+
                  '<h4>'+
                    '<strong> --</strong>'+
                  '</h4>'+
                  '<p style="font-size:10px;">--</p>'+
                '</a>';
          }
        }else if(clength==2){
          if(exlength>0 && exams!='no_data'){
            for (var i = 0; i < exlength; i++) {
              courses_data += '<a href="javascript::void(0);" class="infoItem">'+
                  '<h4>'+
                    '<strong> '+exams[i].exam_short_name+'</strong>'+
                  '</h4>'+
                  '<p style="font-size:10px;">exam accepted</p>'+
                '</a>';
            }
          }
        }
        
       
      }else{
        if(exlength>0 && exams!='no_data'){
          for (var i = 0; i < exlength; i++) {
            courses_data += '<a href="javascript::void(0);" class="infoItem">'+
                '<h4>'+
                  '<strong> '+exams[i].exam_short_name+'</strong>'+
                '</h4>'+
                '<p style="font-size:10px;">exam accepted</p>'+
              '</a>';
          }
        }else{
          courses_data += '<a href="javascript::void(0);" class="infoItem">'+
                '<h4>'+
                  '<strong> --</strong>'+
                '</h4>'+
                '<p style="font-size:10px;">--</p>'+
              '</a>';
        }
      }

      var rankingdata='';

      if(v.college_ranking_data!=''){              

        var rank_data=v.college_ranking_data;
        var rank_text='';

       for(var i=0;i<rank_data.length;i++){
          if(rank_data[i].ranking_value>0){
            rank_text='Ranked '+rank_data[i].ranking_value+' in '+rank_data[i].ranking_year+' out of '+rank_data[i].ranking_value_outof;
          }else{
            rank_text='Ranked in '+rank_data[i].ranking_year;
          }
          rankingdata+='<a href="javascript::void(0);" class="swiper-slide navLink" style="align:center;">'+
          '<div class="rankPanel">'+
            '<div class="rankSpan">'+rank_text+'</div>'+
            '<div class="rankName"> '+rank_data[i].rank_body+' </div>'+
          '</div>'+
        '</a>';

        }
      }else{
        rankingdata+='<a href="javascript::void(0);" class="swiper-slide navLink" style="align:center;">'+
          '<div class="rankPanel">'+
            '<div class="rankSpan"></div>'+
            '<div class="rankName"></div>'+
          '</div>'+
        '</a>';
      }


      dt+='<div class="col-sm-6 col-md-4 col-lg-4 grid_list">'+
            '<div class="proBox">'+
              '<div class="imgBox">'+
                '<a href="'+v.college_url+'">'+
                  '<img class="lazy" src="'+v.college_banner+'" alt="'+v.college_banner_alt+'">'+
                '</a>'+is_featured+photos+reviews+
                '<div class="pro-action">'+
                  '<div class="pro-action-inner">'+
                    '<!-- <div class="social-share" data-toggle="tooltip" title="Share"><div class="social-share-hover"><i class="fa fa-share-alt"></i><div class="social-share-list"><div class="list-social-icon clearfix"><a href="javascript:;"><i class="fab fa-facebook"></i></a><a href="javascript:;"><i class="fab fa-twitter"></i></a><a href="javascript:;"><i class="fab fa-google-plus"></i></a><a href="javascript:;"><i class="fab fa-linkedin"></i></a></div></div></div></div> -->'+
                    '<!-- <a href="javascript:;" class="property-favorite" data-toggle="tooltip" title="Add to Favorite"><i class="far fa-heart"></i></a><a class="compare-property" href="javascript:;" data-toggle="tooltip" title="Rating"><i class="far fa-star"></i></a> -->'+
                  '</div>'+
                  '<a class="pro-link" href="#"></a>'+
                '</div>'+
              '</div>'+
              '<div class="proBoxBody">'+
                '<div class="proInfo">'+
                  '<div class="infoImg">'+
                    '<a href="'+v.college_url+'">'+
                      '<img class="lazy" src="'+v.college_logo+'" alt="'+v.college_logo_alt+'" loading="lazy" width="50px" height="50px">'+
                    '</a>'+
                  '</div>'+
                  '<p class="infoTitle">'+
                    '<a href="'+v.college_url+'">'+v.college_name+'</a>'+
                  '</p>'+
                  '<p class="infoLocation" style="font-size: 10px;">'+
                    '<i class="fas fa-map-marker-alt"></i> '+v.college_city+','+v.college_state+
                      ' <span style="margin-left: 10px;font-size: 10px;">'+
                      '<i class="fas fa-bookmark"></i> '+v.college_affiliations+' </span>'+
                  '</p>'+
                '</div>'+
                '<div class="infoItems" style="height:60px !important;min-height: 60px !important;">'+
                  courses_data+exams_data+
                '</div>'+
                '<div class="swiper-container tabSlider navTabSlider rankSwiper">'+
                  '<div class="swiper-wrapper" style="margin-left: 20px;margin-right: 20px;">'+
                  rankingdata+                            
                  '</div>'+
                  '<div class="swiper-scrollbar"></div>'+
                  '<!-- <div class="swiper-button-next swiper-button-white"></div><div class="swiper-button-prev swiper-button-white"></div> -->'+
                '</div>'+


                '<div class="swiper-container tabSlider navTabSlider mySwiper">'+
                  '<div class="swiper-wrapper" style="padding-left: 10px;padding-right: 10px;">'+
                    facilityIcons+
                  '</div>'+
                  '<div class="swiper-button-next swiper-button-white"></div>'+
                  '<div class="swiper-button-prev swiper-button-white"></div>'+
                '</div>'+


                '<div class="linkItems">'+
                  '<a href="'+v.college_url+'/reviews" target="_blank">REVIEWS</a>'+
                  '<a href="'+v.college_url+'/course-and-fees" target="_blank">COURSES & FEES</a>'+
                '</div>'+
                '<div class="btnGroup">'+
                  '<a href="javascript:void(0);" class="apply" data-cname="'+v.college_name+'" data-inst="" data-inst_type="" data-clogo="'+v.college_logo+'" data-cphcode="+91" data-cou="">'+
                    '<i class="far fa-file-alt"></i>'+
                    '<span style="margin-left:5px;">Apply Now</span>'+
                  '</a>'+
                  '<a href="'+v.college_url+'" class="download"> Explore</a>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>';

  });

    // Append dt to the collegesListContainer.innerHTML outside the forEach loop
    collegesListContainer.innerHTML += dt;

    // Increment data_start based on data count
    data_start += data_length;//apiData.length;

    // Check if remaining data is less than a certain threshold and hasNext is true before making the next API call
    if (data.hasNext && data_start < data.dataCount) {
      apiUrl = "https://staging.sikshapedia.com/api/listing?data=" + _pgid + "&length=" + data.data_length + "&start=" + data_start;
      await fetchDataAndRender(); // Trigger the next API call
    } else {
      console.log('Reached the end of data. No more API calls needed.');
    }
  } else {
    console.log('No more data to load.');
  }
}

// Call the function to initiate the process
fetchDataAndRender();