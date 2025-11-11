<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<section class="bradcumSec bg-white py-2">
    <div class="wrapper">
         <div class="row">
             <div class="col-md-12">
                 <nav aria-label="breadcrumb">
                     <ol class="breadcrumb bg-white m-0 pl-0">
                     <?php
                     	if(!empty($course_data['bread_crumb'])){
                     		foreach ($course_data['bread_crumb'] as $key => $value) {
                     			?>
                     			<li class="breadcrumb-item <?php echo ($value!='')?$value:'';?>" <?php echo ($value!='')?'aria-current="page"':'';?>>
                     				<?php
                     				if($value!=''){
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
                     	}
                     	?>
                     </ol>
                 </nav>
             </div>
             <div class="col-md-12 ">
                 <h4 class="mb-3 text-center text-md-left text-uppercase"><?php echo $page_heading;?></h4>
                 <?php
         if(!empty($page_sub_heading)){
          ?>
          <p><?php echo $page_sub_heading;?></p>
          <?php
         }
         ?>
             </div>
             
         </div>
         
     </div>
</section>

<?php
if(!empty($course_data['inner_menues'])){
  ?>
  <section class="tabSliderSec">
          <div class="swiper-container tabSlider navTabSlider">
            <div class="swiper-wrapper">
              <?php
              $i=0;
              foreach ($course_data['inner_menues'] as $key => $value) {
               ?>
               <a href="<?php echo $value['menu_link'];?>" class="swiper-slide navLink <?php echo $value['menu_active'];?>"> <?php echo $value['menu_name'];?> </a>
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






<section class="searchSesultSec pt-3 pb-4">
    <div class="wrapper">

        <div class="row">
        	  <!-- <div class="col-lg-2 co-md-3 d-none d-md-block scrollToStick" id="scrollSpyBlock">
              <div class="card mb-4">
                <div class="card-header bg-white">
                  <h6 class="m-0">Top Colleges in India</h6>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item p-2">
                    <a href="#blockId1" class="media spyMedia scroll">
                      <div class="numbering">01</div>
                      <div class="media-body">
                        Sit amet nibh libero, in gravida nulla.
                      </div>
                    </a>
                  </li>
                  <li class="list-group-item  p-2">
                    <a href="#blockId2" class="media spyMedia scroll">
                       <div class="numbering">02</div>
                      <div class="media-body">
                        Sit amet nibh libero, in gravida nulla. 
                      </div>
                    </a>
                  </li>
                  <li class="list-group-item p-2">
                    <a href="#blockId3" class="media spyMedia scroll">
                       <div class="numbering">03</div>
                      <div class="media-body">
                        Sit amet nibh libero, in gravida nulla. 
                      </div>
                    </a>
                  </li>
                </ul>
                <div class="card-footer bg-white text-center">
                  <a class="#">View All Colleges</a>
                </div>
                
              </div>

            </div> -->
            
            <div class="col-lg-9 col-md-6 mb-3 mb-lg-0">
            	<div class="adBlock" id="">
	                 
               </div>
	            
	            <div id="#blockId1">
                <?php
                if(!empty($course_data['course_details_data'])){
                  ?>
                    <div class="card infoCard mb-4">
                      <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
                        <div class="media">
                          <!-- <a href="#" class="mr-3 "><img class="img-circle" src="assets/img/avatar.jpg" width="60" alt=""></a> -->
                          <div class="media-body">
                            <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> By Waytoadmissions  </a> </h5>
                            <p class="m-0">Content Curator 
                              <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
                              <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
                              <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
                            </p>
                          </div>
                        </div>
                        <div class="updateDate"></div>
                      </div>
                        <div class="card-body">
                            <div class="row">
                              <div class="col-md-12">
                                  <h5 class="text-uppercase color2"><?php echo $course_data['course_name'];?></h5>

                                  <!-- <div><span class="color1"> 3 Years </span> | <span class="color2"> Fulltime </span></div> -->
                              </div>
                              <!-- <div class="col-md-3 text-right">
                                  <h2 class="color2">586</h2>
                                  <p>College offering this course</p>
                              </div> -->
                              <?php
                              $i=0;
                              foreach ($course_data['course_details_data'] as $key => $value) {
                                ?>
                                <div class="col-md-12">

                                  <?php
                                  if($value->course_data_type=='faqs'){
                                    
                                    ?>
                                    <div id="accordionExample1" class="accordion">
                                      <div class="card br-0">
                                        <a href="#" data-toggle="collapse" data-target="#collapse<?php echo $i;?>" aria-expanded="true" aria-controls="collapse<?php echo $i;?>" class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong>Ques. <?php echo $value->course_data_heading;?></strong></a>
                                        <div id="collapse<?php echo $i;?>" data-parent="#accordionExample1" class="collapse <?php echo ($i==0)?'show':'';?>">
                                          <div class="card-body">
                                            <p class="font-weight-light m-0"><strong>Ans. </strong><?php echo $value->course_data_value;?></p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <?php
                                    $i++;
                                  }else if($value->course_data_type=='image'){
                                    ?>
                                    <div class="row">
                                      <img src="<?php echo $value->course_data_value;?>" class="" alt="<?php echo $course_data['course_name'];?>" style="align:center;">
                                    </div>
                                    <?php
                                  }
                                  else{
                                    echo $value->course_data_value;
                                  }
                                  ?>
                                  
                                </div>
                                <?php
                              }
                              ?>
                              
                          </div>
                        </div>
                    </div>
                    <?php

                }
                ?>
                </div>
                <!-- <div id="#blockId2">
                    <div class="card mb-4">
                      <div class="card-body">
                          <div class="row">
                            <div class="col-md-9">
                                <h5 class="text-uppercase">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
                                <div><span class="color1"> 3 Years </span> | <span class="color2"> Fulltime </span></div>
                            </div>
                            <div class="col-md-3 text-right">
                                <h2 class="color2">586</h2>
                                <p>College offering this course</p>
                            </div>
                            <div class="col-md-12">
                              <a href="#" class="btn btn btn-outline-primary btn-sm">Courses Overview</a>
                              <a href="#" class="btn btn btn-primary btn-sm">Apply Now</a>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div class="card mb-4">
                      <div class="card-body">
                          <div class="row">
                            <div class="col-md-9">
                                <h5 class="text-uppercase">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
                                <div><span class="color1"> 3 Years </span> | <span class="color2"> Fulltime </span></div>
                            </div>
                            <div class="col-md-3 text-right">
                                <h2 class="color2">586</h2>
                                <p>College offering this course</p>
                            </div>
                            <div class="col-md-12">
                              <a href="#" class="btn btn btn-outline-primary btn-sm">Courses Overview</a>
                              <a href="#" class="btn btn btn-primary btn-sm">Apply Now</a>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
                <div id="#blockId3">
                    <div class="card mb-4">
                      <div class="card-body">
                          <div class="row">
                            <div class="col-md-9">
                                <h5 class="text-uppercase">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
                                <div><span class="color1"> 3 Years </span> | <span class="color2"> Fulltime </span></div>
                            </div>
                            <div class="col-md-3 text-right">
                                <h2 class="color2">586</h2>
                                <p>College offering this course</p>
                            </div>
                            <div class="col-md-12">
                              <a href="#" class="btn btn btn-outline-primary btn-sm">Courses Overview</a>
                              <a href="#" class="btn btn btn-primary btn-sm">Apply Now</a>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div class="card mb-4">
                      <div class="card-body">
                          <div class="row">
                            <div class="col-md-9">
                                <h5 class="text-uppercase">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
                                <div><span class="color1"> 3 Years </span> | <span class="color2"> Fulltime </span></div>
                            </div>
                            <div class="col-md-3 text-right">
                                <h2 class="color2">586</h2>
                                <p>College offering this course</p>
                            </div>
                            <div class="col-md-12">
                              <a href="#" class="btn btn btn-outline-primary btn-sm">Courses Overview</a>
                              <a href="#" class="btn btn btn-primary btn-sm">Apply Now</a>
                            </div>
                        </div>
                      </div>
                    </div>
                </div> -->
            </div>
            
            <div class="col-lg-3 col-md-3">
              <button type="button" data-toggle="modal" data-target="#reg3ApplyModal" class="btn btn-lg btn-primary mb-3 btn-block  d-flex justify-content-between align-items-center"><span>GET MORE INFo </span> <i class="far fa-envelope"></i></button>

              <button class="btn btn-lg btn-warning  mb-3 btn-block d-flex justify-content-between align-items-center" data-toggle="modal" data-target="#regAskAquestionModal"> <span>ASK A QUESTION </span> <i class="fas fa-user-graduate"></i></button>

              <!-- <div class="card mb-4">
                <div class="card-header bg-white">
                  <h5 class="m-0">Top Colleges in India</h5>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <a href="#" class="media">
                      <img src="assets/img/c-l-1.jpg" width="40" class="mr-2" alt="..."> 
                      <div class="media-body">
                        <h6 class="mb-0 color2">Media heading</h6>
                        <small> sit amet nibh libero, in gravida nulla. </small> 
                      </div>
                    </a>
                  </li>
                  <li class="list-group-item">
                    <a href="#" class="media">
                      <img src="assets/img/c-l-1.jpg" width="40" class="mr-2" alt="..."> 
                      <div class="media-body">
                        <h6 class="mb-0 color2">Media heading</h6>
                        <small> sit amet nibh libero, in gravida nulla. </small> 
                      </div>
                    </a>
                  </li>
                  <li class="list-group-item">
                    <a href="#" class="media">
                      <img src="assets/img/c-l-1.jpg" width="40" class="mr-2" alt="..."> 
                      <div class="media-body">
                        <h6 class="mb-0 color2">Media heading</h6>
                        <small> sit amet nibh libero, in gravida nulla. </small> 
                      </div>
                    </a>
                  </li>
                </ul>
                <div class="card-header bg-white text-center">
                  <a class="#">View All Colleges</a>
                </div>
                
              </div>
              <div class="card mb-4">
                <div class="card-header bg-white">
                  <h5 class="m-0">Top Colleges in India</h5>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <a href="#" class="media">
                      <img src="assets/img/c-l-1.jpg" width="40" class="mr-2" alt="..."> 
                      <div class="media-body">
                        <h6 class="mb-0 color2">Media heading</h6>
                        <small> sit amet nibh libero, in gravida nulla. </small> 
                      </div>
                    </a>
                  </li>
                  <li class="list-group-item">
                    <a href="#" class="media">
                      <img src="assets/img/c-l-1.jpg" width="40" class="mr-2" alt="..."> 
                      <div class="media-body">
                        <h6 class="mb-0 color2">Media heading</h6>
                        <small> sit amet nibh libero, in gravida nulla. </small> 
                      </div>
                    </a>
                  </li>
                  <li class="list-group-item">
                    <a href="#" class="media">
                      <img src="assets/img/c-l-1.jpg" width="40" class="mr-2" alt="..."> 
                      <div class="media-body">
                        <h6 class="mb-0 color2">Media heading</h6>
                        <small> sit amet nibh libero, in gravida nulla. </small> 
                      </div>
                    </a>
                  </li>
                </ul>
                <div class="card-header bg-white text-center">
                  <a class="#">View All Colleges</a>
                </div>
                
              </div> -->
            </div>

          

        </div>

        
       

     </div> 
</section>

<?php $this->widget->run('front_subscription_section',TRUE);?>

<script type="text/javascript">var country='<?php echo $country_id;?>';var page='course_details_page';</script>