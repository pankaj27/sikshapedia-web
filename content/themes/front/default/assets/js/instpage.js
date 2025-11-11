jQuery(function($) {
  "use strict";

  load(widget);


  $('body').on('click','.inst_inner_menu',function(){

    var data_link=$(this).data('link');
    var data_title=$(this).data('title');
    var data_desc=$(this).data('desc');
    var data_keywords=$(this).data('keywords');
    var data_widget=$(this).data('widgets');
    var data_menu_alias=$(this).data('menu_alias');
    var data_breadcrumb=$(this).data('meta_breadcrumb');

    var data_page_heading=$(this).data('page_heading');

    var data_mid=$(this).data('mid');

    

    

    var mm=$.parseJSON(m[data_mid]);
    var breadcrumb='';

    $.each(mm,function(i,v){
      if(v!=''){
        breadcrumb+='<li class="breadcrumb-item active"><a href="'+v+'"><strong>'+i+'</strong></a></li>';
      }else{
        breadcrumb+='<li class="breadcrumb-item">'+i+'</li>';
      }
    });




    

    //$('html').load(data_link)

    document.title = data_title;
    //document.getElementById('meta_description').val= data_desc;

    document.querySelector('link[rel="canonical"]').setAttribute("href", data_link);

    document.querySelector('meta[name="description"]').setAttribute("content", data_desc);

    document.querySelector('meta[name="title"]').setAttribute("content", data_title);

    document.querySelector('meta[name="keywords"]').setAttribute("content", data_keywords);

    document.querySelector('meta[property="og:description"]').setAttribute("content", data_desc);

    document.querySelector('meta[property="og:title"]').setAttribute("content", data_title);

    document.querySelector('meta[property="og:description"]').setAttribute("content", data_desc);

    document.querySelector('meta[name="twitter:title"]').setAttribute("content", data_title);
    document.querySelector('meta[name="twitter:description"]').setAttribute("content", data_desc);

    $('#ol_breadcrumb').html(breadcrumb);

    $('#page_heading').html(data_page_heading);

    //$('#meta_title').html(data_title);

    window.history.pushState(null, data_title, data_link);

    $('.inst_inner_menu').removeClass('active');

    $('#menu-'+data_menu_alias).addClass('active');

    //processAjaxData(data_link);

    setTimeout(function(){
      load(data_widget);
    },1000);

      
  });

  function processAjaxData(urlPath){
     document.title = 'Sample';
     window.history.pushState(null,"", urlPath);
  }

  function load(widget){
    $.ajax({
      type:'POST',
      url:base_url+'load_widgets',
      data:{csrf_test_name:csrf_hash,country:_co,inst:_cid,widget:widget},
      beforeSend:function(){
        $('#page_main_content').html('<div class="card infoCard mb-4 skeleton-loader" style="height: 90px;"></div><br><div class="card infoCard mb-4 skeleton-loader" style="height: 200px;"></div><br><div class="card infoCard mb-4 skeleton-loader" style="height: 200px;"></div><br><div class="card infoCard mb-4 skeleton-loader" style="height: 200px;"></div><br><div class="card infoCard mb-4 skeleton-loader" style="height: 200px;"></div><br><div class="card infoCard mb-4 skeleton-loader" style="height: 200px;"></div><br><div class="card infoCard mb-4 skeleton-loader" style="height: 200px;"></div><br><div class="card infoCard mb-4 skeleton-loader" style="height: 200px;"></div><br><div class="card infoCard mb-4 skeleton-loader" style="height: 200px;"></div>');
      },
      success:function(d){
        $('#page_main_content').html(d.html)
      }
    });
  }

  var html2='';

  $.ajax({
    type:'GET',
    url:wb_api+'instapi/nearbycolleges/'+_cot+'/'+_st+'/'+_cit,
    data:{},
    beforeSend:function(){

    },
    success:function(d){
      if(d!=null){
        $.each(d,function(k,v){
          html2+='<li class="list-group-item">';
            html2+='<a href="'+v['access_url']+'" class="media">';
              html2+='<img src="'+v['college_logo']+'" width="40" class="mr-2" alt="..."> ';
              html2+='<div class="media-body">';
                html2+='<h6 class="mb-0 color2">'+v['college_name']+'</h6>';
                html2+='<small>'+v['college_state']+','+v['college_city']+'</small> ';
              html2+='</div>';
            html2+='</a>';
          html2+='</li>';
        });              
      }

      if(html2!=''){
        $('#colleges_in_group').html(html2);
      }else{
        $('#div_colleges_in_group').hide();
      }

      
    }
  });


  var html3='';

  $.ajax({
    type:'GET',
    url:wb_api+'newsapi/news/'+_cot,
    data:{},
    beforeSend:function(){

    },
    success:function(d){
      if(d!=null){
        console.log(d)
            $.each(d,function(k,v){
              html3+='<li class="list-group-item">';
                    html3+='<a href="'+v['news_link']+'" target="_blank" class="media">';
                      html3+='<img src="'+v['news_banner']+'" width="40" class="mr-2" alt="..."> ';
                      html3+='<div class="media-body">';
                        html3+='<h6 class="mb-0 color2">'+v['news_heading']+'</h6>';
                        html3+='<small>'+v['news_published_date']+'</small> ';
                      html3+='</div>';
                    html3+='</a>';
                  html3+='</li>';

                
            });
              
      }

      $('#news_list').html(html3);
    }
  });

  var html4='';

  $.ajax({
    type:'GET',
    url:wb_api+'instapi/courseslist/'+_cid+'/10',
    data:{},
    beforeSend:function(){

    },
    success:function(d){
      if(d!=null){
            $.each(d,function(k,v){
              html4+='<li class="list-group-item">';
                    html4+='<a href="#" class="media">';
                      html4+='<div class="media-body">';
                        html4+='<h6 class="mb-0 color2">'+v['course_name']+'</h6>';
                        html4+='<small>'+v['course_duration']+'</small> ';
                      html4+='</div>';
                    html4+='</a>';
                  html4+='</li>';

                
            });
              
      }

      $('#college_courses_list').html(html4);
    }
  });



});