<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
  if(!empty($reviews)){
    ?>
    <div class="card reviewCard mb-3">
      <div class="card-header bg-white d-flex justify-content-between">
        <h5 class="m-0 color2"> <?php echo $review_list_heading;?></h5>
        <a href="#">VIEW ALL</a>
      </div>
      <div class="card-header bg-white">
        <div class="d-flex flex-wrap justify-content-between align-items-center">
          <div class="d-flex align-items-center ">
            <h6 class="m-0 mr-3">FILTER BY</h6>
            <div class="filterBtnGroup">
              <button type="button" class="filterBtn active">Course Tag</button>
              <button type="button" class="filterBtn">Course</button>
              <button type="button" class="filterBtn">Batch</button>
            </div>
          </div>
          <div class="shortby">
            <div class=" border bg-light d-flex align-items-center">
              <span class="d-inline px-2"><i class="fas fa-sort-amount-up-alt"></i> SORT BY :</span>
              <select class="cus_select">
                <option>Rating - High</option>
                <option>Rating - Low</option>
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="card-header bg-white">
        <button type="button" class="btn btn-outline-secondary btn-sm">Engineering <span class="badge badge-light">4</span></button>
        <button type="button" class="btn btn-outline-secondary btn-sm">Engineering <span class="badge badge-light">4</span></button>
        <button type="button" class="btn btn-outline-secondary btn-sm">Engineering <span class="badge badge-light">4</span></button>
        <button type="button" class="btn btn-outline-secondary btn-sm">Engineering <span class="badge badge-light">4</span></button>
      </div>
      <div class="card-header bg-white">
        <h6> MOST POPULAR TAGS</h6>
        <button type="button" class="btn btn-outline-secondary btn-sm">Engineering <span class="badge badge-light">4</span></button>
        <button type="button" class="btn btn-outline-secondary btn-sm">Engineering <span class="badge badge-light">4</span></button>
        <button type="button" class="btn btn-outline-secondary btn-sm">Engineering <span class="badge badge-light">4</span></button>
        <button type="button" class="btn btn-outline-secondary btn-sm">Engineering <span class="badge badge-light">4</span></button>
      </div>
      <div class="card-header bg-white d-flex justify-content-between">
        <span><?php echo $total_reviews;?> Reviews found</span>
        <a href="#">View All</a>
      </div>

      <?php
      foreach ($reviews as $key => $value) {
        ?>
        <div class="card-body border-top">
          <div class="reviewPanel">
            <div class="d-flex justify-content-between">
              <div class="media">
                <div class="mr-3">
                  <div class="mediaImg">
                    <span><?php echo $value['review_user_short_name'];?></span>
                    <!-- <img src="assets/img/avatar.jpg" alt="..."> -->
                  </div>
                </div>
                <div class="media-body">
                  <h6 class="mt-0"><?php echo $value['review_user_name'];?></h6>
                  <!-- <p class="p12"><span class="badge badge-secondary">Enrolled 2020</span><span class="badge badge-secondary">Enrolled 2020</span><span class="badge badge-secondary">Enrolled 2020</span></p> -->
                </div>
              </div>
              <h3><?php echo $value['average_rating'];?><small>/10</small></h3>
            </div>
            <div class="panelBody py-3">

              <?php
              if(!empty($value['review_heading'])){
                ?>
                <h3><?php echo $value['review_heading'];?></h3>
                <?php
              }


              if(!empty($value['review_value'])){
                ?>
                <p><?php echo $value['review_value'];?></p>
                <?php
              }


              if(!empty($value['review_placement_details'])){
                ?>
                <h6>Placement Experience</h6>
                <p><?php echo $value['review_placement_details'];?></p>
                <?php
              }

              if(!empty($value['review_faculty_details'])){
                ?>
                <h6>Faculty</h6>
                <p><?php echo $value['review_faculty_details'];?></p>
                <?php
              }

              if(!empty($value['review_remarks'])){
                ?>
                <h6>Remarks</h6>
                <p><?php echo $value['review_remarks'];?></p>
                <?php
              }

              ?> 
              <div class="d-flex flex-wrap border-top pt-3">
                <?php
                if($value['review_faculty_marks']>=4){
                  ?>
                  <div class="markBox px-3">
                    <h4 class="m-0 color2"><?php echo $value['review_faculty_marks'];?><small class="text-muted">/10</small></h4><small> FACULTY</small>
                  </div>
                  <?php
                }

                if($value['review_placement_marks']>=4){
                  ?>
                  <div class="markBox px-3">
                    <h4 class="m-0 color2"><?php echo $value['review_placement_marks'];?><small class="text-muted">/10</small></h4><small> PLACEMENT</small>
                  </div>
                  <?php
                }

                if($value['review_social_life_marks']>=4){
                  ?>
                  <div class="markBox px-3">
                    <h4 class="m-0 color2"><?php echo $value['review_social_life_marks'];?><small class="text-muted">/10</small></h4><small> SOCIAL LIFE</small>
                  </div>
                  <?php
                }

                if($value['review_college_life_marks']>=4){
                  ?>
                  <div class="markBox px-3">
                    <h4 class="m-0 color2"><?php echo $value['review_college_life_marks'];?><small class="text-muted">/10</small></h4><small> COLLEGE</small>
                  </div>
                  <?php
                }

                if($value['review_course_marks']>=4){
                  ?>
                  <div class="markBox px-3">
                    <h4 class="m-0 color2"><?php echo $value['review_course_marks'];?><small class="text-muted">/10</small></h4><small> COURSE</small>
                  </div>
                  <?php
                }

                if($value['review_hostel_life_marks']>=4){
                  ?>
                  <div class="markBox px-3">
                    <h4 class="m-0 color2"><?php echo $value['review_hostel_life_marks'];?><small class="text-muted">/10</small></h4><small> HOSTEL</small>
                  </div>
                  <?php
                }

                if($value['review_internship_marks']>=4){
                  ?>
                  <div class="markBox px-3">
                    <h4 class="m-0 color2"><?php echo $value['review_internship_marks'];?><small class="text-muted">/10</small></h4><small> INTERNSHIP</small>
                  </div>
                  <?php
                }

                if($value['review_campus_life_marks']>=4){
                  ?>
                  <div class="markBox px-3">
                    <h4 class="m-0 color2"><?php echo $value['review_campus_life_marks'];?><small class="text-muted">/10</small></h4><small> CAMPUS LIFE</small>
                  </div>
                  <?php
                }
                ?>
              </div>
            </div>
            <div class="panelFooter border-top pt-3 bg-white d-flex justify-content-between">
              <div class="btns">
                <button type="button" class="btn btn-small btn-outline-success"><i class="far fa-thumbs-up"></i> 0</button>  
                <button type="button" class="btn btn-small btn-outline-danger"><i class="far fa-thumbs-down"></i> 0</button>
                <button type="button" class="btn btn-small btn-outline-info"><i class="far fa-flag"></i>  REPORT</button>
              </div>
              <a href="" type="button" class="btn btn-small btn-primary">Explore All</a>
            </div>
          </div>
        </div>
        <?php
      }
      ?>
    </div>
    <?php
  }
?>   