<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="headerBnrSec overlayBnr">
  <img src="<?php echo $college_data['college_banner'];?>" class="headerBnrImg" alt="">
  <div class="wrapper">
    <div class="headerBnrPanel">
      <div class="bnrThumbBox">
        <div class="bnrThumb shadow bg-white"><img src="<?php echo $college_data['college_logo'];?>" alt="<?php echo $college_data['college_name'];?>" loading="lazy"></div>
        <div class="bnrThumbCon pt-2">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-0 bg-none mb-1" id="ol_breadcrumb">
              <?php
              foreach ($college_data['college_breadcrumb'] as $key => $value) {
                ?>
                <li class="breadcrumb-item <?php echo (empty($value))?'active':'';?>">
                  <?php
                  if(!empty($value)){
                    ?>
                    <a href="<?php echo $value;?>"><strong><?php echo $key;?></strong></a>
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
          <h5 class="m-0 bnrTitle text-truncate text-uppercase w-75 font-weight-bolder" id="page_heading"><?php echo $college_data['college_name_formatted'];?></h5>
          <div class="m-0  d-lg-flex  justify-content-between tagLists w-75">
            <div class="text-white text-capitalize font-weight-semi text-md text-truncate tags">
              <span><i class="fas fa-map-marker-alt"></i> <?php echo $college_data['college_city'];?>,<?php echo $college_data['college_state'];?> </span>

              <?php
              if(!empty($college_data['college_affiliations'])){
                ?>
                <span><i class="fas fa-bookmark"> </i> <?php echo $college_data['college_affiliations'];?> </span> 
                <?php
              }

              ?>

              <span><i class="fas fa-thumbtack"></i> ESTD <?php echo $college_data['college_estd'];?> </span> 
              <?php

              if(!empty($college_data['college_university'])){
                ?>
                <span><i class="fas fa-flag"></i> <?php echo $college_data['college_university'];?></span>
                <?php
              }

              ?>

              
              
              <span><i class="fas fa-star"> </i> <?php echo $college_data['college_type'];?> </span> 
              <!-- <span><i class="fas fa-tags"> </i>  10 QUESTIONS </span> 
              <span><i class="fas fa-tags"> </i>  ANSWERED </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> --> 
            </div>
            <!-- <div class="pl-2"><a href="">  MORE </a></div>  -->
          </div>
        </div>

      </div>
      <div class="headerBnrCon d-md-block" style="width:240px;">
        <!-- <button type="button" class="btn btn-outline-light btnContact font-weight-bolder contact-link" data-cname="<?php echo $college_data['college_name'];?>,<?php echo $college_data['college_city'];?>" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>" data-clogo="<?php echo $college_data['college_logo'];?>" data-cphcode="<?php echo $college_data['college_country_phone_code'];?>" data-cou="<?php echo $college_data['college_country_id'];?>" id="">ADMISSION PREDICTOR</button> -->

        <!-- <div class="" style="margin-right:10px;">
          <button type="button" class="btnFavorite btn_shortlist active" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>"></button>
        </div> -->
        <div class="" style="margin-left:40px;">
          <button type="button" class="btn btn-outline-light btnContact font-weight-bolder contact-link" data-cname="<?php echo $college_data['college_name'];?>,<?php echo $college_data['college_city'];?>" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>" data-clogo="<?php echo $college_data['college_logo'];?>" data-cphcode="<?php echo $college_data['college_country_phone_code'];?>" data-cou="<?php echo $college_data['college_country_id'];?>" id="btn_get_contact_details" style="width:200px;">GET CONTACT DETAILS</button>

        </div>
            
        <div class="ratingBox ">
            <div class="points">0</div>
            <div class="reviewStars">
              <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></div>
              <div class="reviewCounts">0 REVIEWS</div>
            </div>
        </div>
  
        
            
        <a href="<?php echo $college_data['college_claim_url'];?>" class="btn btn-outline-light btnContact text-white pl-2" style="width:200px;margin-left:40px;cursor: pointer !important;"> <i class="fas fa-dot-circle text-warning pals" ></i>  Claim This College</a>


      </div>
     
    </div>
  </div>
</section>

  <?php


  if(!empty($college_data['college_inner_menues'])){
    ?>
    <section class="tabSliderSec">
      <div class="swiper-container tabSlider navTabSlider">
        <div class="swiper-wrapper">
          <?php
          $i=0;
          foreach ($college_data['college_inner_menues'] as $key => $value) {
           ?>
           <a href="javascript:void(0)" id="menu-<?php echo $value['menu_alias'];?>" class="swiper-slide navLink inst_inner_menu <?php echo ($i==0)?'active':'';?> text-nowrap false nav-item d-inline-block text-capitalize font-weight-bold text-secondary text-base pt-4 pb-3" data-mid="<?php echo $value['menu_id'];?>" data-link="<?php echo $value['menu_link'];?>" data-title="<?php echo $value['menu_title'];?>" data-desc="<?php echo $value['menu_meta_desc'];?>" data-keywords="<?php echo $value['menu_meta_key_words'];?>" data-og_title="<?php echo $value['meta_og_title'];?>" data-og_desc="<?php echo $value['meta_og_desc'];?>" data-page_heading="<?php echo $value['menu_page_heading'];?>" data-widgets="<?php echo $value['menu_widgets'];?>" data-menu_alias="<?php echo $value['menu_alias'];?>"> <?php echo $value['menu_name'];?> </a>
           <?php

           $i++;
          }
          ?>
        </div>
        <div class="swiper-button-next swiper-button-white"></div>
        <div class="swiper-button-prev swiper-button-white"></div>
      </div>
    </section>
    <?php
  }

  ?>

  <section class="pageDetailsSec py-4">
    <div class="wrapper">



      <div class="row">

        <div class="col-lg-9 mb-4 mb-lg-0" id="page_main_content">

        </div>

        <div class="col-lg-3 ">

            <?php
            if($college_data['show_apply']==true){
              if($college_data['apply_disabled']!=''){
                ?>
                
                  <button type="button" class="btn btn-lg btn-primary mb-3 btn-block  d-flex justify-content-between align-items-center" <?php echo $college_data['apply_disabled'];?>><span>APPLY NOW </span> <i class="far fa-envelope"></i></button>
                    <!-- <a href="" class="btn btn-lg btn-warning  mb-3 btn-block d-flex justify-content-between align-items-center"> <span>DOWNLOAD BROCHURE </span> <i class="fas fa-download"></i></a> -->
           
                <?php
              }else{
                ?>
                <button type="button" class="btn btn-lg btn-primary mb-3 btn-block  d-flex justify-content-between align-items-center apply" data-clogo="<?php echo $college_data['college_logo'];?>" data-cname="<?php echo $college_data['college_name'];?>,<?php echo $college_data['college_city'];?>" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>" data-cphcode="<?php echo $college_data['college_country_phone_code'];?>" data-cou="<?php echo $college_data['college_country_id'];?>"><span>APPLY NOW </span> <i class="far fa-envelope"></i></button>
                    <!-- <a href="" class="btn btn-lg btn-warning  mb-3 btn-block d-flex justify-content-between align-items-center"> <span>DOWNLOAD BROCHURE </span> <i class="fas fa-download"></i></a> -->
                <?php
              }
            }
            ?>
        <div>

        
            
        </div>

        <div class="card mb-4">
          <div class="card-header bg-white">
            <h5 class="m-0">COLLEGES IN THE SAME GROUP</h5>
          </div>
          <ul class="list-group list-group-flush" id="colleges_in_group">
            <?php
            for ($i=0; $i < 7; $i++) { 
              ?>
              <li class="list-group-item">
                <a href="#" class="media">
                  <div class="card__image loading"></div> 
                  <div class="media-body">
                    <h6 class="mb-0 color2 skeleton-loader"></h6>
                    <small class="skeleton-loader"></small> 
                  </div>
                </a>
              </li>
              <?php
            }
            ?>            
          </ul>
        </div>




        <!-- <div class="card notificationCard mb-4">
          <div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
            <h5 class="m-0">Notification</h5>
            <i class="fas fa-bell"></i>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
          </ul>
          <div class="card-header bg-white text-center">
            <a class="#">View All News</a>
          </div>
        </div> -->
            
          
            
          <div class="card notificationCard mb-4">
            <div class="card-header bg-white">
              <h5 class="m-0">TOP COURSES</h5>
            </div>
            <ul class="list-group list-group-flush" id="college_courses_list">
              <?php
              for ($i=0; $i < 4; $i++) { 
                ?>
                <li class="list-group-item">
                  <a href="#" class="media">
                    <div class="card__image loading"></div> 
                    <div class="media-body">
                      <h6 class="mb-0 color2 skeleton-loader"></h6>
                      <small class="skeleton-loader"></small> 
                    </div>
                  </a>
                </li>
                <?php
              }
              ?>

              <!-- <li class="list-group-item">
                <a href="#" class="media">
                  <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li> -->

            </ul>
            <div class="card-header bg-white text-center">
              <a class="#">VIEW MORE COURSES</a>
            </div>
          </div>

          <div class="card interestCard mb-4">
            <div class="card-body ">
              <div class="icon text-center mb-3" style="position:absolute;left:30%;">
                <svg width="144" height="47" viewBox="0 0 144 47" xmlns="http://www.w3.org/2000/svg" ><g fill="none" fill-rule="evenodd"><path d="M72.5 4.3h4.3V1.5h-6.55v3.55h1.5a.75.75 0 01.75-.75z" fill="#FFCC75"></path><path fill="#F2EBD9" d="M70.25 33.167h5.25V42.5h-5.25zM63.5 33.167h5.25V42.5H63.5z"></path><path fill="#FFF" d="M63.5 44h12v1.5h-12zM57 43.25V29.5h-9.5v16h10.25V44a.75.75 0 01-.75-.75zm-5.833-7.833a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3zm3.666 0a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3zM91.5 45.5v-16H82v13.75a.75.75 0 01-.75.75v1.5H91.5zm-3.667-13.083a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm-3.666 0a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3z"></path><path d="M81.25 44a.75.75 0 01-.75-.75V19.4h-5.25a.75.75 0 01-.75-.75H73a.75.75 0 01-.75.75H58.5v23.85a.75.75 0 01-.75.75v1.5H62V32.417a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75V45.5h4.25V44zM69.5 29.167a3.637 3.637 0 01-3.633-3.634A3.638 3.638 0 0169.5 21.9a3.637 3.637 0 013.633 3.633 3.638 3.638 0 01-3.633 3.634z" fill="#FFF"></path><path d="M69.5 23.4a2.136 2.136 0 00-2.133 2.133c0 1.177.957 2.134 2.133 2.134a2.136 2.136 0 002.133-2.134A2.136 2.136 0 0069.5 23.4z" fill="#98D9D5"></path><path fill="#F2EBD9" d="M47.5 25.5H57V28h-9.5zM82 25.5h9.5V28H82z"></path><path d="M74.5 18.65a.75.75 0 01.75-.75h3.844L69.5 10.307 59.906 17.9H72.25a.75.75 0 01.75.75h1.5z" fill="#FF6E1D"></path><path d="M92.25 24H82v-5.35a.738.738 0 00-.005-.082c0-.007-.002-.013-.003-.02a.759.759 0 00-.01-.06l-.006-.023a.756.756 0 00-.016-.055l-.008-.023a.76.76 0 00-.06-.122l-.013-.022a.762.762 0 00-.033-.047l-.013-.018a.754.754 0 00-.053-.059l-.006-.005a.715.715 0 00-.054-.048l-.005-.004L70.25 8.987V1.5h6.55v2.8h-4.3a.75.75 0 000 1.5h5.05a.75.75 0 00.75-.75V.75a.75.75 0 00-.75-.75H69.5a.75.75 0 00-.75.75v8.237l-11.466 9.075-.004.004a.762.762 0 00-.054.048l-.006.005a.754.754 0 00-.053.059l-.013.018a.762.762 0 00-.033.047l-.014.022a.772.772 0 00-.059.122l-.008.023a.729.729 0 00-.016.055l-.006.023a.751.751 0 00-.01.06c-.001.007-.003.013-.003.02a.763.763 0 00-.005.082V24H46.75a.75.75 0 00-.75.75v21.5c0 .414.336.75.75.75h45.5a.75.75 0 00.75-.75v-21.5a.75.75 0 00-.75-.75zM63.5 45.5V44h12v1.5h-12zm12-12.333V42.5h-5.25v-9.333h5.25zM68.75 42.5H63.5v-9.333h5.25V42.5zM77 32.417a.75.75 0 00-.75-.75h-13.5a.75.75 0 00-.75.75V45.5H47.5v-16H57v13.75a.75.75 0 001.5 0V19.4h13.75a.75.75 0 000-1.5H59.906l9.594-7.593 9.594 7.593H75.25a.75.75 0 000 1.5h5.25v23.85a.75.75 0 001.5 0V29.5h9.5v16H77V32.417zM91.5 28H82v-2.5h9.5V28zM57 28h-9.5v-2.5H57V28z" fill="#082947"></path><path d="M50.417 31.667a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zM54.083 31.667a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zM88.583 36.167a.75.75 0 00.75-.75v-3a.75.75 0 00-1.5 0v3c0 .414.336.75.75.75zM84.917 36.167a.75.75 0 00.75-.75v-3a.75.75 0 00-1.5 0v3c0 .414.335.75.75.75zM69.5 21.9a3.637 3.637 0 00-3.633 3.633 3.637 3.637 0 003.633 3.634 3.637 3.637 0 003.633-3.634A3.637 3.637 0 0069.5 21.9zm0 5.767a2.136 2.136 0 01-2.133-2.134c0-1.176.957-2.133 2.133-2.133 1.176 0 2.133.957 2.133 2.133a2.136 2.136 0 01-2.133 2.134z" fill="#082947"></path><g fill="#F7F7F7"><path d="M35.798 28.418c2.108-5.69 2.345-9.798 1.928-12.542-.487-3.207-3.458-5.645-6.576-5.086-3.664.657-3.755 4.689-3.755 4.689s-3.711-1.573-5.802 1.507c-1.779 2.62-.76 6.327 1.972 8.076 2.337 1.497 6.177 2.968 12.233 3.356z"></path></g><g fill="#F5F5F5"><path d="M5.053 37.714c4.014-1.76 6.267-3.697 7.484-5.29 1.421-1.863 1.197-4.63-.657-5.969-2.18-1.573-4.32.402-4.32.402S6.515 24.14 3.866 24.6c-2.254.39-3.668 2.78-3.207 5.076.395 1.966 1.557 4.698 4.394 8.04z"></path></g><g fill="#F5F5F5"><path d="M130.563 29.139c-3.064-5.239-4.01-9.242-4.077-12.018-.077-3.242 2.426-6.16 5.593-6.15 3.723.011 4.513 3.966 4.513 3.966s3.381-2.194 5.975.477c2.207 2.272 1.847 6.098-.54 8.296-2.041 1.88-5.567 3.995-11.464 5.429z"></path></g><g fill="#F0F0F0"><path d="M109.178 37.873c-3.374-2.799-5.005-5.282-5.735-7.15-.854-2.181.124-4.779 2.276-5.555 2.53-.912 4.042 1.577 4.042 1.577s1.753-2.324 4.173-1.152c2.06.996 2.76 3.682 1.683 5.763-.921 1.78-2.791 4.086-6.44 6.517z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M98.277 14.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092s1.214-1.609 2.889-.798c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M27.277 44.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092s1.214-1.609 2.889-.798c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M50.277 13.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092S51.895 4.6 53.57 5.41c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g></g></svg>
              </div>
              <h6 class="mb-3 text-center" style="margin-top:60px;">INTERESTED IN THIS COLLEGE ?</h6>
              <button type="button" class="btn btn-warning btn-block d-flex justify-content-between align-items-center" data-clogo="<?php echo $college_data['college_logo'];?>" data-cname="<?php echo $college_data['college_name'];?>,<?php echo $college_data['college_city'];?>" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>" data-cphcode="<?php echo $college_data['college_country_phone_code'];?>" data-cou="<?php echo $college_data['college_country_id'];?>" id="btn_ask_question"> <span>ASK QUESTION </span> <i class="fas fa-question"></i></button>
            </div>
          </div>

          <div class="card mb-4 position-sticky" style="top:50px;">
            <div class="card-header bg-white">
              <h5 class="m-0">News</h5>
            </div>
            <ul class="list-group list-group-flush" id="news_list">
              <?php
              for ($i=0; $i < 6; $i++) { 
                ?>
                <li class="list-group-item">
                  <a href="#" class="media">
                    <div class="card__image loading"></div> 
                    <div class="media-body">
                      <h6 class="mb-0 color2 skeleton-loader"></h6>
                      <small class="skeleton-loader"></small> 
                    </div>
                  </a>
                </li>
                <?php
              }
              ?>

              <!-- <li class="list-group-item">
                <a href="#" class="media">
                  <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="http://waytoadmissions.com/dev/uploads/data/colleges/techno-india-hooghly-chinsurah-west-bengal/pNgO1AXxvz.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li> -->

            </ul>
            <!-- <div class="card-header bg-white text-center">
              <a class="#">View All News</a>
            </div> -->
          </div>


          <?php $this->widget->run('front_placement_side_section',TRUE);?>

          <?php $this->widget->run('front_faculties_side_section',TRUE);?>

          <?php $this->widget->run('front_courses_side_section',TRUE , decode_data($college_data['college_user_id']));?>

          <?php $this->widget->run('front_exams_side_section',TRUE , decode_data($college_data['college_user_id']));?>

          <div class="card mb-4">
            <!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354" crossorigin="anonymous"></script> -->
            <!-- wayto_vert_ads -->
            <!-- <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-9545373166119354"
                 data-ad-slot="5422362548"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script> -->
          </div>

          <!-- <div class="card mb-4">
            <iframe src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=12&l=ez&f=ifr&linkID=09d859c81060b3700efc6ef781c7e47e&t=qunastack-20&tracking_id=qunastack-20" width="300" height="250" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>
          </div> -->



          
        </div>

      </div>
    </div> 
  </section>

  <style type="text/css">
    .card__image.loading {
        height: 40px;
        width: 40px;
        margin-right: 5px !important;
        background: #d3d3d370;
        background-repeat: repeat-y;
        background-size: 40px 40px;
        background-position: 0 0;
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

    #btn_get_contact_details{
      cursor: pointer !important;
      margin-bottom:20px;
    }

    .headerBnrSec.overlayBnr .bnrThumbBox .bnrThumbCon {
        width: calc(100% - 210px);
    }
  </style>


  

  <?php $this->widget->run('front_subscription_section',TRUE);?>

  <script type="text/javascript">var _cid='<?php echo $college_data['college_user_id'];?>';var _co='<?php echo $college_data['college_country_id'];?>';var _cot='<?php echo $college_data['college_city_country_id'];?>';var _cit='<?php echo $college_data['college_city_id'];?>';var _st='<?php echo $college_data['college_city_state_id'];?>';var page='';var wbpage='<?php echo $college_data['inst_web_page'];?>';var _c='';var _ct='';var _vtype='COLLEGE';let _vip='<?php echo $this->input->ip_address();?>';var _strm='';var _cu='';var widget='<?php echo $college_data['college_page_widget'];?>'; var _exam ='';var m=[];var total_menues


  <?php

  if(!empty($college_data['college_inner_menues'])){
    foreach ($college_data['college_inner_menues'] as $key => $value) {

      ?>

      m[<?php echo $value['menu_id'];?>]='<?php echo $college_data['college_inner_menues_breadcrumb'][$value['menu_id']];?>';

      <?php
      
    }
  }

  ?>



</script>