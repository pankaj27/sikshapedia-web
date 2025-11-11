<?php
if(!empty($reviews_data)){
	$i=1;
	foreach ($reviews_data as $key => $value) {
		
		if($i>1){
			?>
			<hr class="mt-0 mb-2">
			<?php
		}

		?>
		<div class="jsx-sks1 jsx-sks3 review-card pt-4 pb-4 avatar-container ">
           <div class="jsx-sks3 jsx-sks4 avatar-container  d-flex align-items-center">
              <span class="jsx-sks3 jsx-sks4  user-avatar-revicon d-flex justify-content-center align-items-center text-uppercase font-weight-bold text-center text-white"><?php echo $value['user_short_name'];?></span>
              <div class="jsx-sks3 jsx-sks4 d-flex justify-content-between student-satisfaction-container">
                 <div class="jsx-sks3 jsx-sks4 user-detail">
                    <div class="jsx-sks3 jsx-sks4 d-flex font-weight-bold mb-2 align-items-center"><a class="user-name pointer" data-csm-track="true" data-event-type="review_section" data-csm-href="<?php echo $value['college_access_url'];?>" data-csm-title="<?php echo $value['user_full_name'];?>" data-ga-title="<?php echo $value['user_full_name'];?>" data-ga-track="true" data-ga-module="college_detail" data-ga-section="<?php echo $value['review_title'];?>" data-ga-href="reviews/508478-vibek-chandra-roy-review-on-siliguri-institute-of-technology-sit-darjeeling" href=""><?php echo $value['user_full_name'];?></a>
                     <span class="jsx-2133140133 jsx-693955820 icon ml-2"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="#67BC9F"><path fill="#3eba9f" d="M0 11C0 4.925 4.925 0 11 0s11 4.925 11 11-4.925 11-11 11S0 17.075 0 11z"></path><path fill="#fff" d="M9.35 15.007a.822.822 0 0 1-.584-.241L6.242 12.24a.823.823 0 1 1 1.165-1.165l1.942 1.942 4.776-4.776a.826.826 0 0 1 1.166 1.166l-5.36 5.36a.825.825 0 0 1-.582.24z"></path></svg></span>
                    </div>
                    <div class="jsx-sks3 jsx-sks4 d-flex flex-wrap text-gray user-info  text-md"><span class="jsx-sks3 jsx-sks4 user-bullet-info pr-3 "><span class="jsx-sks3 jsx-sks4"> Enrolled <?php echo $value['enroll_year'];?> </span></span><span class="jsx-sks3 jsx-sks4 user-bullet-info pr-3 text-capitalize"><a href="<?php echo $value['enroll_course_url'];?>" data-csm-track="true" data-event-type="review_section" data-csm-href="<?php echo $value['college_access_url'];?>" data-csm-title="<?php echo $value['enroll_course'];?>" data-ga-title="<?php echo $value['enroll_course'];?>" data-ga-track="true" data-ga-module="college_detail" data-ga-section="I'm a student of this college." data-ga-href="<?php echo $value['enroll_course_url'];?>"><?php echo $value['enroll_course'];?></a></span><span class="jsx-sks3 jsx-sks4 user-bullet-info pr-3 "><?php echo $value['review_date'];?></span></div>
                 </div>
                 <div class="jsx-sks3 jsx-sks4 item font-weight-bold text-secondary text-uppercase"><span class="jsx-sks3 jsx-sks4 rating-value  d-flex align-items-baseline text-black-heading"><?php echo $value['average_out_of_10'];?> <span class="jsx-sks3 jsx-sks4 text-silver text-lg">/10</span> </span></div>
              </div>
           </div>
           <div class="jsx-sks1 jsx-sks3 font-weight-bold h1 mb-0 exam-page-title w-100  pt-3 pointer">
              <h3 class="jsx-sks1 jsx-sks3 m-0 h2"><?php echo $value['review_title'];?></h3>
           </div>
           
           <div class="jsx-sks1 jsx-sks3 review-content pt-3">
            <?php

            if(!empty($value['review_college_overview'])){
               ?>
               <div class="jsx-sks6  text-lg  mb-3 ">
                 <p class="jsx-sks6 m-0 review-content d-inline"><?php echo $value['review_college_overview'];?></p>
               </div>
               <?php
            }

            ?>
              
              <?php
              if(!empty($value['review_details'])){
              	foreach ($value['review_details'] as $k => $v) {
              		?>
              		<div class="jsx-sks6  text-lg  mb-3 ">
	                 <h3 class="jsx-sks6 title font-weight-bold m-0 text-capitalize  h6 d-inline"><?php echo $v->review_question_title;?> : </h3>
	                 <p class="jsx-sks6 m-0 review-content d-inline"><?php echo $v->review_question_answer;?></p>
	                 <?php
	                 if($v->review_question_type=='2'){
	                 	?>
	                 	<div class="jsx-sks6 tags-container d-flex align-items-center mt-2 pb-2">
		                 	<span class="jsx-sks6  pr-5 text-base review-content-tags ">
		                 		<span class="jsx-sks6 tags d-inline-block"> </span>
		                 		<span class="jsx-sks6 ml-2">Class Size : <?php echo $value['class_size'];?></span>
		                 	</span>
		                 	<span class="jsx-sks6  pr-5 text-base review-content-tags ">
		                 		<span class="jsx-sks6 tags d-inline-block"> </span>
		                 		<span class="jsx-sks6 ml-2">Course Fees : INR <?php echo $value['course_fees'];?> per year</span>
		                 	</span>
	                 	</div>
	                 	<?php
	                 }else if($v->review_question_type=='5'){
                        if($value['hostel_opt']=='yes'){
                          ?>
                           <div class="jsx-sks6 tags-container d-flex align-items-center mt-2 pb-2">
                              <span class="jsx-sks6  pr-5 text-base review-content-tags ">
                                 <span class="jsx-sks6 tags d-inline-block"> </span>
                                 <span class="jsx-sks6 ml-2">Hostel Fee : INR <?php echo $value['hostel_fee'];?> per year</span>
                              </span>
                           </div>
                           <?php 
                        }                        
                    }

	                 ?>
	                 	
	              	</div>
              		<?php
              	}

               ?>
               <div class="jsx-sks1 jsx-sks3 rating-data d-flex flex-wrap align-items-center">
                  <?php

                  foreach ($value['review_details'] as $k => $v){
                     if($v->review_question_type!='10' && $v->review_question_type!='11' && $v->review_question_type!='12'){
                        ?>
                           <div class="jsx-sks1 jsx-sks3 item d-flex text-gray text-capitalize align-items-center"><span class="jsx-sks1 jsx-sks3"><?php echo $v->review_category;?>: </span><span class="jsx-sks1 jsx-sks3 ml-1"><?php echo $v->review_question_rating;?>/10</span></div>
                        <?php 
                     }
                        
                  }

                  ?>
               </div>
               <?php
              }

              ?>
              
                 
              
              <!--- -->
           </div>
        </div>
		<?php

		$i++;
	}
}


?>