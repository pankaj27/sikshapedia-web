<style>
    .section-title{
        padding:0px;
    }
</style>
 <section class="bradcumSec bg-white py-2">
    <div class="wrapper">
         <div class="row">
             <div class="col-md-8 mb-2 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">
                 <h4 class="m-0 text-center text-md-left text-uppercase"><?php echo $news_page['news_page_heading'];?></h4>
             </div>
             <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-end">
                 <nav aria-label="breadcrumb">
                    <ol class="breadcrumb bg-white m-0">
                    <?php
                    foreach ($news_page['news_breadcumb'] as $key => $value) {
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
         </div>
         
     </div>
</section>



<section class="commonSec pt-3 pb-4">
    <div class="wrapper">
        <div class="row">
            <div class="col-lg-9 mb-4 mb-lg-0">
                <div class="adBlock ">
                    <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;"><iframe title="3rd party ad content" width="1280" height="90" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" src="https://api.waytoadmissions.com/v1/ads_college_top" style="border: 0px; vertical-align: bottom;"></iframe>
                       </div>
                 </div>
                 <div class="card infoCard mb-4">
                      <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
                        <div class="media">
                          <!-- <a href="#" class="mr-3 "><img class="img-circle" src="assets/img/avatar.jpg" width="60" alt=""></a> -->
                          <div class="media-body">
                            <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> Scholarship Form  </a> </h5>
                            
                            <!-- Form Start ---->
                                <hr>
                                <?php if($this->session->flashdata('message')){
                                
                                    echo $this->session->flashdata('message');
                                } ?>
                            
                                <?= form_open_multipart() ?>
        						<input type="hidden" class="form-control" name="_scholarship" id="_scholarship" value="">
        						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">


						<div class="row">
							
							<div class="col-sm-6">
								<div class="form-group">
									<label class="control-label">Name</label>
									<input value="<?= set_value('scholarship_name'); ?>" class="form-control" type="text" name="scholarship_name" placeholder="Enter your name"/>
								    <span class="text-danger"><?= form_error('scholarship_name'); ?></span>
								</div>
							</div>
							<div class="col-sm-6">
								<div class="form-group">
									<label class="control-label">Date of Birth</label>
									<input value="<?= set_value('scholarship_dov'); ?>" class="form-control" id="dob" type="date" placeholder="Select your date of birth" name="scholarship_dov"/>
								    <span class="text-danger"><?= form_error('scholarship_dov'); ?></span>
								</div>
							</div>
						</div>
						<div class="row">							
							<div class="col-sm-8">
								<div class="form-group">
									<label class="control-label">Address</label>
									<textarea class="form-control" rows="2" placeholder="Enter your address" name="scholarship_address"><?= set_value('scholarship_address'); ?></textarea>
								    <span class="text-danger"><?= form_error('scholarship_address'); ?></span>
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Pincode</label>
									<input maxlength="6" minlength="6" value="<?= set_value('scholarship_pincode'); ?>" type="text" class="form-control" placeholder="Enter your pincode" name="scholarship_pincode" value="">
								    <span class="text-danger"><?= form_error('scholarship_pincode'); ?></span>
								</div>
							</div>
						</div>
							
							<div class="row">
							<div class="col-sm-6">
								<div class="form-group">
									<label class="control-label">Qualification</label>
									<select class="form-control valid" name="scholarship_qualification" id="scholarship_qualification" aria-invalid="false">
										<option value="">Select Qualification</option>
										<option value="12th (Science)" <?= (set_value('scholarship_qualification')== '12th (Science)' ? 'selected' : '') ?>>12th (Science)</option>
										<option value="12th (Arts)" <?= (set_value('scholarship_qualification')== '12th (Arts)' ? 'selected' : '') ?>>12th (Arts)</option>
										<option value="12th (Commerce)" <?= (set_value('scholarship_qualification')== '12th (Commerce)' ? 'selected' : '') ?>>12th (Commerce)</option>
										<option value="H.S(Vocatational)" <?= (set_value('scholarship_qualification')== 'H.S(Vocatational)' ? 'selected' : '') ?>>12th (Vocatational)</option>
										<option value="B.Sc(H)" <?= (set_value('scholarship_qualification')== 'B.Sc(H)' ? 'selected' : '') ?>>B.sc(H)</option>
										<option value="B.A(H)" <?= (set_value('scholarship_qualification')== 'B.A(H)' ? 'selected' : '') ?>>B.A(H)</option>
										<option value="B.Com(H)" <?= (set_value('scholarship_qualification')== 'B.Com(H)' ? 'selected' : '') ?>>B.Com(H)</option>
									</select>
									<span class="text-danger"><?= form_error('scholarship_qualification'); ?></span>
								</div>
							</div>
							<div class="col-sm-6">
								<div class="form-group">
									<label class="control-label">Course</label>
									<select class="form-control error" name="scholarship_course" id="scholarship_course" aria-invalid="true">
										<option value="">Select Course</option>
										    <option value="D.Pharm" <?= (set_value('scholarship_course')== 'D.Pharm' ? 'selected' : '') ?>>D.Pharm</option>
    										<option value="B.Pharm" <?= (set_value('scholarship_course')== 'B.Pharm' ? 'selected' : '') ?>>B.Pharm</option>
    										<option value="G.N.M" <?= (set_value('scholarship_course')== 'G.N.M' ? 'selected' : '') ?>>G.N.M</option>
    										<option value="B.Sc Nursing" <?= (set_value('scholarship_course')== 'B.Sc Nursing' ? 'selected' : '') ?>>B.Sc Nursing</option>
    										<option value="B.Ed" <?= (set_value('scholarship_course')== 'B.Ed' ? 'selected' : '') ?>>B.Ed</option>
    										<option value="B.Optom" <?= (set_value('scholarship_course')== 'B.Optom' ? 'selected' : '') ?>>B.Optom</option>
    										<option value="B.C.A" <?= (set_value('scholarship_course')== 'B.C.A' ? 'selected' : '') ?>>B.C.A</option>
    										<option value="B.B.A" <?= (set_value('scholarship_course')== 'B.B.A' ? 'selected' : '') ?>>B.B.A</option>
    										<option value="BMLT" <?= (set_value('scholarship_course')== 'BMLT' ? 'selected' : '') ?>>BMLT</option>
    										<option value="B.Sc Cyber Security" <?= (set_value('scholarship_course')== 'B.Sc Cyber Security' ? 'selected' : '') ?>>B.Sc Cyber Security</option>
    										<option value="Hospital Management" <?= (set_value('scholarship_course')== 'Hospital Management' ? 'selected' : '') ?>>Hospital Management</option>
    										<option value="B.Sc Physiotherapy" <?= (set_value('scholarship_course')== 'B.Sc Physiotherapy' ? 'selected' : '') ?>>B.Sc Physiotherapy</option>
										</select>
									<span class="text-danger"><?= form_error('scholarship_course'); ?></span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Upload H.S Marksheet</label>
									<input type="file" class="form-control error" placeholder="Upload H.S Marksheet" name="hs_marksheet" id="hs_marksheey" value="" aria-invalid="true">
								    <span class="text-danger"><?= form_error('hs_marksheet'); ?></span>
								</div>
								
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Upload Adhaar Card</label>
									<input type="file" class="form-control error" placeholder="Upload Adhaar Card" name="adhar_card" id="adhar_card" value="" aria-invalid="true">
								    <span class="text-danger"><?= form_error('adhar_card'); ?></span>
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Upload Graduation Marksheet(Optional)</label>
									<input type="file" class="form-control error" placeholder="Upload Graduation Marksheet" name="graduation_marksheet" id="graduation_marksheet" value="" aria-invalid="true">
								</div>
							</div>
						</div>
						
						<div class="row">
							<div class="col-sm-3">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit">Submit</button>
							</div>
						</div>
					 <?= form_close() ?>
                            
                            
                            <!-- Form End  --->
                            
                          </div>
                        </div>
                        <div class="updateDate"></div>
                      </div>
                      <div>
                          
                      </div>
                    </div>
                 
            </div>
            <div class="col-lg-3 ">
          <!--<button type="button" class="btn btn-lg btn-primary mb-3 btn-block  d-flex justify-content-between align-items-center apply" data-clogo="<?php echo $college_data['college_logo'];?>"data-cname="<?php echo $college_data['college_name'];?>,<?php echo $college_data['college_city'];?>" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>" data-cphcode="<?php echo $college_data['college_country_phone_code'];?>" data-cou="<?php echo $college_data['college_country_id'];?>"><span>APPLY NOW </span> <i class="far fa-envelope"></i></button>-->
            <!-- <a href="" class="btn btn-lg btn-warning  mb-3 btn-block d-flex justify-content-between align-items-center"> <span>DOWNLOAD BROCHURE </span> <i class="fas fa-download"></i></a> -->


        <div>

        
            
        </div>

        <div class="card mb-4">
          <div class="card-header bg-white">
            <h5 class="m-0">COLLEGES IN THE SAME GROUP</h5>
          </div>
          <ul class="list-group list-group-flush" id="colleges_in_group">
              <li class="list-group-item"><a href="https://www.waytoadmissions.com/in/balurghat-college-belaghata-west-bengal" class="media"><img src="https://static.waytoadmissions.com/data/colleges/balurghat-college/zJd8y57jWs.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">Balurghat College</h6><small>West Bengal,Konnagar</small> </div></a></li><li class="list-group-item"><a href="https://www.waytoadmissions.com/in/balurghat-mahila-mahavidyalaya-belaghata-west-bengal" class="media"><img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">Balurghat Mahila Mahavidyalaya</h6><small>West Bengal,Belaghata</small> </div></a></li><li class="list-group-item"><a href="https://www.waytoadmissions.com/in/https://waytoadmissions.com/in/govt-college-of-engg-ceramic-technology1-belaghata" class="media"><img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">Govt. College of Engg. &amp; Ceramic Technology1</h6><small>West Bengal,Konnagar</small> </div></a></li><li class="list-group-item"><a href="https://www.waytoadmissions.com/in/govt-college-of-engg-and-ceramic-technology-belaghata-west-bengal" class="media"><img src="https://static.waytoadmissions.com/data/colleges/govt-college-of-engg-and-ceramic-technology-belaghata-west-bengal/xM5geI8Tj9.png" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">Govt. College Of Engg. &amp; Ceramic Technology</h6><small>West Bengal,Konnagar</small> </div></a></li></ul>
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
          </div>
            
          <div class="card mb-4 interestCard">
                <div class="card-body ">
                  <div class="icon text-center mb-3">
                    <svg width="144" height="47" viewBox="0 0 144 47" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M72.5 4.3h4.3V1.5h-6.55v3.55h1.5a.75.75 0 01.75-.75z" fill="#FFCC75"></path><path fill="#F2EBD9" d="M70.25 33.167h5.25V42.5h-5.25zM63.5 33.167h5.25V42.5H63.5z"></path><path fill="#FFF" d="M63.5 44h12v1.5h-12zM57 43.25V29.5h-9.5v16h10.25V44a.75.75 0 01-.75-.75zm-5.833-7.833a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3zm3.666 0a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3zM91.5 45.5v-16H82v13.75a.75.75 0 01-.75.75v1.5H91.5zm-3.667-13.083a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm-3.666 0a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3z"></path><path d="M81.25 44a.75.75 0 01-.75-.75V19.4h-5.25a.75.75 0 01-.75-.75H73a.75.75 0 01-.75.75H58.5v23.85a.75.75 0 01-.75.75v1.5H62V32.417a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75V45.5h4.25V44zM69.5 29.167a3.637 3.637 0 01-3.633-3.634A3.638 3.638 0 0169.5 21.9a3.637 3.637 0 013.633 3.633 3.638 3.638 0 01-3.633 3.634z" fill="#FFF"></path><path d="M69.5 23.4a2.136 2.136 0 00-2.133 2.133c0 1.177.957 2.134 2.133 2.134a2.136 2.136 0 002.133-2.134A2.136 2.136 0 0069.5 23.4z" fill="#98D9D5"></path><path fill="#F2EBD9" d="M47.5 25.5H57V28h-9.5zM82 25.5h9.5V28H82z"></path><path d="M74.5 18.65a.75.75 0 01.75-.75h3.844L69.5 10.307 59.906 17.9H72.25a.75.75 0 01.75.75h1.5z" fill="#FF6E1D"></path><path d="M92.25 24H82v-5.35a.738.738 0 00-.005-.082c0-.007-.002-.013-.003-.02a.759.759 0 00-.01-.06l-.006-.023a.756.756 0 00-.016-.055l-.008-.023a.76.76 0 00-.06-.122l-.013-.022a.762.762 0 00-.033-.047l-.013-.018a.754.754 0 00-.053-.059l-.006-.005a.715.715 0 00-.054-.048l-.005-.004L70.25 8.987V1.5h6.55v2.8h-4.3a.75.75 0 000 1.5h5.05a.75.75 0 00.75-.75V.75a.75.75 0 00-.75-.75H69.5a.75.75 0 00-.75.75v8.237l-11.466 9.075-.004.004a.762.762 0 00-.054.048l-.006.005a.754.754 0 00-.053.059l-.013.018a.762.762 0 00-.033.047l-.014.022a.772.772 0 00-.059.122l-.008.023a.729.729 0 00-.016.055l-.006.023a.751.751 0 00-.01.06c-.001.007-.003.013-.003.02a.763.763 0 00-.005.082V24H46.75a.75.75 0 00-.75.75v21.5c0 .414.336.75.75.75h45.5a.75.75 0 00.75-.75v-21.5a.75.75 0 00-.75-.75zM63.5 45.5V44h12v1.5h-12zm12-12.333V42.5h-5.25v-9.333h5.25zM68.75 42.5H63.5v-9.333h5.25V42.5zM77 32.417a.75.75 0 00-.75-.75h-13.5a.75.75 0 00-.75.75V45.5H47.5v-16H57v13.75a.75.75 0 001.5 0V19.4h13.75a.75.75 0 000-1.5H59.906l9.594-7.593 9.594 7.593H75.25a.75.75 0 000 1.5h5.25v23.85a.75.75 0 001.5 0V29.5h9.5v16H77V32.417zM91.5 28H82v-2.5h9.5V28zM57 28h-9.5v-2.5H57V28z" fill="#082947"></path><path d="M50.417 31.667a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zM54.083 31.667a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zM88.583 36.167a.75.75 0 00.75-.75v-3a.75.75 0 00-1.5 0v3c0 .414.336.75.75.75zM84.917 36.167a.75.75 0 00.75-.75v-3a.75.75 0 00-1.5 0v3c0 .414.335.75.75.75zM69.5 21.9a3.637 3.637 0 00-3.633 3.633 3.637 3.637 0 003.633 3.634 3.637 3.637 0 003.633-3.634A3.637 3.637 0 0069.5 21.9zm0 5.767a2.136 2.136 0 01-2.133-2.134c0-1.176.957-2.133 2.133-2.133 1.176 0 2.133.957 2.133 2.133a2.136 2.136 0 01-2.133 2.134z" fill="#082947"></path><g fill="#F7F7F7"><path d="M35.798 28.418c2.108-5.69 2.345-9.798 1.928-12.542-.487-3.207-3.458-5.645-6.576-5.086-3.664.657-3.755 4.689-3.755 4.689s-3.711-1.573-5.802 1.507c-1.779 2.62-.76 6.327 1.972 8.076 2.337 1.497 6.177 2.968 12.233 3.356z"></path></g><g fill="#F5F5F5"><path d="M5.053 37.714c4.014-1.76 6.267-3.697 7.484-5.29 1.421-1.863 1.197-4.63-.657-5.969-2.18-1.573-4.32.402-4.32.402S6.515 24.14 3.866 24.6c-2.254.39-3.668 2.78-3.207 5.076.395 1.966 1.557 4.698 4.394 8.04z"></path></g><g fill="#F5F5F5"><path d="M130.563 29.139c-3.064-5.239-4.01-9.242-4.077-12.018-.077-3.242 2.426-6.16 5.593-6.15 3.723.011 4.513 3.966 4.513 3.966s3.381-2.194 5.975.477c2.207 2.272 1.847 6.098-.54 8.296-2.041 1.88-5.567 3.995-11.464 5.429z"></path></g><g fill="#F0F0F0"><path d="M109.178 37.873c-3.374-2.799-5.005-5.282-5.735-7.15-.854-2.181.124-4.779 2.276-5.555 2.53-.912 4.042 1.577 4.042 1.577s1.753-2.324 4.173-1.152c2.06.996 2.76 3.682 1.683 5.763-.921 1.78-2.791 4.086-6.44 6.517z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M98.277 14.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092s1.214-1.609 2.889-.798c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M27.277 44.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092s1.214-1.609 2.889-.798c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M50.277 13.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092S51.895 4.6 53.57 5.41c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g></g></svg>
                  </div>
                  <h6 class="mb-3 text-center">INTERESTED IN THIS COLLEGE ?</h6>
                  <a href="#" class="btn btn-warning  btn-block d-flex justify-content-between  align-items-center"> <span>ASK QUESTION </span> <i class="fas fa-question"></i></a>
                </div>
          </div> -->
            
          <div class="card notificationCard mb-4">
            <div class="card-header bg-white">
              <h5 class="m-0">TOP COURSES</h5>
            </div>
            <ul class="list-group list-group-flush" id="college_courses_list"><li class="list-group-item"><a href="#" class="media"><div class="media-body"><h6 class="mb-0 color2">BACHELOR OF TECHNOLOGY</h6><small></small> </div></a></li><li class="list-group-item"><a href="#" class="media"><div class="media-body"><h6 class="mb-0 color2">MASTER OF TECHNOLOGY</h6><small></small> </div></a></li><li class="list-group-item"><a href="#" class="media"><div class="media-body"><h6 class="mb-0 color2">MASTER OF COMPUTER APPLICATIONS</h6><small></small> </div></a></li></ul>
            <div class="card-header bg-white text-center">
              <a class="#">VIEW MORE COURSES</a>
            </div>
          </div>

          <!--<div class="card mb-4">
            <div class="card-header bg-white">
              <h5 class="m-0">News</h5>
            </div>
            <ul class="list-group list-group-flush" id="news_list"><li class="list-group-item"><a href="#" class="media"><img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">BESTIU REGISTRAR: MR. SHAZIL AHMED INTERVIEW</h6><small>July 19,2021</small> </div></a></li><li class="list-group-item"><a href="#" class="media"><img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">WHY PURSUE MECHANICAL ENGINEERING FROM PIEMR ?</h6><small>July 19,2021</small> </div></a></li><li class="list-group-item"><a href="#" class="media"><img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">AISSMS Polytechnic to Hold Diploma in Engineering Guidance Session 2021 for Class 10th Students on July 18; Register Here</h6><small>July 18,2021</small> </div></a></li><li class="list-group-item"><a href="#" class="media"><img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">WHY PURSUE B.COM (COMPUTER APPLICATIONS) FROM PIMD ?</h6><small>July 18,2021</small> </div></a></li><li class="list-group-item"><a href="#" class="media"><img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">SRI VENKATESWARA UNIVERSITY (SVU) RESULT 2021 @SVU.EDU.IN: CHECK MA/ M.SC/ DDE RESULTS HERE</h6><small>July 18,2021</small> </div></a></li><li class="list-group-item"><a href="#" class="media"><img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..."> <div class="media-body"><h6 class="mb-0 color2">GLOBAL RESEARCH INSTITUTE OF MANAGEMENT AND TECHNOLOGY (GRIMT), HOD_ELECTRIC AND ELECTRONICS DEPT: SATISH KUMAR INTERVIEW</h6><small>July 18,2021</small> </div></a></li></ul>
            <!-- <div class="card-header bg-white text-center">
              <a class="#">View All News</a>
            </div> -->
          <!--</div>-->

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
  </style>

  <?php $this->widget->run('front_subscription_section',TRUE);?>

  <script type="text/javascript">let _cid='<?php echo $college_data['college_user_id'];?>';let _co='<?php echo $college_data['college_country_id'];?>';let _cot='<?php echo $college_data['college_city_country_id'];?>';let _cit='<?php echo $college_data['college_city_id'];?>';let _st='<?php echo $college_data['college_city_state_id'];?>';let page='';let _c='';let _ct='';</script>
  
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  
  <script>
      $(function() {
        $( "#dob" ).datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: '1950:2006',
            dateFormat: 'dd-mm-yy'
            
        });
      });
      
       
     
      
  </script>
