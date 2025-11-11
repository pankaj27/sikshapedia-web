
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
          crossorigin="anonymous"></script>
<section class="bradcumSec bg-white py-2">
   <div class="wrapper">
        <div class="row">
            <div class="col-md-10">
                <nav aria-label="breadcrumb" >
                    <ol class="breadcrumb bg-white m-0 pl-0">
                      <?php
                      foreach ($exams_data['breadcumb'] as $key => $value) {
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
                    <img src="<?php echo $exams_data['exam_logo'];?>" class="mr-3 h-60p exam_logo" alt="<?php echo $exams_data['exam_name'];?>">
                    <div class="media-body">
                        <div class="row">

                            <div class="col-sm-9">
                                <h1 class="mt-3 exam_title"><?php echo $exams_data['exam_heading'];?></h1>
                            </div>
                            <!-- <div class="col-sm-3">
                                <div class="border p-2 d-inline float-sm-right ">
                                    <i class="far fa-clock"></i> 
                                    <span>Results: 07 Mar `21 </span>| <a href="#" class="color2"> See all dates</a>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php
if(!empty($exam_menu)){
  ?>
    <section class="tabSliderSec border-top">
      <div class="weapper">
        <div class="swiper-container tabSlider navTabSlider">
          <div class="swiper-wrapper exam_menu_swiper">
           
            <?php
            foreach ($exam_menu as $key => $value) {
              ?>
              <a href="<?php echo $value['menu_link'];?>" class="swiper-slide navLink <?php echo ($value['menu_active']=='yes')?'active':'';?>"> <?php echo $value['menu_name'];?> </a>
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
      <div class="col-lg-9 mb-4 mb-lg-0">
        <?php $this->widget->run('front_exam_details_data',TRUE,$exams_data['exam_id'],$menu_data_id,$menu_slug);?>
        <?php $this->widget->run('front_exam_page_button_section',FALSE,$exams_data['exam_id']);?>

        <?php

        if(!empty($menu_widget_data)){
          $this->widget->run($menu_widget_data->widget_name,TRUE,$exams_data['exam_id']);
        }

        ?>
      </div>
      <div class="col-lg-3 ">
        <?php $this->widget->run('front_exams_colleges_side_section',TRUE,$exams_data['exam_id']);?>
        <?php $this->widget->run('front_exams_upcomming_side_section',TRUE,$exams_data['exam_id']);?>
        <?php $this->widget->run('front_exams_courses_side_section',TRUE,$exams_data['exam_id']);?>
        
        
        <?php $this->widget->run('front_exam_side_menu_section',TRUE,$exams_data['exam_id']);?>
      </div>
    </div>
  </div>
</section>

<section class="pageDetailsSec py-4">
  <div class="wrapper">
    <div class="row">
        <div class="col-lg-12">
            <?php $this->widget->run('front_exam_fees_mock_section',TRUE);?>
        </div>
        
    </div>
  </div>
</section>

<?php $this->widget->run('front_subscription_section',TRUE);?>



<style>
 .section_wrapper.jsx-222626221 .download_sample.jsx-222626221{position:relative;background:#f8f8f8;padding:20px 15px;font-size:1.2rem}.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .month.jsx-222626221{color:#ff8a00;font-weight:900;display:block;line-height:1.6;margin-bottom:-8px}.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 h3.jsx-222626221{font-weight:600;margin-top:0;margin-bottom:5px;color:#363636}.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .text-md.jsx-222626221{color:#979797}.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .text-md.jsx-222626221 .mock_paper_download_button.jsx-222626221{background:#ff8a00;width:50px;height:50px;fill:rgb(255,255,255);border-radius:50%;position:absolute;right:30px;bottom:-20px}.icon{display:inline-block;line-height:initial;height:15px;width:15px}
</style>

<style>
  .ads_live_form_desktop_tnew,a.ads_live_form_desktop_tnew:last-child{border-right:1px solid #00000012}.dropdown-menu{z-index:99999!important}.dropdown-menu li a{background-image:none;color:#666;border-right:0 solid;text-align:left;display:block;line-height:22px;padding:8px 12px;text-transform:none;font-size:13px;letter-spacing:normal;text-decoration:none}.dropdown-menu li:hover{background-color:#eee}@media all and (min-width:992px){.nav-item .dropdown-menu{display:none;margin-top:0}.nav-item:hover .dropdown-menu{display:block}}.btn-round{border-radius:20px}.bodyslot-new{background:#f5f8f9;padding-bottom:16px;margin-top:0;margin-bottom:10px}.ads_body_live_form_container,.ads_live_form_desktop_tnew{margin:0 auto;max-width:100%;-webkit-text-decoration:none;text-decoration:none}.live-form-container-new .live-form-heading--icon{height:30px;width:30px;margin-right:10px}.live-form-container-new h4{padding:16px;text-transform:uppercase;color:#000;font-size:20px;font-weight:600;margin-bottom:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;background:#f5f8f9}.live-form-container-new .live-form-heading--icon svg{height:30px;width:30px}.live-form-container-new h4 .sponsored{font-size:13px;background:#ef233f1f;border-radius:30px;color:#ef233f;padding:5px 20px}.live-form-container-new .live-form-body-row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;box-shadow:0 0 4px 0 #cfcfcf80;border-radius:4px 4px 0 0;overflow-x:scroll}.ads_body_live_form_container{-webkit-flex:1;-ms-flex:1;flex:1}.live-form-container-new{overflow:hidden;text-align:initial;background:#fff;box-shadow:0 0 4px 0 #cfcfcf80;border-radius:4px}.ads_live_form_desktop_tnew{-webkit-flex:1;-ms-flex:1;flex:1;background:#fff;position:relative;min-height:100px;height:100%;display:block;font-size:14px;line-height:18px;color:#333;font-weight:400;flex:1;padding:12px 16px 16px;text-align:left}.live-form-container-new .ads_body_live_form_container:nth-child(odd) a .ads_bottom_border{background:#ff7900}.live-form-container-new .ads_body_live_form_container:nth-child(2n) a .ads_bottom_border{background:#4fb8dd}a.ads-live-form-review-banner .ads-bottom-border{position:absolute;bottom:0;left:0;width:100%;height:5px;background:#ff7900!important}.top-section{display:flex;align-items:center;margin-bottom:4px}.top-section.logo{border:2px solid #e7ebef;height:48px;width:48px;min-width:48px;border-radius:50%;overflow:hidden;margin-right:12px}.top-section .college_name{font-weight:700;font-size:16px;line-height:20px;color:#4fb8dd;height:42px;overflow:hidden}.ads_live_form_desktop_tnew .extra_info,.ads_live_form_desktop_tnew:hover .extra_info{color:#333}.extra_info{height:72px;overflow:hidden}.info-section .admission_info{line-height:17px;color:#1bce90;margin-top:4px;height:32px;overflow:hidden;display:flex;justify-content:flex-start;align-items:flex-end}.apply-btn{text-align:center}.ads_live_form_desktop_tnew .apply,.ads_live_form_desktop_tnew .apply:hover{background:#ff7900;display:inline-block;font-size:14px;color:#fff;min-width:220px;text-align:center;text-transform:uppercase;border-radius:4px;padding:6px;margin-top:8px}.ads_live_form_desktop_tnew .ads_bottom_border{position:absolute;bottom:0;left:0;width:100%;height:5px}a.ads-live-form-review-banner{min-height:210px;min-width:255px;height:100%;color:#333;padding:16px 16px 20px;background:#fff8f1}.sticky-item{position:sticky;top:0}.card.jsx-626553351{box-shadow:rgb(207 207 207 / 50%) 0 0 4px 0;border-radius:5px}.bg-white{background-color:#fff}.default-header.jsx-626553351{background-color:#f8f8f8;color:#323c4f;font-weight:700;font-size:15px;min-height:55px;border-bottom:1px solid rgba(204,204,204,.8);overflow:hidden}.pl-4,.px-4{padding-left:1rem}.align-items-center{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.d-flex{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.list-unstyled{padding-left:0;list-style:none}ul{display:block;list-style-type:disc;margin-block-start:1em;margin-block-end:1em;margin-inline-start:0;margin-inline-end:0;padding-inline-start:40px}.sidebar-single-elem{min-height:35px}.pl-3,.px-3{padding-left:.75rem}.pr-3,.px-3{padding-right:.75rem}.pb-2,.py-2{padding-bottom:.5rem}.pt-2,.py-2{padding-top:.5rem}.border-bottom{border-bottom:1px solid #dedede}*,::after,::before{box-sizing:border-box}user agent stylesheet li{display:list-item;text-align:-webkit-match-parent}.text-decoration-none{-webkit-text-decoration:none;text-decoration:none}.icon-sidebar-btn-lead{width:20%;height:49px;float:right;padding:.5rem;margin-top:-.5rem;margin-right:-.75rem;margin-bottom:-.5rem}
</style>

<script type="text/javascript">
  var wbpage='exampage';var _vtype='';var page='exam_details_page';var _st='';var _ct='';var _c='';
</script>
