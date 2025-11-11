<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="profile-content py-4">
  <div class="wrapper">
    <div class="row">
    	<div class="col-lg-12 mb-12 mb-lg-0">
	        <div class="card userCard">
	        	<div class="card-header bg-white">
	        	  <h5 class="m-0 d-inline">Signin with <?php echo $system_name_title;?> credentials .</h5> <small id="user_type" class="form-text text-muted">Not Register yet.Register as <a href="<?php echo base_url();?>signup/college">College</a>, as <a href="<?php echo base_url();?>signup/university">University</a>, as <a href="<?php echo base_url();?>signup/student">Student</a></small>
	        	</div>
	        	<div class="card-body">
	        		<div class="row">
	        			<div class="col-lg-12" id="register_msg" style="display:none;">
	        				
	        			</div>
	        		</div>

	            <form id="form_login" novalidate="novalidate">
	              <div class="row">
	                <!-- <input type="hidden" name="data_type" value="general_settings"> -->
	                <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">

	    
		                	<div class="form-group col-lg-6">
	                      <label>Username <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="user_name" name="user_name" aria-describedby="register_student_name" placeholder="Enter username/phone no." value="">
	                  	</div>
	                  	<div class="form-group col-lg-6">
	                      <label>Password <span class="span_star">(*)</span></label>
	                      <input type="password" class="form-control" id="user_password" name="user_password" placeholder="Enter password" value="">
	                  	</div>
	                 
              
											<div class="form-group col-sm-6">
		                     <button type="submit" class="btn btn-primary pull-right" id="btn_login">Sign In</button>
		                  </div>
                  
	                		<div class="form-group col-sm-6">
	                  		<span>Forgot Password? <a href="<?php echo base_url();?>accountreset"> Click Here.</a></span>
	                  	</div>

		                  
	                	

                  	


	              </div>
	            </form>
	        	</div>

	        </div>

	        <!-- <div class="adBlock card userCard" style="margin-top:20px;">
	        	
	        </div> -->
	    </div>
	  </div>
	  <div class="row">
    	<div class="col-lg-12 mb-4 mb-lg-0">
    		<?php $this->widget->run('front_top_colleges_section',TRUE);?>
    	</div>
	   
    </div>
  </div>
</div>

<?php $this->widget->run('front_subscription_section',TRUE);?>

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

<script type="text/javascript">var page='';var wbpage='';</script>