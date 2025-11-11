<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

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

   
      <div class="row" style="margin-bottom:20px;">
        <div class="col-md-12 text-center">
          
          <img src="<?php echo base_url('public/data/ads/refer-earn-2.jpg');?>" style="max-width: 100%; height: auto; display: inline-block;">
        </div>
      </div>

      <?php $this->widget->run('front_image_ads_section',TRUE,['page_link'=>current_url(),'ads_position'=>'COLLEGE_SEARCH_PAGE_AT_TOP']);?>   
    </div>
  </section>



   <?php $this->widget->run('front_college_search_page_details_section',TRUE,['url_id'=>$page_id]);?>

   <!--  <section class="bradcumSec bg-white py-2">
      <div class="wrapper">
        <div class="row" style="margin-bottom:20px;">
          <div class="col-md-12">
            <img src="<?php echo base_url('uploads/app/default/Rampratap-Institute-Of-Higher-Education,-Gaya-(TD)20230701133856.webp');?>" style="width:100%;">
          </div>
        </div>
      </div>
    </section> -->

  <main class="pageDetailsSec isa-main-content" id="main_content">
    <div class="isa-tab-filter-wrapper">
        <div class="row no-gutters">
          <div class="col-md-8">
            <div class="filterBlock d-none d-md-flex flex-wrap align-items-center">                
              <?php
              if(!empty($top_states)){
                ?>
                <span class="blockTitle">SELECT STATE </span>
                <?php
                foreach ($top_states as $key => $value) {
                  ?>
                  <a href="<?php echo $value['access_url'];?>" class="<?php echo $value['selected'];?>"><?php echo $value['state_name'];?> <span>(<?php echo $value['total_colleges'];?>)</span></a>
                  <?php
                }
              }

              if(!empty($top_cities)){
                ?>
                <span class="blockTitle">SELECT CITY </span>
                <?php
                foreach ($top_cities as $key => $value) {
                  ?>
                  <a href="<?php echo $value['access_url'];?>" class="<?php echo $value['selected'];?>"><?php echo $value['city_name'];?></a>
                  <?php
                }
              }
              ?>
            </div>

          </div>
          <div class="col-md-4">
            <div class="isa-tab-filter">
              <ul class="">
                  <li class="placeholder"> <a href="#0">Sort By</a></li> 
                  <li class="filter"><a class="selected" data-type="popularity" href="#0" >Popularity</a></li>
                  <!-- <li class="filter"><a href="#0" data-type="reviews_rating">Reviews Rating </a></li>
                  <li class="filter"><a href="#0"data-type="fees">Fees</a></li> -->
              </ul>
          </div>
          </div>
        </div>
        
       <!--  <div class="border-top py-2">
            <div class="filterBlock d-flex flex-wrap align-items-center">
              <span class="blockTitle">SELECT COLLEGE CATEGORY </span>  
              <a href="#" class="btn btn-outline-primary"> IIT (23) </a> 
              <a href="#" class="btn btn-outline-primary">  NIT (31)</a>
              <a href="#" class="btn btn-outline-primary"> IIM (20) </a> 
              <a href="#" class="btn btn-outline-primary"> AIIMS (12) </a> 
              <a href="#" class="btn btn-outline-primary"> IIIT (28) </a> 
            </div>
        </div>
        <div class="border-top py-2">
            <div class="filterBlock d-flex flex-wrap align-items-center">
              <span class="blockTitle">SELECT COLLEGE CATEGORY </span>  
              <a href="#" class="btn btn-outline-primary"> IIT (23) </a> 
              <a href="#" class="btn btn-outline-primary">  NIT (31)</a>
              <a href="#" class="btn btn-outline-primary"> IIM (20) </a> 
              <a href="#" class="btn btn-outline-primary"> AIIMS (12) </a> 
              <a href="#" class="btn btn-outline-primary"> IIIT (28) </a> 
            </div>
        </div> -->
        
    </div> 
      
    <div id="filter_list">
      <?php $this->widget->run('front_search_colleges_filter',TRUE);?>
    </div>

    <section class="isa-filter-result">
        <!-- <div class="row" style="margin-bottom:20px;">
          <div class="col-md-12">
            <img src="<?php echo base_url('uploads/app/default/SR_Uni_TD](2)(3)20230704162555.webp');?>" style="width:100%;">
          </div>
        </div> -->     
      <div class="form-row" id="udata_lists"></div>

      <div class="form-row text-center" id="data_loader"></div>
    </section>

    </div>


  </main>


  <div style="margin-top: 1px;">




</div>

<style type="text/css">
  .isa-filter-block ul li{
    position: relative !important;
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
    var _cid='';
    var _cit='';
    var _cot='';
    var _vip='';
    var wbpage='';
    var page='';
    var dpr_url='<?php echo ($this->input->get('dpr') && $this->input->get('dpr')==='reviews')?'filterdata?dpr='.$this->input->get('dpr'):'filterdata';?>';
    var loader_gif='<?php echo base_url('public/data/app/app_data/waytoloader.gif');?>';
  </script>

 


  <style type="text/css">
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

</style>