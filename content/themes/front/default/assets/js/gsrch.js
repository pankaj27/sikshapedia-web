/***Main Search***/

var data_length = 12;
var data_start = 0;
var hasNext = true;
var apiUrl = "https://staging.sikshapedia.com/api/listing?data=" + _pgid + "&length=" + data_length + "&start=" + data_start+"&stu_id="+_sid+"&utype="+_utype;


var collegesListContainer = document.getElementById("udata_lists");
var breadcrumb_title=document.getElementById('breadcrumb_title');
var breadcrumbContainer = document.getElementById("breadcrumb_li");
var last_response_code = 200;

// Flag to indicate whether an API request is in progress
var isFetching = false;

// Maximum number of retries
var maxRetries = 3;

// Variable to store the previous scroll position
var prevScrollPos = window.pageYOffset;





// Define a function to fetch data
async function fetchDataAndRender(apiUrl) {
  
  try{
    if (isDataInCache(apiUrl) && !isCacheExpired(apiUrl)) {
      // Load data from cache
      var cachedData = getDataFromCache(apiUrl);
      renderData(cachedData);
    }else{
      // Fetch data
      const response = await fetch(apiUrl);
      const data = await response.json();

      var apiData = data.data.colleges;
      hasNext = data.data.hasNext;
      var dataCount = data.data.count;

      // Update sessionStorage with the new data
      sessionStorage.setItem('hasNext', Boolean(hasNext));
      sessionStorage.setItem('dataCount', dataCount);
      sessionStorage.setItem('dataStart', JSON.stringify(data_start));
      sessionStorage.setItem('apiData', JSON.stringify(apiData));

      // Save data to cache
      saveDataToCache(apiUrl, data);

      renderData(data);
    }
      
  } catch (error) {
    console.log('Error fetching data:', error);
    // Reset the flag in case of an error
    isFetching = false;
  }  
}


// Modify the fetchDataAndRender function to handle rendering data
function renderData(data) {
  var apiData = data.data.colleges;
  var slugData=data.data.slug_data.breadcrumb;
  hasNext = data.data.hasNext;
  var dataCount = data.data.count;



  if(slugData){
    var breadcrumb='';
    var li_active='';
    var aria_cpage='';
    var active_link='';

    console.log(slugData);

    // Access both keys and values
    for (const key in slugData) {

        const value = slugData[key];
    

        if(slugData[key]!=''){
          li_active='active';
          aria_cpage='aria-current="page"';
          active_link='<a href="'+slugData[key]+'">'+key+'</a> </li>';
        }else{
          active_link=key;
        }

        breadcrumb+='<li class="breadcrumb-item '+li_active+'" '+aria_cpage+'>'+active_link+'</li>';
    }

    breadcrumbContainer.innerHTML=breadcrumb;
  
  }

  if (apiData && apiData.length > 0) {

    // Your existing code for processing and rendering data
    var dt = ''; // Reset dt for the next set of data
    var i=0;
    apiData.forEach((v, index) => { 

      var facilityIcons='';      
 
      // Append the constructed HTML to dt
      if(v.college_facilities!=''){
        // Assuming your JSON data is stored in a variable called 'collegeData'
        var collegeFacilities = v.college_facilities;


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

      if(v.college_has_verified_badge==='yes'){
              
        is_featured+='<div class="badge-product-sale">'+
                          '<span class="new">Sikshapedia</span>'+
                          '<span class="percent">Verified</span>'+
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

      var favorite='';
      var liked='';
      if(v.college_is_favourite==true){
        liked='liked';
      }else{
        liked='';
      }
      favorite+='<div class="proReview proFavorite '+liked+'" onclick="addToFavourite(this,'+v.college_slg+')" data-bs-toggle="tooltip" data-bs-placement="right" title="Add to Favourite"  data-cid="'+v.college_id+'" data-fav_type="college">'+
          '<i class="far fa-heart"></i>'+
        '</div>';


      var compare='';
      if(v.college_is_compared==true){
        liked='liked';
      }else{
        liked='';
      }
      // compare+='<div class="proReview proCompare '+liked+'" id="favourite_college_'+v._id+'" onclick="addToCompare(this,'+v.college_slg+')" data-bs-toggle="tooltip" data-bs-placement="right" title="Add to Compare" data-cid="'+v.college_id+'" data-comp_type="college">'+
      //     '<i class="fas fa-object-group"></i>'+
      //   '</div>';



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

      if(clength>0 && courses!='no_data'){

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
              if(exams[i]){
                courses_data += '<a href="javascript::void(0);" class="infoItem">'+
                  '<h4>'+
                    '<strong> '+exams[i].exam_name+'</strong>'+
                  '</h4>'+
                  '<p style="font-size:10px;">exam accepted</p>'+
                '</a>';
              }
              
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
          console.log('Exlength:'+exlength);
          if(exlength>0 && exams!='no_data'){
            for (var i = 0; i < exlength; i++) {
              if(exams[i]){
                courses_data += '<a href="javascript::void(0);" class="infoItem">'+
                  '<h4>'+
                    '<strong> '+exams[i].exam_name+'</strong>'+
                  '</h4>'+
                  '<p style="font-size:10px;">exam accepted</p>'+
                '</a>';
              }
            }
          }
        }
        
       
      }else{
        if(exlength>0 && exams!='no_data'){
          
          for (var i = 0; i < exlength; i++) {
            if(exams[i]){
                courses_data += '<a href="javascript::void(0);" class="infoItem">'+
                  '<h4>'+
                    '<strong> '+exams[i].exam_name+'</strong>'+
                  '</h4>'+
                  '<p style="font-size:10px;">exam accepted</p>'+
                '</a>';
              }
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
                  '<img class="lazy" src="'+v.college_banner+'" alt="'+v.college_name+'">'+
                '</a>'+is_featured+photos+reviews+favorite+compare+
                '<div class="pro-action">'+
                  '<div class="pro-action-inner">';
                    if(v.college_intro_video!=''){
                      dt+='<a href="'+v.college_intro_video+'" data-fancybox class="property-video" data-toggle="tooltip" title="'+v.college_name+'"><i class="fab fa-youtube"></i></a>';
                    }
                  dt+='</div>'+
                  '<!--<a class="pro-link" href="#"></a>-->'+
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
                


                '<div class="swiper-container tabSlider navTabSlider mySwiper">'+
                  '<div class="swiper-wrapper" style="padding-left: 10px;padding-right: 10px;">'+
                    facilityIcons+
                  '</div>'+
                  '<div class="swiper-button-next swiper-button-white"></div>'+
                  '<div class="swiper-button-prev swiper-button-white"></div>'+
                '</div>'+


                '<div class="linkItems">'+
                  '<a href="'+v.college_url+'/review" target="_blank">REVIEWS</a>'+
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

          i++;

    });

   

    //if(i==1){
      dt += '<div class="row" style="width:100% !important; display: flex; justify-content: center; align-items: center;">' +
        '<div class="adBlock" style="padding-top: 10px; margin-bottom: -42px; display: flex; justify-content: center; align-items: center; flex-direction: column;">' +
          '<div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important; margin-top: -11px!important; background: #f5f8f905!important; display: flex; justify-content: center; align-items: center; flex-direction: column;">' +
            '<div class="adBlock" style="display: flex; justify-content: center; align-items: center; flex-direction: column;">' +
              '<div class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important; margin-top: -11px!important; background: #f5f8f905!important; display: flex; justify-content: center; align-items: center; flex-direction: column;">' +
                '<div class="mb-4" style="text-align:center; display: flex; justify-content: center; align-items: center;">' +
                  '<img src="'+data.data.college_ads+'" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" alt="" title="" loading="lazy" class="ads_link">' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    //}

    // Append dt to the collegesListContainer.innerHTML outside the forEach loop
    collegesListContainer.innerHTML += dt;
      //console.log('hasNext:'+hasNext)

    // Check if remaining data is less than a certain threshold and hasNext is true before making the next API call
    if (hasNext && data_start < dataCount) {
      // Reset the flag since the API request is completed
      isFetching = false;
    } else {
      console.log('Reached the end of data. No more API calls needed.');
    }
  } else {
    console.log('No more data to load.');
  }
}


// Function to check if the API parameters have changed
function areApiParametersChanged(newUrl) {
  return newUrl !== apiUrl;
}

// Function to check if data is available in the cache
function isDataInCache(apiUrl) {
  return localStorage.getItem(apiUrl) !== null;
}

// Function to get data from cache
function getDataFromCache(apiUrl) {
  return JSON.parse(localStorage.getItem(apiUrl));
}

// Function to save data to cache
function saveDataToCache(apiUrl, data) {
  const cacheData = {
    timestamp: new Date().getTime(),
    data: data,
  };
  const cacheKey = getCacheKey(apiUrl); // New function to get a unique cache key
  localStorage.setItem(cacheKey, JSON.stringify(cacheData));

  // Store session start time only on the first save
  if (!sessionStorage.getItem('sessionStartTime')) {
    sessionStorage.setItem('sessionStartTime', new Date().getTime().toString());
  }
}

// Function to get a unique cache key based on the API URL and other factors
function getCacheKey(apiUrl) {
  // You can modify this as needed based on your application's requirements
  const uniqueKey = apiUrl + "_" + _pgid + "_" + data_length;
  return uniqueKey;
}

// Function to check if cached data has expired
function isCacheExpired(apiUrl) {
  const cacheKey = getCacheKey(apiUrl);
  const cacheData = JSON.parse(localStorage.getItem(cacheKey));

  if (cacheData && cacheData.timestamp) {
    const sessionStartTime = sessionStorage.getItem('sessionStartTime');
    const currentTime = new Date().getTime();
    const expirationTime = 60000; // Set the expiration time (e.g., 10 minutes)

    // Check if the session start time is available
    if (sessionStartTime) {
      return currentTime - parseInt(sessionStartTime) > expirationTime;
    }
  }

  return true; // If there's no timestamp or cache data, consider it expired
}


// Call the function to initiate the process
fetchDataAndRender(apiUrl);


// Scroll event listener for infinite scrolling
/*window.addEventListener('scroll', () => {
  var currentScrollPos = window.pageYOffset;

  if (currentScrollPos > prevScrollPos) {
    if (currentScrollPos + window.innerHeight >= collegesListContainer.offsetHeight) {
      if (!isFetching) {
        isFetching = true;
        data_start += data_length;

        var newApiUrl = "https://staging.sikshapedia.com/api/listing?data=" + _pgid + "&length=" + data_length + "&start=" + data_start;

        if (areApiParametersChanged(newApiUrl) || !isDataInCache(newApiUrl)) {
          apiUrl = newApiUrl;
          fetchDataAndRender(apiUrl);
        } else {
          // Load data from cache
          var cachedData = getDataFromCache(newApiUrl);
          renderData(cachedData);
          isFetching = false;
        }
      }
    }
  }

  prevScrollPos = currentScrollPos;
});*/

const handleScroll = debounce(() => {
    var currentScrollPos = window.pageYOffset;

    if (currentScrollPos > prevScrollPos) {
        if (currentScrollPos + window.innerHeight >= collegesListContainer.offsetHeight) {
            if (!isFetching) {
                isFetching = true;
                data_start += data_length;

                var newApiUrl = "https://staging.sikshapedia.com/api/listing?data=" + _pgid + "&length=" + data_length + "&start=" + data_start+"&utype="+_utype;

                if (areApiParametersChanged(newApiUrl) || !isDataInCache(newApiUrl)) {
                apiUrl = newApiUrl;
                fetchDataAndRender(apiUrl);
                } else {
                // Load data from cache
                var cachedData = getDataFromCache(newApiUrl);
                renderData(cachedData);
                isFetching = false;
                }
            }
        }
    }

    prevScrollPos = currentScrollPos;
}, 150); // Debounce wait time in milliseconds

// Set an interval to clear the cache after a certain time
setInterval(() => {
  localStorage.clear();
  sessionStorage.clear(); 
}, 36000);



// Helper function to check if user has scrolled near bottom
function isNearBottom() {
    const threshold = 100; // pixels from bottom to trigger load
    const position = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    return position + windowHeight >= documentHeight - threshold;
}
  
// Debounce function to prevent too many calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
        clearTimeout(timeout);
        func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add both scroll and touch events for better mobile support
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('touchmove', handleScroll, { passive: true });


/***Filters***/

var filterapiUrl = "https://staging.sikshapedia.com/api/listing-filters?country=" + _cntry;

if(_stat!=''){
  filterapiUrl+='&state='+_stat;
}

if(_cit!=''){
  filterapiUrl+='&city='+_cit;
}

if(__strm!=''){
  filterapiUrl+='&strm='+__strm;
}

var filterListContainer = document.getElementById("_filter_list");
var filterListContainer2 = document.getElementById("_filter_list_2");

async function loadData(_apiurl) {

  //reloadAds();

  try {
    // Fetch data from the API
    const response = await fetch(_apiurl);

    // Check if the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    var _apiData = data.data.topFilters;

    var _apiDataSelected = data.data.selectedFilters;

    var _apiData_2=data.data.topFiltersNext;

    var _dt='';
    var _dt2='';
    var _dt_selected='';

    // Check if _apiData is iterable
    if (!(_apiDataSelected && typeof _apiDataSelected[Symbol.iterator] === 'function')) {
      throw new Error('_apiDataSelected is not iterable');
    }else{
       // Iterate through topFilters array
      _apiDataSelected.forEach(filter => {
        for (const key in filter) {
          if (filter.hasOwnProperty(key)) {
            const filterDataSelected = filter[key];
            var selected_filters='';

            if (filterDataSelected.values && Array.isArray(filterDataSelected.values) && filterDataSelected.values.length > 0) {
              filterDataSelected.values.forEach(value => {
                
                selected_filters+='<a href="'+value.link+'" class="btn btn-xs btn-primary" style="border: 1px solid #000;color:#fff; border-radius: 50px;padding: 3px 12px;font-size: 11px !important;margin-left:2px;height:27px">'+value.text+' <span class="badge badge-light"></span> </a>'; 
              });

              _dt_selected+=selected_filters;
            }
          }
        }
      });
    }

    if(_dt_selected!=''){
      _dt+='<div class="isa-filter-block">'+
                      '<h4>Selected Filter</h4>'+
                      '<div class="isa-filter-content nicescroll">'+
                        _dt_selected+
                      '</div>'+
                    '</div>';
     }

    // Check if _apiData is iterable
    if (!(_apiData && typeof _apiData[Symbol.iterator] === 'function')) {
      throw new Error('_apiData is not iterable');
    }else{
      // Iterate through topFilters array
      _apiData.forEach(filter => {
        // Iterate through the properties of each filter object
        for (const key in filter) {
          if (filter.hasOwnProperty(key)) {
            const filterData = filter[key];
            var fi_dt='';
            var _fi_dt='';
            var _srch_field='';
            // Iterate through values array (if present)
            //console.log('filterData.values.length:'+filterData.values.length);
            if (filterData.values && Array.isArray(filterData.values) && filterData.values.length > 0) {
              filterData.values.forEach(value => {

                var inpType='radio';

                if(filterData.singleSelect){
                  inpType='radio';
                }else if(!filterData.singleSelect){
                  inpType='checkbox';
                }

                var link_d='';
                var link_id='';
                var link_title='';
                var link_meta_title='';
                var stat_checked='';

                if(value.link!=''){
                  link_d='data-link="'+value.link+'"';
                }

                if(value.link_id!=''){
                  link_id='data-link_id="'+value.link_id+'"';
                }

                if(value.title!=''){
                  link_title='data-link_title="'+value.title+'"';
                }


                if(value.meta_title!=''){
                  link_meta_title='data-link_meta_title="'+value.meta_title+'"';
                }

                fi_dt+='<li>'+
                          '<input class="filter '+key+'filter" type="'+inpType+'" name="'+key+'" id="radio'+key+value.value+'" value="'+value.value+'" '+value.selected+'>'+
                          '<label class="checkbox-label filter_'+key+'_label" for="radio'+key+value.value+'" data-filter_param="'+key+'" data-value="'+value.value+'" '+link_d+' '+link_id+' '+link_title+' '+link_meta_title+'>'+value.text+'</label>'+
                        '</li>';
              });
            }

            //console.log(fi_dt);

            if(filterData.searchEnable){
              _srch_field+='<div class="isa-filter-block">'+
                        '<div class="isa-filter-content">'+
                            '<input type="search" placeholder="'+filterData.searchPlaceholder+'" class="filter-search" data-filter="' + key + '">'+
                        '</div>'+
                    '</div>';
            }

             

            if(fi_dt!=''){
              _dt+='<div class="isa-filter-block">'+
                '<h4>'+filterData.text+'</h4>'+
                _srch_field+
                '<ul class="isa-filter-content list nicescroll" id="'+key+'_list">'+
                fi_dt+
                '</ul>'+
                '</div>';
            } 

            // Additional handling for other properties can be added here

            console.log(""); // Separate each filter for clarity
          }
        }

        // Append dt to the collegesListContainer.innerHTML outside the forEach loop
        filterListContainer.innerHTML += _dt;
      });

      // Add event listeners for search inputs
      var filterSearchInputs = document.querySelectorAll('.filter-search');
      filterSearchInputs.forEach(input => {
        input.addEventListener('input', handleFilterSearch);
      });

      // Add event listeners for radio buttons
      var radioButtons = document.querySelectorAll('.checkbox-label');
      radioButtons.forEach(radio => {
        radio.addEventListener('click', handleRadioChange);
      });
    } 


    //Check for 2nd filter
    if (!(_apiData_2 && typeof _apiData_2[Symbol.iterator] === 'function')) {
      throw new Error('_apiData is not iterable');
    } else {
      

      _apiData_2.forEach(filter => {
        // Iterate through the properties of each filter object
        // Initialize _dt2 before the loop
        var _dt2 = '';
        var ex_srch='';

        for (const key in filter) {
          if (filter.hasOwnProperty(key)) {
            const filterData2 = filter[key];
            var fin = '';
            // Iterate through values array (if present)
            if (filterData2.values && Array.isArray(filterData2.values) && filterData2.values.length>0) {
              filterData2.values.forEach(value => {
                fin += '<a href="https://www.sikshapedia.com/' + value.link + '" class="btn btn-xs btn-dark" style="border: 1px solid #000;color:#fff; border-radius: 50px;padding: 6px 12px;font-size: 12.352 !important;">' + value.text + '</a>';
              });
            }

            //console.log('fin:'+fin);

            if(fin!=''){
              _dt2 += '<div class="border-top py-2">'+
                        '<div class="filterBlock d-flex flex-wrap align-items-center">'+
                            '<span class="blockTitle" style="border-right:1px solid #0000004f;padding-right:5px;"> Select '+filterData2.text + '</span>  ' + fin+
                        '</div>'+
                      '</div>';
            }
            
          }
        }

        

        // Check if 'dataCount' exists in sessionStorage
       // if (sessionStorage.getItem('dataCount') !== null) {
          // 'dataCount' exists
          // console.log('dataCount exists');
          // ex_srch+='<div class="border-top py-2">'+
          //                 '<div class="filterBlock d-flex flex-wrap align-items-center">'+
          //                   '<input type="text" class="form-control" placeholder="Search from the list" id="input_srch_filter_here">'+
          //                 '</div>'+
          //               '</div>';
        // } else {
        //   // 'dataCount' does not exist
        //   ex_srch='';
        // }

        _dt2+=ex_srch;

        // Append _dt2 to the filterListContainer2.innerHTML inside the forEach loop
        filterListContainer2.innerHTML = _dt2;

        // Reset _dt2 for the next iteration
        _dt2 = '';
      });
    }

  } catch (error) {
    // Log any errors that occurred during the fetch
    console.error('Error fetching data:', error.message);
  }
}


// Function to handle filter search
function handleFilterSearch(event) {
  var filterKey = event.target.getAttribute('data-filter');
  var searchValue = event.target.value.toLowerCase();

  // Get the filter list
  var filterList = document.getElementById(filterKey + '_list');
  var filterItems = filterList.querySelectorAll('li');

  // Loop through filter items and hide/show based on search value
  filterItems.forEach(item => {
    var labelText = item.querySelector('.checkbox-label').innerText.toLowerCase();
    if (labelText.includes(searchValue)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Function to handle radio button change
function handleRadioChange(event) {
  var linkValue = event.target.getAttribute('data-link');
  var linkId = event.target.getAttribute('data-link_id');
  var linkTitle = event.target.getAttribute('data-link_title');
  var liMetaTitle = event.target.getAttribute('data-link_meta_title');
  var filterParam = event.target.getAttribute('data-filter_param');
  var filterParamData = event.target.getAttribute('data-value');

  collegesListContainer.innerHTML = '';

  if (liMetaTitle !== '' || liMetaTitle !== 'null') {
    document.title = liMetaTitle;
  }

  // Check if there is a link value
  if (linkValue) {
    // Update the browser address bar without redirecting
    history.replaceState(null, '', 'https://www.sikshapedia.com/' + linkValue);
    if (linkTitle !== 'null') {
      breadcrumb_title.innerHTML = linkTitle;
    } else {
      breadcrumb_title.innerHTML = '';
    }

    // Check if the parameter already exists in filterapiUrl
    var parameterExists = filterapiUrl.includes(filterParam);

    // Update filterapiUrl with the new filter parameter
    if (parameterExists) {
      // Replace the existing parameter value if different
      var regex = new RegExp(`(${filterParam}=)[^&]*`);
      if (!filterapiUrl.match(regex) || filterapiUrl.match(regex)[0].split('=')[1] !== filterParamData) {
        filterapiUrl = filterapiUrl.replace(regex, `$1${filterParamData}`);
      } else {
        // Parameter exists and values are the same, do nothing
      }
    } else {
      // Append the new parameter to filterapiUrl
      var separator = filterapiUrl.includes('?') ? '&' : '?';
      filterapiUrl += separator + `${filterParam}=${filterParamData}`;
    }

    filterListContainer.innerHTML = '';

    // Call the loadData function with the updated URL
    loadData(filterapiUrl);

    var __apiUrl = "https://staging.sikshapedia.com/api/listing?data=" + linkId + "&length=" + data_length + "&start=" + data_start;

    // Clear the existing data in collegesListContainer
    collegesListContainer.innerHTML = '';
    fetchDataAndRender(__apiUrl);
  }
}


// Call the async function to load and log the data
loadData(filterapiUrl);

function reloadAds() {
  let ads = document.querySelectorAll(".adsbygoogle");
  ads.forEach((ad) => {
      if (!ad.getAttribute("data-ad-status")) {
          try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
              console.warn("AdSense Error:", e);
          }
      }
  });
}



function addToFavourite(ctrl,slg) {
  var cid = $(ctrl).attr('data-cid');
  var fav_type = $(ctrl).attr('data-fav_type');
  
  // Determine if the item is currently liked
  var isLiked = $(ctrl).hasClass("liked"); // true = liked, false = not liked
   

  if (_sid != '') {
    // Toggle the class based on the server response
    if (isLiked) {
        $(ctrl).removeClass("liked"); // If already liked, remove it
    } else {
        $(ctrl).addClass("liked"); // If not liked, add it
    }
      $.ajax({
          type: 'POST',
          url: base_url + 'add_college_favourite?' + new Date().getTime(), // Prevent caching
          data: {
              [csrf_name]: csrf_hash,
              cid: cid,
              fav_type: fav_type,
              sid: _sid,
              liked: isLiked ? 0 : 1 // Send 0 if already liked, 1 if not liked
          },
          cache: false,
          success: function(d) {
              if (d.success) {
                 
              }
          }
      });
  } else {
      window.location.assign(base_url + 'signin?slg='+slg+'_favourite&cid='+cid);
  }
}


const $compareModal = $("#compareModal")

function addToCompare(ctrl, slg) {
  var cid = $(ctrl).attr('data-cid');
  var comp_type = $(ctrl).attr('data-comp_type');
  var isLiked = $(ctrl).hasClass("liked"); // Check if currently liked

  if (_sid != '') {
      // Toggle liked state immediately for a better UI experience
      $(ctrl).toggleClass("liked");

      $.ajax({
          type: 'POST',
          url: base_url + 'add_college_compare?' + new Date().getTime(), // Prevent caching
          dataType: 'json',
          data: {
              [csrf_name]: csrf_hash,
              cid: cid,
              comp_type: comp_type,
              sid: _sid,
              liked: isLiked ? 0 : 1 // Toggle liked state
          },
          cache: false,
          success: function(d) {
              if (d.success) {
                  $('#div_compared_colleges').html(d.html);
              }
          },
          complete: function(xhr) {
              // Only show the modal if it's not already displayed
              if (!$('#compareModal').hasClass('show')) {
                  $('#compareModal').modal('show');
              }
          }
      });
  } else {
      window.location.assign(base_url + 'signin?slg=' + slg + '_compare&cid=' + cid);
  }
}


$compareModal.on("hidden.bs.modal", function() {
  $hamburger.removeClass("is-active")
})


function delCompare(ctrl) {
  var did = $(ctrl).attr('data-id');
  var c_id = $(ctrl).attr('data-c_id');

  $.ajax({
      type: 'POST',
      url: base_url + 'del_college_compare?' + new Date().getTime(), // Prevent caching
      dataType: 'json',
      data: {
          [csrf_name]: csrf_hash,
          did: did
      },
      cache: false,
      success: function(d) {
          if (d.success) {
              $('#row' + did).remove();
              $('#rowV' + did).remove();
              $('#favourite_college_' + c_id).removeClass('liked');

              // Check if #div_compared_colleges is empty
              if ($('#div_compared_colleges').children().length === 0) {
                  $('#compareModal').modal('hide'); // Close the modal
              }
          }
      }
  });
}
