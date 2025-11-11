<section class="bradcumSec bg-white py-2">
  <div class="wrapper">
    <div class="row">
      <div class="col-md-10">
        <nav aria-label="breadcrumb" >
            <ol class="breadcrumb bg-white m-0 pl-0">
              <?php
              foreach ($stream_data['breadcumb'] as $key => $value) {
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
                          <h1 class="mt-0 stream_page_heading"><?php echo $stream_data['stream_heading'];?></h1>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</section>

<?php
if(!empty($stream_data['stream_menues'])){

  ?>
    <section class="tabSliderSec border-top">
      <div class="weapper">
        <div class="swiper-container tabSlider navTabSlider">
          <div class="swiper-wrapper">
           
            <?php
            foreach ($stream_data['stream_menues'] as $key => $value) {
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
      <div class="col-lg-9 mb-4 mb-lg-0">

        <?php $this->widget->run('front_stream_details_data',TRUE,['stream_id'=>$stream_data['stream_id'],'stream_inner_menu_id'=>$stream_data['stream_menu_id'],'stream_slug'=>$stream_data['stream_menu_slug']]);?>
        <?php $this->widget->run('front_stream_all_courses',TRUE);?>
      </div>
      <div class="col-lg-3 mb-4 mb-lg-0">

        <div class="card mb-4">
          <div class="card-header bg-white">
            <h5 class="m-0 text-uppercase">TOP Opportunities</h5>
          </div>
          <div class="card-body">
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
                 crossorigin="anonymous"></script>
            <ins class="adsbygoogle"
                 style="display:inline-block;width:250px;height:400px"
                 data-ad-client="ca-pub-9545373166119354"
                 data-ad-slot="8224947754"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </div>
        </div>



        
        <?php $this->widget->run('front_stream_colleges_top_section',TRUE);?> 
        <?php $this->widget->run('front_stream_top_section',TRUE);?> 
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 mb-4 mb-lg-0">
        <?php $this->widget->run('front_stream_colleges_section',TRUE);?>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 mb-4 mb-lg-0">
        <?php $this->widget->run('front_college_comment_section',TRUE);?>
      </div>
    </div>
  </div>
</section>

 <?php $this->widget->run('front_subscription_section',TRUE);?>

 <script type="text/javascript">var page='stream_details_page';var wbpage='stream_details_page';var _c='';
   var _vtype='';
   var _st='';
   var _ct='';
   var _strm='';
   var _cu='';
   var _exam='';
   var _ctype='';
   var _appr='';
   var _aff='';
   var _c_cate='';
   var _agn='';
   var visit_type='STREAMS';
   var visit_type_id='';</script>