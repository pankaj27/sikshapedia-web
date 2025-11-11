<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="page-content d-flex align-items-center justify-content-center">

	<div class="row w-100 mx-0 auth-page">
		<div class="col-md-8 col-xl-6 mx-auto">
			<div class="card">
				<div class="row">
				    <div class="col-md-4 pr-md-0">
				      <div class="auth-left-wrapper">

				      </div>
				    </div>
				    <div class="col-md-8 pl-md-0">
				      <div class="auth-form-wrapper px-4 py-5">
				        <a href="#" class="noble-ui-logo d-block mb-2">
				        	<?php
				        	if(isset($system_general_settings->system_logo) && $system_general_settings->system_logo!=''){
				        		?>
				        		<img src="<?php echo $system_general_settings->system_logo;?>" alt="<?php echo $system_general_settings->system_meta_title;?>" class="main_logo">
				        		<?php
				        	}else if(isset($system_general_settings->system_meta_title) && $system_general_settings->system_meta_title!=''){
				        		echo $system_general_settings->system_meta_title;
				        	}
				        	?>
				        	
				        </a>
				        <h5 class="text-muted font-weight-normal mb-4">Welcome back! Log in to your account.</h5>
				        <form class="forms-sample" id="form_admin_login" method="POST" autocomplete="off">
				          <div class="form-group">
				            <label for="user_name">Username</label>
				            <input type="text" class="form-control" id="user_name" name="user_name" placeholder="User Name">
				          </div>
				          <div class="form-group">
				            <label for="user_password">Password</label>
				            <input type="password" class="form-control" id="user_password" name="user_password" autocomplete="current-password" placeholder="Password">
				          </div>
				          <div class="mt-3">
				            <button type="submit" class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" id="button_login">Login</button>
				          </div>
				        </form>
				      </div>
				    </div>
  				</div>
			</div>
		</div>
	</div>

</div>