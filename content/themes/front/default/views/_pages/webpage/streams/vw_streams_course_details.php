<section class="bradcumSec bg-white py-2">
	<div class="wrapper">
		<div class="row">
			<div class="col-md-10">
				<nav aria-label="breadcrumb" >
					<ol class="breadcrumb bg-white m-0 pl-0">
            <?php
            foreach ($course_data['breadcumb'] as $key => $value) {
              ?>
              <li class="breadcrumb-item <?php echo (empty($value))?'active':'';?>">
                <?php
                if(!empty($value)){
                  ?>
                  <a href="<?php echo $value;?>"><?php echo $key;?></a>
                  <?php
                }else{
                  echo $key;
                }
                ?>
              </li>
              <?php
            }
            ?>
          </ol>
				</nav>
			</div>
			<div class="col-md-12">
	          <div class="media">
	              <div class="media-body">
	                  <div class="row">
	                      <div class="col-sm-12">
	                          <h1 class="mt-0" style="font-size: 25px;"><?php echo $course_data['course_heading'];?></h1>
	                      </div>
	                  </div>
	              </div>
	          </div>
	      	</div>
		</div>
	</div>
</section>

<?php
if(!empty($course_data['course_menues'])){

  ?>
    <section class="tabSliderSec border-top">
      <div class="weapper">
        <div class="swiper-container tabSlider navTabSlider">
          <div class="swiper-wrapper">
           
            <?php
            foreach ($course_data['course_menues'] as $key => $value) {
              ?>
                <a href="<?php echo $value['menu_link'];?>" class="swiper-slide navLink <?php echo $value['menu_default_active'];?><?php echo $value['menu_active'];?>"> <?php echo $value['menu_name'];?> </a>
                <?php
            }
            ?>
          </div>
          <div class="swiper-button-next swiper-button-white"></div>
          <div class="swiper-button-prev swiper-button-white"></div>
        </div>
      </div>
    </section>
  <?php
}
?>

<section class="pageDetailsSec py-4">
	<div class="wrapper">
		<div class="row">
			<!-- <div class="col-lg-2 d-none d-lg-block">
	          <div class="card numberingListCard ">
	              <div class="list-group list-group-flush  ">
	                  <a href="" class="list-group-item list-group-item-action active"><span class="number">01</span> <span> JEE Main 2021 Exam Dates</span></a>
	                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
	                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
	                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
	                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
	                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
	                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
	                 
	              </div>
	          </div>
	      </div> -->
	      <div class="col-lg-9 mb-4 mb-lg-0">
	      	<div class="adBlock" style="margin-top: 5px; margin-bottom:5px;">      
	          <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
	            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
	                crossorigin="anonymous"></script>
	            <!-- wayto_hz_1_ads -->
	            <ins class="adsbygoogle"
	                style="display:inline-block;width:728px;height:90px"
	                data-ad-client="ca-pub-9545373166119354"
	                data-ad-slot="7117741101" style="clear: both; display: flex;justify-content: center;margin-left:50px;margin-right:50px;"></ins>
	            <script>
	                (adsbygoogle = window.adsbygoogle || []).push({});
	            </script>
	          </div>
	        </div>
	      </div>
	      <?php $this->widget->run('front_course_details_data',TRUE,$course_data['course_id'],$course_data['course_menu_id'],$course_data['course_menu_slug']);?>
		</div>
	</div>
</section>

<section class="pageDetailsSec py-4">
  <div class="wrapper">
    <div class="row">
        <div class="col-lg-12">
            <?php $this->widget->run('front_college_comment_section',TRUE);?>
        </div>        
    </div>
  </div>
 </section>

 <?php $this->widget->run('front_subscription_section',TRUE);?>


 <style>
 .section_wrapper.jsx-222626221 .download_sample.jsx-222626221 {
    position: relative;
    background: rgb(248, 248, 248);
    padding: 20px 15px;
    font-size: 1.2rem;
 }
 .section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .month.jsx-222626221 {
    color: rgb(255, 138, 0);
    font-weight: 900;
    display: block;
    line-height: 1.6;
    margin-bottom: -8px;
}
.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 h3.jsx-222626221 {
    font-weight: 600;
    margin-top: 0px;
    margin-bottom: 5px;
    color: rgb(54, 54, 54);
}
.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .text-md.jsx-222626221 {
    color: rgb(151, 151, 151);
}
.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .text-md.jsx-222626221 .mock_paper_download_button.jsx-222626221 {
    background: rgb(255, 138, 0);
    width: 50px;
    height: 50px;
    fill: rgb(255, 255, 255);
    border-radius: 50%;
    position: absolute;
    right: 30px;
    bottom: -20px;
}
.icon {
    display: inline-block;
    line-height: initial;
    height: 15px;
    width: 15px;
}
 </style>

<style>
  .dropdown-menu{
    z-index: 99999 !important
  }
    .dropdown-menu li a{
        background-image: none;
        color: #666;
        border-right: 0 none;
        text-align: left;
        display: block;
        line-height: 22px;
        padding: 8px 12px;
        text-transform: none;
        font-size: 13px;
        letter-spacing: normal;
        border-right: 0 solid;
        text-decoration:none;
    }
   .dropdown-menu li:hover {
        background-color: #eee;
    }

    @media all and (min-width: 992px) {
      .nav-item .dropdown-menu{ display: none; }
      .nav-item:hover .nav-link{   }
      .nav-item:hover .dropdown-menu{ display: block; }
      .nav-item .dropdown-menu{ margin-top:0; }
    }
</style>

<style>
  .btn-round{
    border-radius: 20px;
  }
  
 
</style>

<style type="text/css">
  .bodyslot-new {
      background: #F5F8F9;
      padding-bottom: 16px;
      margin-top: 0;
      margin-bottom: 10px;
  }

  .live-form-container-new .live-form-heading--icon {
      height: 30px;
      width: 30px;
      margin-right: 10px;
  }
  .live-form-container-new h4 {
      padding: 16px;
      text-transform: uppercase;
      color: #000;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 0;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      background: #f5f8f9;
  }

  .live-form-container-new .live-form-heading--icon svg {
      height: 30px;
      width: 30px;
  }

  .live-form-container-new h4 .sponsored {
      font-size: 13px;
      background: #ef233f1f;
      border-radius: 30px;
      color: #EF233F;
      padding: 5px 20px;
  }
    
    .live-form-container-new .live-form-body-row {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      box-shadow: 0 0 4px 0 #cfcfcf80;
      border-radius: 4px 4px 0px 0px;
      overflow-x: scroll;
  }

  .live-form-container-new {
      overflow: hidden;
      text-align: initial;
      background: #FFFFFF;
      box-shadow: 0 0 4px 0 #cfcfcf80;
      border-radius: 4px;
  }
    
    .ads_body_live_form_container{
      -webkit-text-decoration: none;
      text-decoration: none;
      margin: 0 auto 0px;
      max-width: 100%;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }

    .live-form-container-new {
      overflow: hidden;
      text-align: initial;
      background: #FFFFFF;
      box-shadow: 0 0 4px 0 #cfcfcf80;
      border-radius: 4px;
    }
    
    .ads_live_form_desktop_tnew{
      -webkit-text-decoration: none;
      text-decoration: none;
      margin: 0 auto 0px;
      max-width: 100%;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
    
    .ads_live_form_desktop_tnew {
      background: #fff;
      position: relative;
      min-height: 100px;
      height: 100%;
      display: block;
      font-size: 14px;
      line-height: 18px;
      color: #333;
      font-weight: 400;
      flex: 1;
      padding: 16px;
      padding-top: 12px;
      text-align: left;
      border-right: 1px solid #00000012;
  }

  .live-form-container-new .ads_body_live_form_container:nth-child(odd) a .ads_bottom_border {
      background: #ff7900;
  }
  .live-form-container-new .ads_body_live_form_container:nth-child(even) a .ads_bottom_border {
      background: #4FB8DD;
  }

  a.ads-live-form-review-banner .ads-bottom-border {
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 5px;
      background: #ff7900 !important;
  }
    a.ads_live_form_desktop_tnew:last-child {
      border-right: 1px  solid #00000012;
    }
    .top-section {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    .top-section.logo {
        border: 2px  solid #E7EBEF;
        height: 48px;
        width: 48px;
        min-width: 48px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
    }
    .top-section .college_name {
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
      color: #4FB8DD;
      height: 42px;
      overflow: hidden;
    }
    .ads_live_form_desktop_tnew .extra_info, .ads_live_form_desktop_tnew:hover .extra_info {
      color: #333;
    }
    .extra_info {
      height: 72px;
      overflow: hidden;
    }
    .info-section .admission_info {
      line-height: 17px;
      color: #1BCE90;
      margin-top: 4px;
      height: 32px;
      overflow: hidden;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
    }
    .apply-btn {
      text-align: center;
    }
    .ads_live_form_desktop_tnew .apply, .ads_live_form_desktop_tnew .apply:hover {
      background: #ff7900;
      display: inline-block;
      font-size: 14px;
      color: #fff;
      min-width: 220px;
      text-align: center;
      text-transform: uppercase;
      border-radius: 4px;
      padding: 6px;
      margin-top: 8px;
    }
    .ads_live_form_desktop_tnew .ads_bottom_border {
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 5px;
    }
    a.ads-live-form-review-banner {
      min-height: 210px;
      min-width: 255px;
      height: 100%;
      color: #333;
      padding: 16px 16px 20px 16px;
      background: #FFF8F1;
  }
</style>

<style type="text/css">
        .sticky-item {
            position: sticky;
            top: 0px;
        }
        .card.jsx-626553351 {
            box-shadow: rgb(207 207 207 / 50%) 0px 0px 4px 0px;
            border-radius: 5px;
        }
        .bg-white {
            background-color: #fff;
        }
        .default-header.jsx-626553351 {
            background-color: rgb(248, 248, 248);
            color: rgb(50, 60, 79);
            font-weight: 700;
            font-size: 15px;
            min-height: 55px;
            border-bottom: 1px solid rgba(204, 204, 204, 0.8);
            overflow: hidden;
        }
        .pl-4, .px-4 {
            padding-left: 1rem;
        }
        .align-items-center {
            -webkit-align-items: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
        }
        .d-flex {
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
        }
        .list-unstyled {
            padding-left: 0;
            list-style: none;
        }

        ul {
            display: block;
            list-style-type: disc;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            padding-inline-start: 40px;
        }
        .sidebar-single-elem {
            min-height: 35px;
        }
        .pl-3, .px-3 {
            padding-left: 0.75rem;
        }
        .pr-3, .px-3 {
            padding-right: 0.75rem;
        }
        .pb-2, .py-2 {
            padding-bottom: 0.5rem;
        }
        .pt-2, .py-2 {
            padding-top: 0.5rem;
        }
        .border-bottom {
            border-bottom: 1px solid #dedede;
        }
        *, *::before, *::after {
            box-sizing: border-box;
        }
        user agent stylesheet
        li {
            display: list-item;
            text-align: -webkit-match-parent;
        }
        .text-decoration-none {
            -webkit-text-decoration: none;
            text-decoration: none;
        }
      </style>

<script type="text/javascript">
  var wbpage='exampage';var _vtype='';var page='course_details_page';
</script>