<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="profile-content py-4">
  <div class="wrapper">
    <div class="row">
    	<!-- <div class="col-lg-4 mb-4 mb-lg-0">
    		<div class="card userCard">
    			<div class="card-header bg-white">
	        	  <h5 class="m-0 d-inline">General Settings</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
	        	</div>
    		</div>
    	</div> -->
	    <div class="col-lg-6 mb-4 mb-lg-0">
	        <div class="card userCard">
	        	<div class="card-header bg-white">
	        	  <h5 class="m-0 d-inline">Feel free to contact with us 
	        	</div>
	        	<div class="card-body">
	        		<div class="row">
	        			<div class="col-lg-12" id="register_msg" style="display:none;">
	        				
	        			</div>
	        		</div>

	        		

	            <form id="form_contact_us" novalidate="novalidate">
	              <div class="row">
	                <!-- <input type="hidden" name="data_type" value="general_settings"> -->
	                <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">

	                	<div class="form-group col-sm-6">
                      <label>Name <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_student_name" name="register_student_name" aria-describedby="register_student_name" placeholder="Enter Name" value="">
                  	</div>
                  	<div class="form-group col-sm-6">
                      <label>Email <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_student_email" name="register_student_email" placeholder="Enter Email" value="">
                  	</div>
                  	<div class="form-group col-sm-6">
                      <label>Contact no <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_student_phone_no" name="register_student_phone_no" aria-describedby="register_college_phone_no" placeholder="Enter Phone No." value="">
                  	</div>
                  	
                  	<div class="form-group col-sm-6">
                      <label>Inetrested For? <span class="span_star">(*)</span></label>
                      <select class="form-control chosen-select"  name="interested_for" id="interested_for" required="required">
                          <option>Select What you are looking for?</option>
                          <option value="Admission for New Course">Admission for New Course</option>
                          <option value="Examination information (TOP EXAMS)">Examination information (TOP EXAMS)</option>
                          <option value="College Information(TOP COLLEGES/UNIVERSITY)">College Information(TOP COLLEGES/UNIVERSITY)</option>
                          <option value="Advertising with us">Advertising with us</option>
                          <option value="Business signup">Business signup</option>
                          <option value="Others">Others</option>
                      </select>
                  	</div>
                  	
                  	<div class="form-group col-sm-12">
                      <label>Message<span class="span_star">(*)</span></label>
                      <textarea class="form-control" style="height:150px;" name="message" id="message"></textarea>
                  	</div>

	                  

	                  <div class="form-group col-sm-2 pull-right">
	                     <button type="submit" class="btn btn-primary" id="btn_update_account" disabled="true" style="float:right;">Submit</button>
	                  </div>


	              </div>
	            </form>
	        	</div>
	        </div>
	    </div>
			<div class="col-lg-6 mb-6 mb-lg-0">
				<div class="card userCard">
        	<div class="card-header bg-white">
        	  <h5 class="m-0 d-inline">Our Address</h5>
        	</div>
        	<div class="card-body">
        		<div class="row">
        		    <div class="form-group col-sm-1">
        		        <img src="https://www.sikshapedia.com/content/common/assets/dist/img/map-marker-512.webp" style="width:50%;"/>
        		   </div>
					<div class="form-group col-sm-4">
                      
                      <p>
                          
                          Ground Floor, Sanai Apartment, 
                          23 Vidyasagar Road, Nabagram,
                          Hooghly, West Bengal, India - 712246
                      </p>
                  	</div>
                  	
                  	<div class="form-group col-sm-1">
        		        <img src="https://www.sikshapedia.com/content/common/assets/dist/img/download.png" style="width:50%;"/>
        		   </div>
					<div class="form-group col-sm-4">
                      
                      <p>
                         <a href="mailto:info@sikshapedia.com">info@sikshapedia.com</a>
                      </p>
                  	</div>
                  	
                  	<hr>
                  	<div class="form-group col-sm-12">
                  	    <div style="width: 100%;border:1px solid #c2c2c2; padding:5px;"><iframe width="100%" height="270" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=en&amp;q=Ground%20Floor,%20Sanai%20Apartment,%2023%20Vidyasagar%20Road,%20Nabagram,%20Hooghly,%20West%20Bengal,%20India%20-%20712246+(Waytoadmission)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.maps.ie/distance-area-calculator.html">measure area map</a></iframe></div>
                  	</div>
                  	
			      </div>
		      </div>
		    </div>
								
			</div>
    </div>

  </div>
</div>

<?php $this->widget->run('front_subscription_section',TRUE);?>
<script type="text/javascript">var wbpage='';</script>

<style type="text/css">
  .chosen-container{
    z-index: 1800000;
  }
 .chosen-container-single{
    width: 100% !important;
    border-radius: 0px !important;
  }
  .chosen-drop{
    max-height: 150px !important;
  }

 .chosen-container .chosen-results {
    max-height: 100px !important;
  }

  .active-result .group-option .highlighted{
    background-color: #1b1f4c !important;
  }
  .span_star{
  	color: red;
  }
  .error{
  	color: red;
  }
</style>

<script type="text/javascript">var page='';</script>