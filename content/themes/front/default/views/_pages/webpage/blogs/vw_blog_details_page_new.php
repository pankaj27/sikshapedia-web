<section class="bradcumSec bg-white py-2">
   <div class="wrapper">
        <div class="row">
            <div class="col-md-10">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb bg-white m-0 pl-0">
                     <?php
                      if(!empty($blog_details['blog_breadcumb'])){
                        foreach ($blog_details['blog_breadcumb'] as $key => $value) {
                          ?>
                          <li class="breadcrumb-item <?php echo ($value=='')?'active':'';?>" <?php echo ($value=='')?'aria-current="page"':'';?>>
                            <?php echo ($value!='')?'<a href="'.$value.'">'.$key.'</a>':$key;?>
                            </li>
                          <?php
                        }
                      }
                      ?>
                      <li class="breadcrumb-item"><?php echo $blog_details['blog_category'];?></li>         
                    </ol>
                </nav>
            </div>
            <div class="col-md-12">
                <div class="media">
                    <div class="media-body">
                        <div class="row">
                            <div class="col-sm-12">
                              <h1 class="h2 pb-3"><?php echo $blog_details['blog_title'];?></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="pageDetailsSec py-4">
    <div class="wrapper">
      <div class="container blog-inner-page">
          <div class="row mt-4 pt-3">
              <div class="col-lg-12">
              

                <!-- Post content-->
                <div class="card infoCard mb-4">
                <div class="card-body">
                  <?php
                  if(!empty($blog_details)){
                    ?>
                     <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
                      <div class="media">
                        <a href="https://www.sikshapedia.com/" class="mr-3 " target="_blank">
                          <img class="img-circle exam_uploaded_by_img" src="<?php echo $blog_details['blog_creator_img'];?>" width="50" height="50" alt="<?php echo $blog_details['blog_creator_name'];?>">
                        </a>
                        <div class="media-body">
                          <h5 class="mt-0 text-dark exam_uploaded_by"><a href="https://www.sikshapedia.com/" target="_blank"> <?php echo $blog_details['blog_creator_name'];?> </a> </h5>
                          <p class="m-0">Content Curator
                          </p>
                        </div>
                      </div>
                      <div class="updateDate color2 exam_updateDate"><i class=" far fa-calendar-alt"></i>  <?php echo $blog_details['blog_updated_at'];?></div>
                    </div><img class="rounded-3" src="<?php echo $blog_details['blog_cover_image'];?>" style="width: 100%;" alt="<?php echo $blog_details['blog_cover_image_alt'];?>" draggable="false">

                      
                      <?php
                      if(!empty($blog_details['blog_details_data'])){
                        foreach ($blog_details['blog_details_data'] as $key => $value) {
                          if($value['bolg_content_type']==='general'){
                            ?>
                            <div class="row mb-4">
                              <div class="col-lg-12 col-sm-12 col-md-6">
                                  <div class="img-right-prt">
                                      <?php echo $value['blog_content_value'];?>
                                  </div>                            
                              </div>
                            </div>
                            <?php
                          }else if($value['bolg_content_type']==='image'){
                            ?>
                            <div class="img-sect">
                                <img src="<?php echo $value['blog_content_value'];?>" style="width: 100%;" class="rounded-2 mb-4" alt="<?php echo $blog_details['blog_cover_image_alt'];?>" draggable="false">
                            </div>
                            <?php
                          }else if($value['bolg_content_type']==='video'){
                            ?>
                            <div class="vide-sec">

                                <div class="image ex3 mb-md-3" data-src="https://www.youtube.com/embed/-lkEOEEKYD0?autoplay=1" data-poster="img/intro/video_intro.jpg">
                                  <a class="play-video lightboxjs-link" data-width="1000" data-height="600" data-url="https://www.youtube.com/embed/-lkEOEEKYD0?autoplay=1">
                                    <img src="img/intro/video_intro.jpg" class="place2study2 rounded-2" alt="video">
                                      <span class="play">
                                          <span></span>
                                      </span>
                                  </a>
                              </div>

                            </div> 
                            <?php
                          }
                          else if($value['bolg_content_type']==='ads'){
                            ?>
                            <div class="row mb-4">
                              <div class="col-lg-12 col-sm-12 col-md-6">
                                  <div class="img-right-prt">
                                      <?php echo $value['blog_content_value'];?>
                                  </div>                            
                              </div>
                            </div>
                            <?php
                          }
                        }
                      }
                      ?>
                      
                    <?php
                  }
                  ?>
                      
                      </div>

                </div>
              </div>
          </div>
      </div>
    </div>
</section>

      <style type="text/css">
	     .headerslot, .default-ad{
          width: 100%;
          height: 90px;
          overflow-y: hidden;
        }
        .headerslot-1x1 {
          height: 1px;
          width: 1px;
          overflow: hidden;
          opacity: 0;
         }
        .headerslot .header_ads_shimmer{
          margin: 0 auto;
        }
        .default-ad {
          display: none;
          text-align: center;
          min-width: 320px;
          
        }
        .d-none {
          display: none !important;
        }
        .headerslot.d-none ~ .default-ad {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-block: 15px;
        }
        .img-right-prt {
    margin-top: 15px;
}


        /*div#content {
             display: flex;
         }

         @media (min-width: 769px) {
            #right-sidebar .inside-right-sidebar {
                position: -webkit-sticky;
                position: sticky;
                top: 100px;
            }
         }
*/

         /***Post Area***/
       /*  .post-layout-1-area {
           padding-top: 17px; 
         }
         .post-layout-1-area.post-layout-2-area {
             padding-top: 50px; 
          }
         .post-layout-1-area.post-layout-2-area .about-author-content {
             margin-left: -30px;
             margin-right: -30px; 
         }
         @media only screen and (min-width: 768px) and (max-width: 991px) {
            .post-layout-1-area.post-layout-2-area .about-author-content {
               margin-left: 0;
               margin-right: 0; 
            } 
         }
         @media (max-width: 767px) {
            .post-layout-1-area.post-layout-2-area .about-author-content {
               margin-left: 0;
               margin-right: 0; 
            } 
         }*/
        .data12 {
    margin-right: 10px;
    margin-left: 3px;
}

	</style>

<script type="text/javascript">
var wbpage='blog_page';
   var page ='';
   var _c='';
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

  setTimeout(function(){
    var cimg='https://www.sikshapedia.com/public/data/app/app_data/way2a.png?tr=h-50,w-50,c-force';
    var _cname='Sikshapedia';
    $('#reg3ApplyModal').find('.img_logo').attr('src',cimg);
    $('#reg3ApplyModal').find('.img_logo').attr('alt',_cname);
    $('#reg3ApplyModal').find('.media-body').html('Register Now To Apply<br>'+_cname);
    $('#reg3ApplyModal').find('#sayCarousol').hide();
    $('#reg3ApplyModal').find('#applicant_aut_source').val('blog_page');
    $('#reg3ApplyModal').find('#_applicant_aut_source').val('blog_page');
    $('#reg3ApplyModal').modal('show');
  },5000);
</script> 