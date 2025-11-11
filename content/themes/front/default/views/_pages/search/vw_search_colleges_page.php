<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
  crossorigin="anonymous"></script>

<?php
if(!empty($facilities)){
   foreach ($facilities as $_k => $_v) {
    ?>
    <link rel="preload" href="<?php echo $_v['facility_icon_3'];?>" as="image">
    <?php
    }
}
?>


  <section class="bradcumSec bg-white py-2">
    <div class="wrapper">
      <div class="row">
        <div class="col-md-12 ">
          <nav aria-label="breadcrumb">
              <ol class="breadcrumb bg-white m-0 pl-0" id="breadcrumb_li">
              <?php
              if(!empty($breadcumb)){
                foreach ($breadcumb as $key => $value) {
                  ?>
                  <li class="breadcrumb-item <?php echo ($value=='')?'active':'';?>" <?php echo ($value=='')?'aria-current="page"':'';?>>
                    <?php echo ($value!='')?'<a href="'.$value.'">'.$key.'</a>':$key;?>
                    </li>
                  <?php
                }
              }
              ?>
              </ol>
          </nav>
        </div>
        <div class="col-md-12 mb-2">
            <h1 class="m-0 text-center text-md-left" id="breadcrumb_title" style="font-size: 26.7px;font-weight: 900;"><?php echo $page_inner_title;?> </h1>
        </div>    
      </div>



      <?php $this->widget->run('front_image_ads_section',TRUE,['page_link'=>current_url(),'ads_position'=>'COLLEGE_SEARCH_PAGE_AT_TOP']);?>   
    </div>
  </section>



   <?php $this->widget->run('front_college_search_page_details_section',TRUE,['url_id'=>$page_id]);?>

   <!-- <div class="adBlock" style="padding-top: 10px;margin-bottom: -42px;">
      <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
        <div class="adBlock">
          <div class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
              <div class="mb-4" style="text-align:center;">
              
              </div>
          </div>
        </div>
      </div>
    </div> -->

  <main class="pageDetailsSec isa-main-content" id="main_content">
    <div class="isa-tab-filter-wrapper">
        <div class="row no-gutters">
          <div class="col-md-8">
            <div class="filterBlock d-none d-md-flex flex-wrap align-items-center">                
              
            </div>

          </div>
         
        </div>
        
        <div id="_filter_list_2">
          
        </div>
        
    </div> 
      
    <div id="filter_list">
      <?php $this->widget->run('front_search_colleges_filter',TRUE);?>      
    </div>

    <section class="isa-filter-result">        
      <div class="form-row" id="udata_lists"></div>
      <div class="form-row text-center" id="data_loader"></div>
    </section>

    </div>


  </main>


  <div style="margin-top: 1px;">
  </div>





<div class="modal offcanvas-menu shadow d-block pr-0" id="compareModal" tabindex="-1" aria-labelledby="compareModalLabel" aria-hidden="true" data-backdrop="">
  <div class="modal-dialog m-0 h-100">
    <div class="modal-content border-0 rounded-0">
      <div class="modal-header justify-content-center border-0 p-4">
        <h5 class="modal-title text-uppercase" id="compareModalLabel" style="color:#000;">Compare Institutions</h5>
        <button type="button" class="close position-absolute" style="right: 15px; top: 15px;" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body text-uppercase px-0 py-4 flex-1">
       <div class="row">
        <div class="col-12" id="div_compared_colleges">

        </div>
       </div>
      </div>
      <div class="modal-footer justify-content-center border-0 p-4">
       
      </div>
    </div>
  </div>
</div>

<style type="text/css">
  .modal.offcanvas-menu {
    width: 320px;
    max-width: 80%;
    transition: transform 0.2s ease-in-out;
    transform: translateX(-100%);
  }
  .modal.offcanvas-menu .modal-content {
    height: inherit;
    color: #0000;
  }
  .modal.offcanvas-menu .modal-content .nav .nav-link {
    color: #000;
  }
  .modal.offcanvas-menu.show {
    transform: translateX(0);
  }

  .modal.modal-title{
    color:#000;
  }

  .modal-body {
    max-height: 100vh;
    overflow-y: auto;
  }

  #div_compared_colleges {
    max-height: 90vh; /* Limits height to 60% of the viewport */
    padding: 10px; /* Adds some spacing */
  }

</style>
  
         
  <script type="text/javascript">
    let curl='<?php echo current_url();?>';
    let country='<?php echo $country_id;?>';
    let _c='<?php echo $country_id;?>';
    let _co='<?php echo $country_id;?>';
    let _st='<?php echo $state_id;?>';
    let _ct='<?php echo $city_id;?>';
    let _strm='<?php echo $stream_id;?>';
    let _cu='<?php echo $course_id;?>';
    let _exam='<?php echo $exam_id;?>';
    let _rank='<?php echo $rank_id;?>';
    let _ctype='<?php echo $ctype_id;?>';
    let _appr='<?php echo $appr_id;?>';
    let _aff='<?php echo $aff_id;?>';
    let _c_cate='<?php echo $c_cate_id;?>';
    let _agn='<?php echo $agn_id;?>';
    let _search_type='7';
    var _vtype='';
    var _utype='';
    var _cid='';
    var _cit='';
    var _cot='';
    var _vip='';
    var _base_url='<?php echo $_base_url;?>';
    var _pgid='<?php echo $page_id;?>';
    var _cntry='<?php echo $_country_id;?>';
    var _stat='<?php echo $_state_id;?>';
    var _cit='<?php echo $_city_id;?>';
    var __strm='<?php echo $_stream_id;?>';
    let _sid='<?php echo session_userdata('user_id');?>';
    var wbpage='college_search_page';
    var page='';
    var dpr_url='<?php echo ($this->input->get('dpr') && $this->input->get('dpr')==='reviews')?'filterdata?dpr='.$this->input->get('dpr'):'filterdata';?>';
    var loader_gif='<?php echo base_url('public/data/app/app_data/waytoloader.gif');?>';

    $(document).ready(function(){
      var swiper = new Swiper(".mySwiper", {
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },       
      });

      var rswiper = new Swiper(".rankSwiper", {
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        }       
      });
    });
  </script>

 


  <style type="text/css">

.isa-filter-block ul li{
    position: relative !important;
  }
   /* #main_content {
      min-height: calc(350vh - 0px) !important;
  }*/
  .chosen-container{
    z-index: 1800000;
  }
 .chosen-container-single{
    width: 100% !important;
    border-radius: 0px !important;
  }
  .chosen-drop{
    max-height: 150px;
  }

 .chosen-container .chosen-results {
    max-height: 100px;
  }

 #applicant_state_chosen .chosen-results{
    height: 90px;
  }

 #applicant_city_chosen .chosen-results{
    height: 90px;
  }

#applicant_course_chosen .chosen-results{
    height: 50px;
  }

  .active-result .group-option .highlighted{
    background-color: #1b1f4c !important;
  }

  .boxIcon {
    height: 52px;
    width: 52px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: .8rem;
    
}
.boxContent{
    font-weight: bold;
    font-size: 9px;
}

h6 .mt-0 .mb-0{
  color: #ff9800;
}


.background-skeleton-loader {
      width: 100%;
      height: 158px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      lightgray;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite; 
    }


    .logo-skeleton-loader {
      display: block;
      background: linear-gradient( to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ), #8a8686 !important;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 1s infinite;
    }

    .background-skeleton-loader:empty {      
      width: 100%;
      height: 158px;
      display: block;
      background: linear-gradient( to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ), #d3d3d370;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      animation: shine 1s infinite;
    }


    .logo-skeleton-loader:empty {      
      display: block;
      background: linear-gradient( to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ), #8a8686 !important;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0; 
      animation: shine 1s infinite;
    }

    .infotitle-skeleton-loader {
      width: 250px;
      height: 20px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite; 
    }

    .proReview-skeleton-loader{
      width: 21px;
      height: 21px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }

    .proRating-skeleton-loader{
      width: 80px;
      height: 50px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }


    .infoaddress-skeleton-loader {
      width: 150px;
      height: 20px;
      display: block;
      margin-top: 15px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite; 
    }

     .btngroup-skeleton-loader{
      display: block;
      background: linear-gradient( to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ), #d3d3d370;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      animation: shine 1s infinite;
    }

    .infoitem-skeleton-loader {
      width: 12.50%;
        height: 50px;
        display: block;
        margin-bottom: 5px !important;
        background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
        ),
        #d3d3d37d;
        background-repeat: repeat-y;
        background-size: 50px 500px;
        background-position: 0 0;
        /*animation: shine 1s infinite; */ 
        animation: shine 2s infinite;
    }


.skeleton-loader {
      width: 100%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      lightgray;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite; 
    }


    .skeleton-loader-infoImg {
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      lightgray;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite; 
    }

    .skeleton-loader-h5 {
      width: 100px;
      height: 25px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite; 
    }


    .skeleton-loader-h6-1{
      width: 12.50%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }
    .skeleton-loader-h6-2{
      width: 25%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }
    .skeleton-loader-h6-3{
      width: 37.50%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }
    .skeleton-loader-h6-4{
      width: 50%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }
    .skeleton-loader-h6-5{
      width: 62.50%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }
    .skeleton-loader-h6-6{
      width: 75%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }

    .skeleton-loader-h6-7{
      width: 87.50%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }
    .skeleton-loader-h6-8{
      width: 100%;
      height: 15px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite;
    }

    .skeleton-loader-updateDate{
      width: 100px;
      height: 25px;
      display: block;
      margin-bottom: 5px !important;
      background: linear-gradient(    
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
      ),
      #d3d3d37d;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      /*animation: shine 1s infinite; */ 
      animation: shine 2s infinite; 
    }


    @keyframes shine {  
      to {
        background-position: 100% 0, /* move highlight to right */ 0 0;
      }
    }

    .skeleton-loader:empty {      
      width: 100%;
      height: 15px;
      display: block;
      background: linear-gradient( to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ), #d3d3d370;
      background-repeat: repeat-y;
      background-size: 50px 500px;
      background-position: 0 0;
      animation: shine 1s infinite;
    }


    .btn-orange{
      background-color: #fd572e;
      border-color: #fd572e;
      color: :#fff;
    }

    .btn-cust:hover{
       background-color: #fd572e;
      border-color: #fd572e;
      color: :#fff;
    }

    .grid_list{
      margin-bottom: 10px !important;
    }
    

</style>