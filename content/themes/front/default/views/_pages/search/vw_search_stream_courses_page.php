<section class="bradcumSec bg-white py-2">
    <div class="wrapper">
         <div class="row">
             <div class="col-md-8 mb-2 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">

                 <h4 class="m-0 text-center text-md-left text-uppercase"><?php echo $page_heading;?></h4>
             </div>
             <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-end">
                 <nav aria-label="breadcrumb">
                     <ol class="breadcrumb bg-white m-0">
                      <?php
                      foreach ($bread_crumb as $key => $value) {
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
                     <!-- <li class="breadcrumb-item"><a href="#">Home</a></li>
                     <li class="breadcrumb-item"><a href="#">Library</a></li>
                     <li class="breadcrumb-item active" aria-current="page">Data</li> -->
                     </ol>
                 </nav>
             </div>
         </div>

         <?php
         if(!empty($page_sub_heading)){
          ?>
          <p><?php echo $page_sub_heading;?></p>
          <?php
         }
         ?>
     </div>
</section>

<section class="bg-white border-top">
    <div class="wrapper">
        <div class="row align-items-center">
            <div class="col-6">
            <div class="isa-tab-filter">
                <ul class="text-left">
                    <li class="placeholder"> <a href="javscript:void(0);">Sort By</a></li> 
                    <li class="filter"><a class="filter_course selected" href="javscript:void(0);" data-type="all">ALL</a></li>
                    <li class="filter"><a class="filter_course" href="javscript:void(0);" data-type="diploma">DIPLOMA</a></li>
                    <li class="filter"><a class="filter_course" href="javscript:void(0);" data-type="bachelor">BACHELORS </a></li>
                </ul>
            </div>
            </div>
            <div class="col-6">
                <div class="m-0 text-right"><small> Course type</small> <br> <span class="color1"> Full time</span></div>
            </div>
       </div>
    </div>
</section>

<section class="searchSesultSec pt-3 pb-4">
    <div class="wrapper">
        <div class="row">
            <div class="<?php echo (!empty($top_stream_colleges) || !empty($top_courses_colleges))?'col-lg-9 mb-3 mb-lg-0':'col-lg-12 mb-3 mb-lg-0';?>" id="stream_course_list">
             
                 <?php
              if(!empty($course_data)){
                foreach ($course_data as $key => $value) {
                  ?>
                  <div class="card mb-4">
                      <div class="card-body">
                          <div class="row">
                            <div class="col-md-9">
                                <h5 class="text-uppercase"><?php echo $value['course_name'];?></h5>
                                <div><span class="color1"> <?php echo $value['course_duration'];?> </span> | <span class="color2"> <?php echo $value['course_duration_type'];?> </span></div>
                            </div>
                            <div class="col-md-3 text-right">
                                <h2 class="color2"><?php echo $value['course_colleges_total'];?></h2>
                                <p>College offering this course</p>
                            </div>
                            <div class="col-md-12">
                              <a href="<?php echo $value['course_link'];?>" class="btn btn btn-outline-primary btn-sm">Courses Overview</a>
                              <a href="#" class="btn btn btn-primary btn-sm">Apply Now</a>
                            </div>
                          </div>
                      </div>
                  </div>
                  <?php
                }
              }
              ?>
                
            </div>


          <?php
          if(!empty($top_stream_colleges) || !empty($top_courses_colleges)){
            ?>
            <div class="col-lg-3">
              <?php
              if(!empty($top_stream_colleges)){
                ?>
                <div class="card mb-4">
                  <div class="card-header bg-white">
                    <h5 class="m-0"><?php echo $top_colleges_heading;?></h5>
                  </div>
                  <ul class="list-group list-group-flush">
                    <?php
                    foreach ($top_stream_colleges as $key => $value) {
                      ?>
                      <li class="list-group-item">
                        <a href="#" class="media">
                          <img src="assets/img/c-l-1.jpg" width="40" class="mr-2" alt="..."> 
                          <div class="media-body">
                            <h6 class="mb-0 color2">Media heading</h6>
                            <small> sit amet nibh libero, in gravida nulla. </small> 
                          </div>
                        </a>
                      </li>
                      <?php
                    }
                    ?>
                  </ul>
                  <div class="card-header bg-white text-center">
                    <a class="#">SHOW MORE COLLEGES</a>
                  </div>
                  
                </div>
                <?php
              }


              if(!empty($top_courses_colleges)){
                ?>
                <div class="card mb-4">
                  <div class="card-header bg-white">
                    <h5 class="m-0"><?php echo $top_courese_colleges_heading;?></h5>
                  </div>
                  <ul class="list-group list-group-flush">
                    <?php
                    foreach ($top_courses_colleges as $key => $value){
                      ?>

                      <?php
                    }
                    ?>
                  </ul>                  
                </div>
                <?php
              }
              ?>
            </div>
            <?php
          }
          ?>
        </div>

     </div> 
</section>

<script type="text/javascript">var _filter_stream='<?php echo $stream_id;?>';</script>