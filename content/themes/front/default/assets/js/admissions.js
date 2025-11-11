jQuery(function($) {
  "use strict";
$(".autocomplete-result-list").css('z-index', 498);

  const wikiUrl = 'https://en.wikipedia.org'
const params = 'action=query&list=search&format=json&origin=*'

new Autocomplete('#autocomplete', {
  
  // Search function can return a promise
  // which resolves with an array of
  // results. In this case we're using
  // the Wikipedia search API.
  search: input => {
    const url = `${wikiUrl}/w/api.php?${
      params
    }&srsearch=${encodeURI(input)}`

    return new Promise(resolve => {
      if (input.length < 3) {
        return resolve([])
      }

      fetch(url)
        .then(response => response.json())
        .then(data => {
          resolve(data.query.search)
        })
    })
  },
  
  // Wikipedia returns a format like this:
  //
  // {
  //   pageid: 12345,
  //   title: 'Article title',
  //   ...
  // }
  // 
  // We want to display the title
  getResultValue: result => result.title,

  // Open the selected article in
  // a new window
  onSubmit: result => {
    window.open(`${wikiUrl}/wiki/${
      encodeURI(result.title)
    }`)
  }
})


new Autocomplete('#autocomplete2', {
  
  // Search function can return a promise
  // which resolves with an array of
  // results. In this case we're using
  // the Wikipedia search API.
  search: input => {
    const url = `${wikiUrl}/w/api.php?${
      params
    }&srsearch=${encodeURI(input)}`

    return new Promise(resolve => {
      if (input.length < 3) {
        return resolve([])
      }

      fetch(url)
        .then(response => response.json())
        .then(data => {
          resolve(data.query.search)
        })
    })
  },
  
  // Wikipedia returns a format like this:
  //
  // {
  //   pageid: 12345,
  //   title: 'Article title',
  //   ...
  // }
  // 
  // We want to display the title
  getResultValue: result => result.title,

  // Open the selected article in
  // a new window
  onSubmit: result => {
    window.open(`${wikiUrl}/wiki/${
      encodeURI(result.title)
    }`)
  }
})


  // $('body').on('keyup keydown paste','#college_search',function(){
  //   var searchInput=$(this).val();
  //   var html='';
  //     if(searchInput!=''){
  //     $.ajax({
  //         type:'GET',
  //         url:base_url+'web-api/glob_search.php?_searched_param='+searchInput,
  //         data:{},
  //         cache:false,
  //         success:function(d){

  //           html='<div class="jsx-2743981883 desktop-search-list bg-offwhite">';
  //           if(d.searched_data && d.searched_data!=''){
  //             $.each(d.searched_data,function(k,v){
  //             var exp=new RegExp(searchInput,'i');
  //             if(v.serach_data_name.search(exp)!=-1){
                
  //               html+='<span class="jsx-2743981883 menu-items pb-2  d-flex align-items-center text-heading undefined">';
  //                   html+='<div class="jsx-2743981883 d-inline-block  align-self-start pt-1">';
  //                   html+='<img data-src="'+v.searched_data_logo+'" src="'+v.searched_data_logo+'" alt="logo" class="jsx-2355921263 logo-img lazyloaded" loading="lazy">';
  //                   html+='</div>';
  //                   html+='<div class="jsx-2743981883 col text-new font-weight-bold text-capitalize"><a href="'+v.searched_access_url+'" class="jsx-2743981883 mb-0 h2 list-name">'+v.serach_data_name+'</a><div class="jsx-2743981883 d-flex flex-nowrap tabs-container" wfd-id="2542"></div>';
  //                   html+='</div>';
  //                   html+='<p class="jsx-2743981883 m-0 text-17 text-subheading text-tiny font-weight-bold text-capitalize ">'+v.search_data_type+'</p>';
  //                 html+='</span>';
                
  //             }
  //           });
  //           }
            
  //         html+='</div>';
  //         $('div.trendingSearch').html(html);
  //         }
  //       });
  //     }else{
  //       $('div.trendingSearch').html('');
  //     } 
  // });

});