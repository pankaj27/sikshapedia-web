<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<link rel="preload" href="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9863867561837948" as="script">

<section class="bradcumSec bg-white py-2">
	
	<div class="wrapper">
	  <div class="row">
	    <div class="col-md-12 ">
	      <ol class="breadcrumb bg-white m-0 pl-0" id="breadcrumb_li">
              <?php
              if(!empty($page_bredcrumb)){
                foreach ($page_bredcrumb as $key => $value) {
                  ?>
                  <li class="breadcrumb-item <?php echo ($value=='')?'active':'';?>" <?php echo ($value=='')?'aria-current="page"':'';?>>
                    <?php echo ($value!='')?'<a href="'.$value.'">'.$key.'</a>':$key;?>
                    </li>
                  <?php
                }
              }
              ?>
            </ol>
	    </div>
	    <div class="col-md-12 mb-2">
	      <h1 class="m-0 text-center text-md-left" id="breadcrumb_title" style="font-size: 26.7px;font-weight: 900;"><?php echo $page_heading;?></h1>
	    </div>
	  </div>
	  <div class="adBlock">
	    <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
	      <iframe title="3rd party ad content" width="728" height="90" x-frame-width="720" x-frame-height="90" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" src="https://www.sikshapedia.com/web-api/v1/ads_college_top" style="border: 0px; vertical-align: bottom;"></iframe>
	    </div>
	  </div>
	</div>

</section>

<main class="pageDetailsSec isa-main-content" id="main_content">
	<div class="isa-tab-filter-wrapper filter-is-visible">
	  <div class="row no-gutters">
	    <div class="col-md-8">
	      <div class="filterBlock d-none d-md-flex flex-wrap align-items-center"></div>
	    </div>
	    <div class="col-md-4">
	      <div class="isa-tab-filter">
	        <ul class="">
	          <li class="placeholder">
	            <a href="#0">Sort By</a>
	          </li>
	          <li class="filter">
	            <a class="selected" data-type="popularity" href="#0">Popularity</a>
	          </li>
	          <!-- <li class="filter"><a href="#0" data-type="reviews_rating">Reviews Rating </a></li><li class="filter"><a href="#0"data-type="fees">Fees</a></li> -->
	        </ul>
	      </div>
	    </div>
	  </div>
	  <?php


	  if(!empty($in_page_filters)){
	  	//print_obj($in_page_filters);
	  	foreach ($in_page_filters as $key => $value) {
	  		?>
	  		<div class="border-top py-2">
	  			<div class="filterBlock d-flex flex-wrap align-items-center">
	  				<span class="blockTitle">SELECT <?php echo strtoupper(str_replace('_', ' ', $key));?>  </span>
	  				<?php
	  				foreach ($value as $k => $v) {
	  					?>
	  					<a href="<?php echo $v['url_filter_url'];?>" class="btn btn-outline-primary"> <?php echo $v['url_filter_title'];?> (<?php echo $v['url_filter_total_colleges'];?>) </a>
	  					<?php
	  				}

	  				?>
	  			</div>
	  		</div>
	  		<?php
	  	}
	  }

	  ?>
	</div>

	<!--Filter Wrapper-->

	<div id="filter_list">
	  	<div class="isa-filter filter-is-visible">
		    <div class="forlerForm">
		      	<!-- <div class="isa-filter-block">
				  <h4>Search</h4>
				  <div class="isa-filter-content">
				    <input type="search" placeholder="Search">
				  </div>
				</div>
				<div class="isa-filter-block">
				  <h4>Selected Filter</h4>
				  <div class="isa-filter-content nicescroll">
				    <a href="#" class="btn btn-sm btn-outline-primary">Selected <span class="badge badge-light">
				        <i class="fas fa-times"></i>
				      </span>
				    </a>
				    <a href="#" class="btn btn-sm btn-outline-primary">Selected <span class="badge badge-light">
				        <i class="fas fa-times"></i>
				      </span>
				    </a>
				    <a href="#" class="btn btn-sm btn-outline-primary">Selected <span class="badge badge-light">
				        <i class="fas fa-times"></i>
				      </span>
				    </a>
				    <a href="#" class="btn btn-sm btn-outline-primary">Selected <span class="badge badge-light">
				        <i class="fas fa-times"></i>
				      </span>
				    </a>
				    <a href="#" class="btn btn-sm btn-outline-primary">Selected <span class="badge badge-light">
				        <i class="fas fa-times"></i>
				      </span>
				    </a>
				    <a href="#" class="btn btn-sm btn-outline-primary">Selected <span class="badge badge-light">
				        <i class="fas fa-times"></i>
				      </span>
				    </a>
				  </div>
				</div> -->
		      	<div class="isa-filter-block">

		      		<?php
		      		if(!empty($inpage_top_filters)){
		      			foreach ($inpage_top_filters as $key => $value) {
		      				?>
		      				<h4><strong><?php echo strtoupper(str_replace('_', ' ', $key));?></strong></h4>
		      				<ul class="isa-filter-content list nicescroll">
		      				<?php
				  				foreach ($value as $k => $v) {
				  					?>
				  					<li>

				  						<?php
				  						if(in_array($v['url_filter_type_tag'], array('sub_stream','type_of_college'))){
				  							?>
				  							<input class="filter coursefilter" type="checkbox" name="<?php echo $key;?>" id="<?php echo $key;?>-<?php echo $v['url_filter_value'];?>" value="<?php echo $key;?>-<?php echo $v['url_filter_value'];?>" data-url="" <?php echo ($v['url_filter_selected']==true)?'checked':'';?>>
							            <label class="checkbox-label" for="<?php echo $key;?>-<?php echo $v['url_filter_value'];?>" data-ty="<?php echo $key;?>" data-ctrl="radio"><?php echo $v['url_filter_title'];?> - [<?php echo $v['url_filter_total_colleges'];?>]</label>
				  							<?php
				  						
				  						}else{
				  							?>
				  							<input class="filter coursefilter" type="radio" name="<?php echo $key;?>" id="<?php echo $key;?>-<?php echo $v['url_filter_value'];?>" value="<?php echo $key;?>-<?php echo $v['url_filter_value'];?>" data-url="" <?php echo ($v['url_filter_selected']==true)?'checked':'';?>>
							            <label class="checkbox-label" for="<?php echo $key;?>-<?php echo $v['url_filter_value'];?>" data-ty="<?php echo $key;?>" data-ctrl="radio"><?php echo $v['url_filter_title'];?> - [<?php echo $v['url_filter_total_colleges'];?>]</label>
				  							<?php
				  						}

				  						?>

							            
							        </li>
				  					<?php
				  				}
				  				?>
			  				</ul>
			  				<?php
		      			}
		      		}

		      		?>

			          
				</div>
				<!-- <a href="javascript:void(0);" class="isa-close"><i class="fas fa-times"></i></a> -->
			</div>
			<a href="javascript:void(0);" class="isa-filter-trigger"><i class="fas fa-filter"></i> Filters</a>
		</div>
	</div>

	<!--Filter Wrapper-->

	<!--Main Filtered Data-->

	<section class="isa-filter-result">              
      <div class="form-row" id="udata_lists">
      	<?php
			if(!empty($filtered_data)){

				$data_count=1;
				$ads_painted=false;

				foreach ($filtered_data as $k => $v) {
					foreach ($v as $_ck => $cv) {
						?>
						<link rel="preload" href="<?php echo $cv['college_banner'];?>" as="image">
						<div class="col-sm-6 col-md-4 col-lg-4 grid_list">
				          	<div class="loader-ripple" style="display:none;"></div>
				       
				          	<div class="proBox">
				              <div class="imgBox">
				                <a href="<?php echo $cv['access_url'];?>"> <img class="lazy" src="<?php echo $cv['college_banner'];?>" alt="<?php echo $cv['college_name'];?>"></a>

				                <?php
				                if($cv['is_featured']=='1'){
				                  ?>
				                  <div class="pro-label pro-featured">
				                    <span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>
				                  </div>
				                  <?php
				                }
				                ?>
				                
				                <!-- <div class="pro-label pro-status">
				                  <span class="pro-label-bg"><span class="pro-arrow"></span> On Offer </span>
				                </div> -->
				                <div class="proReview">
				                  <i class="far fa-image"></i> <b><a href="<?php echo $cv['college_gallery_link'];?>"><span style="color:#ffffff;"> <?php echo $cv['college_total_gallery_img'];?></span></a></b> 
				                </div>
				                <div class="proRating">
				                  <small class="d-block">RATING</small>
				                  <i class="fas fa-star-half-alt"></i> <b>6.7/10</b> 
				                </div>
				                <div class="pro-action">
				                  <div class="pro-action-inner">
				                    <div class="social-share" data-toggle="tooltip" title="Share">
				                      <div class="social-share-hover">
				                        <i class="fa fa-share-alt"></i>
				                        <div class="social-share-list">
				                          <div class="list-social-icon clearfix">
				                            <a href="javascript:;"><i class="fab fa-facebook"></i></a>
				                            <a href="javascript:;"><i class="fab fa-twitter"></i></a>
				                            <a href="javascript:;"><i class="fab fa-google-plus"></i></a>
				                            <a href="javascript:;"><i class="fab fa-linkedin"></i></a>
				                          </div>
				                        </div>
				                      </div>
				                    </div>

				                    <?php
				                    if(!empty($cv['college_intro_video'])){
				                    ?>
				                     <a href="<?php echo $cv['college_intro_video'];?>" data-fancybox class="property-video" data-toggle="tooltip" title="Show Video"><i class="fab fa-youtube"></i></a>
				                    <?php
				                    }
				                    ?>


				                    <a href="javascript:;" class="property-favorite" data-toggle="tooltip" title="Add to Favorite"><i class="far fa-heart"></i></a>
				                    <a class="compare-property" href="javascript:;" data-toggle="tooltip" title="Rating"><i class="far fa-star"></i></a>
				                  </div>
				                  <a class="pro-link" href="#"></a>
				                </div>
				              </div>
				              <div class="proBoxBody">
				                <div class="proInfo">
				                  <div class="infoImg"><a href="<?php echo $cv['access_url'];?>"><img class="lazy" src="<?php echo $cv['college_logo'];?>" loading="lazy" width="50px" height="50px"></a></div>
				                  <p class="infoTitle"><a href="<?php echo $cv['access_url'];?>"><?php echo $cv['college_name'];?></a></p>
				                  <p class="infoLocation" style="font-size: 10px;"><i class="fas fa-map-marker-alt"></i> <?php echo (!empty($cv['college_city']))?$cv['college_city'].',':'';?> <?php echo $cv['college_state'];?>
				                  <?php
				                  if(!empty($cv['college_affiliations'])){
				                    ?>
				                      <span style="margin-left: 10px;font-size: 10px;"><i class="fas fa-bookmark"></i> <?php echo $cv['college_affiliations'];?></span>
				                    <?php
				                  }
				                  ?>
				                  </p>
				                </div>

				                <?php
				                $course_cost_counter=count($cv['college_courses_cost']);
				                $course_counter=count($cv['college_courses']);

				                //echo $course_cost_counter;
				               
				                if(!empty($cv['college_courses_cost'])){
				                    ?>
				                    <div class="infoItems" style="height:60px !important;min-height: 60px !important;">
				                      <?php
				                      	
				                      	foreach ($cv['college_courses_cost'] as $_k => $_v) {

					                        if($_v['cost_value']!=null || !empty($_v['cost_value'])){

					                          if($course_cost_counter>=3){
					                            ?>
					                            <a href="javascript::void(0);" class="infoItem">
					                              <h4> <strong><?php echo $_v['cost_value'];?></strong></h4>
					                              <p style="font-size:10px;"><?php echo $_v['course_name'];?> </p>
					                            </a>
					                           <?php
					                          }else if($course_cost_counter==2){
					                            ?>
					                            <a href="javascript::void(0);" class="infoItem">
					                              <h4> <strong><?php echo $_v['cost_value'];?></strong></h4>
					                              <p style="font-size:10px;"><?php echo $_v['course_name'];?></p>
					                            </a>
					                            <?php
					                            if(isset($exam_id)){
					                              if(!empty($cv['college_exams_accepted'])){
					                                foreach ($cv['college_exams_accepted'] as $ek => $ev) {
					                                  if($ev['exam_id']==$exam_id){
					                                    
					                                    ?>
					                                    <a href="<?php echo $cv['exam_link'];?>" class="infoItem">
					                                      <h4> <strong><?php echo $cv['exam_name'];?></strong></h4>
					                                      <p style="font-size:10px;">Exam Accepted 1</p>
					                                    </a>
					                                    <?php
					                                    
					                                  }
					                                }
					                              }
					                                
					                            }else{
					                              if(!empty($cv['college_exams_accepted'][$_k])){
					                                ?>
					                                <a href="javascript::void(0);" class="infoItem">
					                                  <h4> <strong><?php echo $cv['college_exams_accepted'][$_k]['exam_name'];?></strong></h4>
					                                  <p>Exam Accepted </p>
					                                </a>
					                                <?php
					                              }
					                            }
					                              
					                          }
					                          else if($course_cost_counter==1){
					                          	//echo $course_cost_counter;
					                            ?>
					                            <a href="javascript::void(0);" class="infoItem">
					                              <h4> <strong><?php echo $_v['cost_value'];?></strong></h4>
					                              <p><?php echo $_v['course_name'];?></p>
					                            </a>
					                            <?php
					                            if(isset($exam_id)){
					                              if(!empty($cv['college_exams_accepted'])){
					                                foreach ($cv['college_exams_accepted'] as $ek => $ev) {
					                                   if($ev['exam_id']==$exam_id){
					                                      
					                                      ?>
					                                      <a href="<?php echo $ev['exam_link'];?>" class="infoItem">
					                                        <h4> <strong><?php echo $ev['exam_name'];?></strong></h4>
					                                        <p>Exam Accepted 2</p>
					                                      </a>
					                                      <?php
					                                    }
					                                }
					                              }
					                                
					                            }else{
					                              if(!empty($cv['college_exams_accepted'][$_k])){
					                              	if(!empty($cv['college_exams_accepted'])){
						                                foreach ($cv['college_exams_accepted'] as $ek => $ev) {			                                      
					                                      ?>
					                                      <a href="<?php echo $ev['exam_link'];?>" class="infoItem">
					                                        <h4> <strong><?php echo $ev['exam_name'];?></strong></h4>
					                                        <p>Exam Accepted 3</p>
					                                      </a>
					                                      <?php			                                    
						                                }
						                              }
					                                
					                              }
					                            }
					                          }
					                            
					                        }else{
					                            if(isset($exam_id)){
					                              if(!empty($cv['college_exams_accepted'])){
					                                foreach ($cv['college_exams_accepted'] as $ek => $ev) {
					                                    if($ev['exam_id']==$exam_id){
					                                      
					                                      ?>
					                                      <a href="<?php echo $ev['exam_link'];?>" class="infoItem">
					                                        <h4> <strong><?php echo $ev['exam_name'];?></strong></h4>
					                                        <p style="font-size:10px;">Exam Accepted 4</p>
					                                      </a>
					                                      <?php
					                                    }
					                                }
					                              }
					                              
					                            }else{
					                              ?>
						                            <a href="javascript::void(0);" class="infoItem">
						                              <h4> <strong>--</strong></h4>
						                              <p style="font-size:10px;"><?php echo $_v['course_name'];?> </p>
						                            </a>
						                            <?php
						                            if(!empty($cv['college_exams_accepted'][0])){
					                                ?>
						                                <a href="<?php echo $cv['college_exams_accepted'][$_k]['exam_link'];?>" class="infoItem">
						                                  <h4> <strong><?php echo $cv['college_exams_accepted'][$_k]['exam_name'];?></strong></h4>
						                                  <p style="font-size:10px;">Exam Accepted 5</p>
						                                </a>
					                                <?php
					                              	}
					                            }
					                        }

					                        //$course_cost_counter++;
				                      	}
				                      ?>
				                    </div>
				                    <?php
				                }else{                
				                  ?>
				                    <div class="infoItems">
				                    	
				                      <?php

				                      if(!empty($cv['college_courses'])){
				                      	switch ($course_counter) {
				                      		case '3':
				                      		
				                      			foreach ($cv['college_courses'] as $_cvkk => $_cvvv) {
						                          ?>
						                          <a href="javascript::void(0);" class="infoItem">
						                            <h4> <strong>--</strong></h4>
						                            <p style="font-size:10px;"><?php echo $_cvvv['course_short_name'];?> 6</p>
						                          </a>
						                          <?php
						                        }
				                      			break;
				                      		case '2':
				                      			foreach ($cv['college_courses'] as $_cvkk => $_cvvv) {
						                          ?>
						                          <a href="javascript::void(0);" class="infoItem">
						                            <h4> <strong>--</strong></h4>
						                            <p style="font-size:10px;"><?php echo $_cvvv['course_short_name'];?> 6</p>
						                          </a>
						                          <?php						                          
						                        }
						                        if(!empty($cv['college_exams_accepted'])){
						                          ?>
						                          <a href="<?php echo $cv['college_exams_accepted'][0]['exam_link'];?>" class="infoItem">
						                            <h4> <strong><?php echo $cv['college_exams_accepted'][0]['exam_name'];?></strong></h4>
						                            <p style="font-size:10px;">Exam Accepted 6-1</p>
						                          </a>
						                          <?php
						                        }
				                      			break;
				                      		case '1':
				                      			foreach ($cv['college_courses'] as $_cvkk => $_cvvv) {
						                          ?>
						                          <a href="javascript::void(0);" class="infoItem">
						                            <h4> <strong>--</strong></h4>
						                            <p style="font-size:10px;"><?php echo $_cvvv['course_short_name'];?> 6</p>
						                          </a>
						                          <?php						                          
						                        }
						                        if(!empty($cv['college_exams_accepted'])){
						                          ?>
						                          <a href="<?php echo $cv['college_exams_accepted'][0]['exam_link'];?>" class="infoItem">
						                            <h4> <strong><?php echo $cv['college_exams_accepted'][0]['exam_name'];?></strong></h4>
						                            <p style="font-size:10px;">Exam Accepted 6-0</p>
						                          </a>
						                          <?php
						                          if(isset($cv['college_exams_accepted'][1]) && !empty($cv['college_exams_accepted'][1])){
						                          	?>
							                          <a href="<?php echo $cv['college_exams_accepted'][1]['exam_link'];?>" class="infoItem">
							                            <h4> <strong><?php echo $cv['college_exams_accepted'][1]['exam_name'];?></strong></h4>
							                            <p style="font-size:10px;">Exam Accepted 6-0</p>
							                          </a>
							                          <?php
						                          }							                          
						                        }
				                      			break;
				                      		default:
				                      			if(!empty($cv['college_exams_accepted'])){
							                        foreach ($cv['college_exams_accepted'] as $_kk => $_vv) {
							                          ?>
							                          <a href="<?php echo $_vv['exam_link'];?>" class="infoItem">
							                            <h4> <strong><?php echo $_vv['exam_name'];?></strong></h4>
							                            <p style="font-size:10px;">Exam Accepted 6</p>
							                          </a>
							                          <?php
							                        }
							                      
							                      }else{
							                        for($i=1;$i<=3;$i++) {
							                         ?>
							                          <a href="" class="infoItem">
							                            <h4> <strong>--</strong></h4>
							                            <p style="font-size:10px;">-</p>
							                          </a>
							                         <?php
							                        }
							                      }
				                      			break;
				                      	}

				                      }else{
				                      	if(!empty($cv['college_exams_accepted'])){
					                        foreach ($cv['college_exams_accepted'] as $_kk => $_vv) {
					                          ?>
					                          <a href="<?php echo $_vv['exam_link'];?>" class="infoItem">
					                            <h4> <strong><?php echo $_vv['exam_name'];?></strong></h4>
					                            <p style="font-size:10px;">Exam Accepted 6</p>
					                          </a>
					                          <?php
					                        }
					                      
					                      }else{
					                        for($i=1;$i<=3;$i++) {
					                         ?>
					                          <a href="" class="infoItem">
					                            <h4> <strong>--</strong></h4>
					                            <p style="font-size:10px;">-</p>
					                          </a>
					                         <?php
					                        }
					                      }
				                      }
					                      
				                        
				                      ?>
				                    </div>
				                    <?php
				                }
				                ?>
				                <?php
				                if(!empty($cv['college_ranks'])){                
				                    ?>
				                    <div class="swiper-container tabSlider navTabSlider rankSwiper">
				                      <div class="swiper-wrapper" style="margin-left: 20px;margin-right: 20px;">
				                        <?php
				                        foreach ($cv['college_ranks'] as $_k => $_v) {
				                          if($_v['ranking_value']>0){
				                            ?>
				                            <a href="javascript::void(0);" class="swiper-slide navLink" style="align:center;"> 
				                              <div class="rankPanel">
				                                <div class="rankSpan">Ranked <?php echo $_v['ranking_value'];?> in <?php echo $_v['rank_year'];?> out of <?php echo $_v['rank_value'];?></div>
				                                <div class="rankName"> <?php echo $_v['rank_body'];?> </div>
				                              </div>
				                            </a>
				                            <?php
				                          }else{
							                	?>
							                	<div class="swiper-container tabSlider navTabSlider">
							                      	<div class="swiper-wrapper">	                        
								                        <a href="#" class="swiper-slide navLink"> 
								                          	<div class="rankPanel">
								                            	<div class="rankSpan">Ranked in <?php echo $_v['rank_year'];?> by</div>
								                            	<div class="rankName"><?php echo $_v['rank_body'];?> </div>
								                        	</div>
								                        </a>
							                      	</div>
							                      	<!-- <div class="swiper-button-next swiper-button-white"></div>
							                      	<div class="swiper-button-prev swiper-button-white"></div> -->
							                    </div>
							                	<?php
							                }                           
				                        }
				                        ?>
				                      </div>
				                      <div class="swiper-scrollbar"></div>
				                      <!-- <div class="swiper-button-next swiper-button-white"></div>
				                      <div class="swiper-button-prev swiper-button-white"></div> -->
				                    </div>
				                    <?php
				                }else{
				                	?>
				                	<div class="swiper-container tabSlider navTabSlider">
				                      	<div class="swiper-wrapper">	                        
					                        <a href="#" class="swiper-slide navLink"> 
					                          <div class="rankPanel">
					                            <div class="rankSpan">--  </div>
					                            <div class="rankName"> -- </div>
					                          </div>
					                        </a>
				                      	</div>
				                      	<!-- <div class="swiper-button-next swiper-button-white"></div>
				                      	<div class="swiper-button-prev swiper-button-white"></div> -->
				                    </div>
				                	<?php
				                }
				                ?>
				                  
				                <?php
				                if(!empty($cv['college_facilities'])){
				                  ?>

				                  <div class="swiper-container tabSlider navTabSlider mySwiper">
				                    <div class="swiper-wrapper" style="padding-left: 10px;padding-right: 10px;">
				                      <?php
				                       foreach ($cv['college_facilities'] as $_k => $_v) {
				                      	?>
				                      	<a href="javascript::void(0);" class="swiper-slide navLink"><img src="<?php echo $_v['facility_icon_3'];?>" width="25px" height="25px;"></a>
				                      	<?php
				                      	}
				                      ?>
				                    </div>
				                    
				                    <div class="swiper-button-next swiper-button-white"></div>
				                    <div class="swiper-button-prev swiper-button-white"></div>
				                  </div>

				                  <?php
				                }else{
				                    ?>

				                   <!--  <div class="swiper-container tabSlider navTabSlider">
				                      <div class="swiper-wrapper">
				                        
				                        <a href="#" class="swiper-slide navLink"> 
				                          <div class="rankPanel">
				                            <div class="rankSpan">Ranked 43 out of 300   </div>
				                            <div class="rankName"> NIRF 21 </div>
				                          </div>
				                        </a>
				                        <a href="#" class="swiper-slide navLink"> 
				                          <div class="rankPanel">
				                            <div class="rankSpan">Ranked 43 out of 300   </div>
				                            <div class="rankName"> NIRF </div>
				                          </div>
				                        </a>
				                        <a href="#" class="swiper-slide navLink"> 
				                          <div class="rankPanel">
				                            <div class="rankSpan">Ranked 43 out of 300   </div>
				                            <div class="rankName"> NIRF </div>
				                          </div>
				                        </a>
				                      </div>
				                      <div class="swiper-button-next swiper-button-white"></div>
				                      <div class="swiper-button-prev swiper-button-white"></div>
				                    </div> -->
				                    <?php
				                  }

				                ?>
				                  
				                <div class="linkItems">
				                  <?php
				                  if(!empty($cv['college_available_tabs'])){
				                  	foreach ($cv['college_available_tabs'] as $_k => $_v) {
				                  		?>
				                  		<a href="<?php echo $_v->menu_link;?>" target="_blank"><?php echo $_v->menu_name;?></a>
				                  		<?php
				                  	}
				                  }

				                  ?>
				                </div>
				                <div class="btnGroup">
				                  <a href="javascript:void(0);" class="apply" data-cname="<?php echo $v['college_name'];?>,<?php echo $cv['college_city'];?>" data-inst="<?php echo $cv['college_id'];?>" data-inst_type="<?php echo $v['institute_type'];?>" data-clogo="<?php echo $cv['college_logo'];?>" data-cphcode="<?php echo $cv['college_country_phone_code'];?>" data-cou="<?php echo $cv['college_country_id'];?>"><i class="far fa-file-alt"></i> <span style="margin-left:5px;">Apply Now</span></a>
				                  <a href="<?php echo $cv['access_url'];?>" class="download"> Explore</a>
				                </div>
				              </div>
				          	</div>
				        </div>
				        
						
						<?php
					}

					?>
					<div class="col-sm-12 grid_list" style="padding:2px;">
							<div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
								<ins class="adsbygoogle"
								     style="display:inline-block;width:728px;height:90px"
								     data-ad-client="ca-pub-9545373166119354"
								     data-ad-slot="1976315786"></ins>
								<script>
								     (adsbygoogle = window.adsbygoogle || []).push({});
								</script>
							</div>
						</div>
					<?php
					
					$data_count++;
					

					$ads_painted=true;
				}
			}
		?>
      </div>
  </section>

  <?php $this->widget->run('front_subscription_section',TRUE);?>

	<!--Main Filtered Data-->
</main>


<style type="text/css">

	#main_content {
	    min-height: calc(350vh - 0px) !important;
	}
	.chosen-container {
	  z-index: 1800000;
	}

.chosen-container-single {
  width: 100% !important;
  border-radius: 0px !important;
}

.chosen-drop {
  max-height: 150px;
}

.chosen-container .chosen-results {
  max-height: 100px;
}

#applicant_state_chosen .chosen-results {
  height: 90px;
}

#applicant_city_chosen .chosen-results {
  height: 90px;
}

#applicant_course_chosen .chosen-results {
  height: 50px;
}

.active-result .group-option .highlighted {
  background-color: #1b1f4c !important;
}

.boxIcon {
  height: 52px;
  width: 52px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: .8rem;

}

.boxContent {
  font-weight: bold;
  font-size: 9px;
}

h6 .mt-0 .mb-0 {
  color: #ff9800;
}


.skeleton-loader {
  width: 100%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
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
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
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
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}


.skeleton-loader-h6-1 {
  width: 12.50%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}

.skeleton-loader-h6-2 {
  width: 25%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}

.skeleton-loader-h6-3 {
  width: 37.50%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}

.skeleton-loader-h6-4 {
  width: 50%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}

.skeleton-loader-h6-5 {
  width: 62.50%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}

.skeleton-loader-h6-6 {
  width: 75%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}

.skeleton-loader-h6-7 {
  width: 87.50%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}

.skeleton-loader-h6-8 {
  width: 100%;
  height: 15px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}

.skeleton-loader-updateDate {
  width: 100px;
  height: 25px;
  display: block;
  margin-bottom: 5px !important;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%),
    #d3d3d37d;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  /*animation: shine 1s infinite; */
  animation: shine 2s infinite;
}


@keyframes shine {
  to {
    background-position: 100% 0,
      /* move highlight to right */
      0 0;
  }
}

.skeleton-loader:empty {
  width: 100%;
  height: 15px;
  display: block;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80%), #d3d3d370;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  animation: shine 1s infinite;
}

.blockTitle{
  font-weight: 700;
}

.filterBlock .btn {
    padding: 0.2rem 0.4rem 0.19rem;
    font-size: .8rem;
    margin-right: 3px;
}
.btn-outline-primary {
	background-color:#e3d7d7d4;
    border: 1px solid #fff;
    border-radius: 50px;
    padding: 6px 12px;
    font-size: 12.352 !important;
    font-weight: bold;
}
</style>


 <script type="text/javascript">
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