<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="examSearchWrapper">
    <section class="examBnrSec overlayBnr">
      <img src="<?php echo base_url('public/data/app/app_data/sikshapedia-exams-lists.webp');?>" alt="Upcomming exams list-sikshapedia" class="examBnrImg">
      <div class="eaxmBannerContent">
          <div class="wrapper">
              
            <div class="searchPanelBox">
                <h2 class="boxTitle text-white text-center mb-3"><strong>Entrance Exams</strong> In <?php echo $default_country_data->country_name;?></h2>
                <button id="examSearchClose">
                    <svg version="1.1" class="closeSvg"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 409.806 409.806"  xml:space="preserve">
                      <path d="M228.929,205.01L404.596,29.343c6.78-6.548,6.968-17.352,0.42-24.132c-6.548-6.78-17.352-6.968-24.132-0.42
                        c-0.142,0.137-0.282,0.277-0.42,0.42L204.796,180.878L29.129,5.21c-6.78-6.548-17.584-6.36-24.132,0.42
                        c-6.388,6.614-6.388,17.099,0,23.713L180.664,205.01L4.997,380.677c-6.663,6.664-6.663,17.468,0,24.132
                        c6.664,6.662,17.468,6.662,24.132,0l175.667-175.667l175.667,175.667c6.78,6.548,17.584,6.36,24.132-0.42
                        c6.387-6.614,6.387-17.099,0-23.712L228.929,205.01z"/>
                    </svg>
                </button>
                  
                <div class="searchPanel" id="examSearchs">              
                    <div class="searchBox">
                        <input type="text" class="keyword" placeholder="Search Entrance Exams" autocomplete="off" id="search_exams_input">
                    </div>
                    <ul class="suggestList nicescroll" id="ul_exams_list">
        	
                    </ul>
                </div>
                  
            </div>
                 
            <?php $this->widget->run('front_exam_upcomming_section',TRUE);?>

                <div class="searchCategorySec">

                    <div class="jsx-4201486923 jsx-2011069378 jsx-3155908256 position-relative pr-5  search-div ">
                        <ul class="jsx-4201486923 jsx-2011069378 jsx-3155908256 search-ul px-5 mb-5" id="ul_exam_list"></ul>

                        <?php $this->widget->run('front_exam_stream_list_section',TRUE,['country_id'=>'99']);?>
                    </div>
                </div>


                


          </div>
      </div>
    </section>
    <section class="adBlock"> 
        <div class="row" style="margin-top:10px;">
          <div class="col-md-12 text-center">                      
            <img src="<?php echo base_url('public/data/ads/register-with-sikshapedia.jpg');?>" style="max-width: 100%; height: auto; display: inline-block;">
          </div>
        </div>
    </section>
    <section class="pageDetailsSec py-4">
        <div class="wrapper">
            <div class="row">
                <div class="col-md-9">
                <?php $this->widget->run('front_exams_list_section',TRUE);?>
                </div>
                <div class="col-md-3">
                    <?php $this->widget->run('front_exams_upcomming_side_section',TRUE,'0');?>
                </div>
            </div>
        </div>
    </section>
</div><!-- //examSearchWrapper -->

 <?php $this->widget->run('front_subscription_section',TRUE);?>
<style type="text/css">

    .exam-logo.jsx-2566320323 {
        height: 80px;
        width: 80px;
        max-width: 80px;
        background: rgb(58 58 60);
        vertical-align: middle;
        overflow: hidden;
    }

    .title-container.jsx-2566320323 {
        overflow-wrap: break-word;
        padding-right: 120px;
    }
    a.jsx-2566320323 {
        text-decoration: none;
    }
    .text-sidebar-heading {
        color: #4d586c;
    }
    .exam-stream.jsx-2566320323, .exam-course-link.jsx-2566320323 {
        font-size: 15px;
        color: rgb(59, 97, 173) !important;
    }
    a.jsx-2566320323 {
        text-decoration: none;
    }
    .title-container.jsx-2566320323 {
        overflow-wrap: break-word;
        padding-right: 120px;
    }

    .examSearchActive .examBnrSec .eaxmBannerContent .searchPanelBox {
        max-width: 100%;
        width: 100%;
        padding: 0 0 0px;
    }
    .exm-container{
        padding-top: 16px;
    }
</style>


<style type="text/css">



</style>

<style>
 .section_wrapper.jsx-222626221 .download_sample.jsx-222626221{position:relative;background:#f8f8f8;padding:20px 15px;font-size:1.2rem}.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .month.jsx-222626221{color:#ff8a00;font-weight:900;display:block;line-height:1.6;margin-bottom:-8px}.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 h3.jsx-222626221{font-weight:600;margin-top:0;margin-bottom:5px;color:#363636}.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .text-md.jsx-222626221{color:#979797}.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .text-md.jsx-222626221 .mock_paper_download_button.jsx-222626221{background:#ff8a00;width:50px;height:50px;fill:rgb(255,255,255);border-radius:50%;position:absolute;right:30px;bottom:-20px}.icon{display:inline-block;line-height:initial;height:15px;width:15px}
</style>

<style>
  .ads_live_form_desktop_tnew,a.ads_live_form_desktop_tnew:last-child{border-right:1px solid #00000012}.dropdown-menu{z-index:99999!important}.dropdown-menu li a{background-image:none;color:#666;border-right:0 solid;text-align:left;display:block;line-height:22px;padding:8px 12px;text-transform:none;font-size:13px;letter-spacing:normal;text-decoration:none}.dropdown-menu li:hover{background-color:#eee}@media all and (min-width:992px){.nav-item .dropdown-menu{display:none;margin-top:0}.nav-item:hover .dropdown-menu{display:block}}.btn-round{border-radius:20px}.bodyslot-new{background:#f5f8f9;padding-bottom:16px;margin-top:0;margin-bottom:10px}.ads_body_live_form_container,.ads_live_form_desktop_tnew{margin:0 auto;max-width:100%;-webkit-text-decoration:none;text-decoration:none}.live-form-container-new .live-form-heading--icon{height:30px;width:30px;margin-right:10px}.live-form-container-new h4{padding:16px;text-transform:uppercase;color:#000;font-size:20px;font-weight:600;margin-bottom:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;background:#f5f8f9}.live-form-container-new .live-form-heading--icon svg{height:30px;width:30px}.live-form-container-new h4 .sponsored{font-size:13px;background:#ef233f1f;border-radius:30px;color:#ef233f;padding:5px 20px}.live-form-container-new .live-form-body-row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;box-shadow:0 0 4px 0 #cfcfcf80;border-radius:4px 4px 0 0;overflow-x:scroll}.ads_body_live_form_container{-webkit-flex:1;-ms-flex:1;flex:1}.live-form-container-new{overflow:hidden;text-align:initial;background:#fff;box-shadow:0 0 4px 0 #cfcfcf80;border-radius:4px}.ads_live_form_desktop_tnew{-webkit-flex:1;-ms-flex:1;flex:1;background:#fff;position:relative;min-height:100px;height:100%;display:block;font-size:14px;line-height:18px;color:#333;font-weight:400;flex:1;padding:12px 16px 16px;text-align:left}.live-form-container-new .ads_body_live_form_container:nth-child(odd) a .ads_bottom_border{background:#ff7900}.live-form-container-new .ads_body_live_form_container:nth-child(2n) a .ads_bottom_border{background:#4fb8dd}a.ads-live-form-review-banner .ads-bottom-border{position:absolute;bottom:0;left:0;width:100%;height:5px;background:#ff7900!important}.top-section{display:flex;align-items:center;margin-bottom:4px}.top-section.logo{border:2px solid #e7ebef;height:48px;width:48px;min-width:48px;border-radius:50%;overflow:hidden;margin-right:12px}.top-section .college_name{font-weight:700;font-size:16px;line-height:20px;color:#4fb8dd;height:42px;overflow:hidden}.ads_live_form_desktop_tnew .extra_info,.ads_live_form_desktop_tnew:hover .extra_info{color:#333}.extra_info{height:72px;overflow:hidden}.info-section .admission_info{line-height:17px;color:#1bce90;margin-top:4px;height:32px;overflow:hidden;display:flex;justify-content:flex-start;align-items:flex-end}.apply-btn{text-align:center}.ads_live_form_desktop_tnew .apply,.ads_live_form_desktop_tnew .apply:hover{background:#ff7900;display:inline-block;font-size:14px;color:#fff;min-width:220px;text-align:center;text-transform:uppercase;border-radius:4px;padding:6px;margin-top:8px}.ads_live_form_desktop_tnew .ads_bottom_border{position:absolute;bottom:0;left:0;width:100%;height:5px}a.ads-live-form-review-banner{min-height:210px;min-width:255px;height:100%;color:#333;padding:16px 16px 20px;background:#fff8f1}.sticky-item{position:sticky;top:0}.card.jsx-626553351{box-shadow:rgb(207 207 207 / 50%) 0 0 4px 0;border-radius:5px}.bg-white{background-color:#fff}.default-header.jsx-626553351{background-color:#f8f8f8;color:#323c4f;font-weight:700;font-size:15px;min-height:55px;border-bottom:1px solid rgba(204,204,204,.8);overflow:hidden}.pl-4,.px-4{padding-left:1rem}.align-items-center{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.d-flex{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.list-unstyled{padding-left:0;list-style:none}ul{display:block;list-style-type:disc;margin-block-start:1em;margin-block-end:1em;margin-inline-start:0;margin-inline-end:0;padding-inline-start:40px}.sidebar-single-elem{min-height:35px}.pl-3,.px-3{padding-left:.75rem}.pr-3,.px-3{padding-right:.75rem}.pb-2,.py-2{padding-bottom:.5rem}.pt-2,.py-2{padding-top:.5rem}.border-bottom{border-bottom:1px solid #dedede}*,::after,::before{box-sizing:border-box}user agent stylesheet li{display:list-item;text-align:-webkit-match-parent}.text-decoration-none{-webkit-text-decoration:none;text-decoration:none}.icon-sidebar-btn-lead{width:20%;height:49px;float:right;padding:.5rem;margin-top:-.5rem;margin-right:-.75rem;margin-bottom:-.5rem}
</style>


<script type="text/javascript">
    var wbpage='exam_page';
    var page='exam_page';
    var _vtype='';
</script>

<script type="text/javascript">
    function _searchExams(){
        var searchInput=$('input#search_exams').val();
        var html2='';
        if(searchInput!=''){
            $.ajax({
              type:'GET',
              url:wb_api+'exapi/exams/_searched_param/'+searchInput,
              dataType:'json',
              data:{},
              cache:false,
              beforeSend:function(){
                  
              },
              success:function(d){
                if(d.searched_data){                    
                    $.each(d.searched_data,function(k,v){
                        html2+='<li class="mt-5 pb-2 border-bottom d-flex align-items-start">';
                               html2+='<a href="'+v.exam_link+'">';
                                html2+='<div class="media">';
                                    html2+='<a href="'+v.exam_link+'"><img src="'+v.exam_image+'" class="mr-3 shadow-sm w-60p" alt="'+v.exam_name+'"></a>';
                                html2+='</div>';
                               html2+='</a>';
                               html2+='<div class="d-inline-block position-relative ml-10 title-container pr-3 exm-container">';
                                 html2+='<h3 class="text-uppercase mt-0 exam-title">';
                                   html2+='<a class="text-sidebar-heading" href="'+v.exam_link+'">';
                                     html2+='<span>'+v.exam_name+'</span>';
                                   html2+='</a>';
                                 html2+='</h3>';
                               html2+='</div>';
                             html2+='</li>';
                    });

                    $('ul#ul_exam_list').html(html2);
                    
                }else{
                    $('ul#ul_exam_list').html('');
                }               
              }
            });
            

        }else{
            $('ul#ul_exam_list').html('');
        }       
    }


 $('ul.tabs li').click(function () {
        var tab_id = $(this).attr('href');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    })

</script>