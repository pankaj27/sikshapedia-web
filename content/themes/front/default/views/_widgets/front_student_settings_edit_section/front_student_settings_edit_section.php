<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="row">
	<div class="col-lg-12 mb-4 mb-lg-0" id="gallery_tabs">
		<div class="card userCard">
			<div class="card-header bg-white">
			  <h5 class="m-0 d-inline">Account Informations & Settings</h5> <small id="user_type" class="form-text text-muted">Update your account details & settings</small>
			</div>
			<div class="card-body">
					<!-- <div class="row">
						<div class="profile-pic-wrapper">
						  <div class="pic-holder">
						    <img id="profilePic" class="pic" src="https://source.unsplash.com/random/150x150">

						    <label for="newProfilePhoto" class="upload-file-block">
						      <div class="text-center">
						        <div class="mb-2">
						          <i class="fa fa-camera fa-2x"></i>
						        </div>
						        <div class="text-uppercase">
						          Update <br /> Profile Photo
						        </div>
						      </div>
						    </label>
						    <Input class="uploadProfileInput" type="file" name="profile_pic" id="newProfilePhoto" accept="image/*" style="display: none;" />
						  </div>

						</hr>
						  <p class="text-info text-center small">Note: Selected image will not be uploaded anywhere. </br> It's just for demonstration purposes.</p>
						</div>
					</div> -->

					<?php //print_obj($userdata);?>

				
					<form id="form_student_acc_settings" enctype="multipart/form-data">
						<input type="hidden" name="change_type" value="account_settings">
						<div class="row">
							<div class="form-group col-sm-12">
				                <label>Account User Name <small class="form-text text-muted">(to login into the system)</small></label>
				                <input type="text" class="form-control" id="registration_user_name" aria-describedby="registration_user_name" placeholder="Account User Name" value="<?php echo (isset($userdata->user_name))?$userdata->user_name:'';?>" disabled="disabled">
				            </div>
				        </div>
				        <div class="row">
				            <div class="form-group col-sm-12">
				                <label>Account Recovery E-mail <small class="form-text text-muted">(contact person email)</small></label>
				                <input type="text" class="form-control" id="registration_user_recovery_mail" name="registration_user_recovery_mail" aria-describedby="registration_user_recovery_mail" placeholder="Account Recovery E-mail" value="<?php echo (isset($userdata->user_alter_email))?$userdata->user_alter_email:'';?>" autocomplete="off">
				            </div>
				        </div>

				        

				        <div class="row">
				            <div class="form-group col-sm-12">
				                <label>Current Password</label>
				                <input type="password" class="form-control" id="registration_user_current_pass" name="registration_user_current_pass" aria-describedby="registration_user_current_pass" placeholder="Current Password" value="" autocomplete="off">
				            </div>
				        </div>
				        <div class="row">
				            <div class="form-group col-sm-12">
				                <label>New Password</label>
				                <input type="password" class="form-control" id="registration_user_new_pass" name="registration_user_new_pass" aria-describedby="registration_user_new_pass" placeholder="New Password" value="" autocomplete="off">
				            </div>					            
			            </div>


			            <div class="row">
				            <div class="form-group col-sm-12">
				                <label>E-mail Communication Active<small class="form-text text-muted">(contact person email)</small></label>
				                <select class="form-control" name="registration_email_active">
				                	<option value="yes" <?php echo (isset($college_profile_data->is_email_com_active) && ($college_profile_data->is_email_com_active=='yes'))?'selected':'';?>>Yes</option>
				                	<option value="no" <?php echo (isset($college_profile_data->is_email_com_active) && ($college_profile_data->is_email_com_active=='no'))?'selected':'';?>>No</option>
				                </select>
				            </div>
				        </div>

				        <div class="row">
				            <div class="form-group col-sm-12">
				                <label>SMS Communication Active<small class="form-text text-muted">(contact person email)</small></label>
				                <select class="form-control" name="registration_sms_active">
				                	<option value="yes" <?php echo (isset($college_profile_data->is_sms_com_active) && ($college_profile_data->is_sms_com_active=='yes'))?'selected':'';?>>Yes</option>
				                	<option value="no" <?php echo (isset($college_profile_data->is_sms_com_active) && ($college_profile_data->is_sms_com_active=='no'))?'selected':'';?>>No</option>
				                </select>
				            </div>
				        </div>

			            <div class="row">
			            	<div class="col-sm-12">
				               <button type="submit" class="btn btn-primary" id="btn_update_account_info">Update</button>
				            </div>
			            </div>

		            </form>

			</div>
		</div>
	</div>
</div>

<!--https://codepen.io/chiraggoyal777/pen/xxEowxq-->

<script type="text/javascript">
	// $(document).on("change", ".uploadProfileInput", function () {
 //    var triggerInput = this;
 //    var currentImg = $(this).closest(".pic-holder").find(".pic").attr("src");
 //    var holder = $(this).closest(".pic-holder");
 //    var wrapper = $(this).closest(".profile-pic-wrapper");
 //    $(wrapper).find('[role="alert"]').remove();
 //    var files = !!this.files ? this.files : [];
 //    if (!files.length || !window.FileReader) {
 //      return;
 //    }
 //    if (/^image/.test(files[0].type)) {
 //      // only image file
 //      var reader = new FileReader(); // instance of the FileReader
 //      reader.readAsDataURL(files[0]); // read the local file

 //      reader.onloadend = function () {
 //        $(holder).addClass("uploadInProgress");
 //        $(holder).find(".pic").attr("src", this.result);
 //        $(holder).append(
 //          '<div class="upload-loader"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>'
 //        );

 //        // Dummy timeout; call API or AJAX below
 //        setTimeout(() => {
 //          $(holder).removeClass("uploadInProgress");
 //          $(holder).find(".upload-loader").remove();
 //          // If upload successful
 //          if (Math.random() < 0.9) {
 //            $(wrapper).append(
 //              '<div class="snackbar show" role="alert"><i class="fa fa-check-circle text-success"></i> Profile image updated successfully</div>'
 //            );

 //            // Clear input after upload
 //            $(triggerInput).val("");

 //            setTimeout(() => {
 //              $(wrapper).find('[role="alert"]').remove();
 //            }, 3000);
 //          } else {
 //            $(holder).find(".pic").attr("src", currentImg);
 //            $(wrapper).append(
 //              '<div class="snackbar show" role="alert"><i class="fa fa-times-circle text-danger"></i> There is an error while uploading! Please try again later.</div>'
 //            );

 //            // Clear input after upload
 //            $(triggerInput).val("");
 //            setTimeout(() => {
 //              $(wrapper).find('[role="alert"]').remove();
 //            }, 3000);
 //          }
 //        }, 1500);
 //      };
 //    } else {
 //      $(wrapper).append(
 //        '<div class="alert alert-danger d-inline-block p-2 small" role="alert">Please choose the valid image.</div>'
 //      );
 //      setTimeout(() => {
 //        $(wrapper).find('role="alert"').remove();
 //      }, 3000);
 //    }
 //  });

</script>


<style type="text/css">
	.profile-pic-wrapper {
  /*height: 100vh;*/
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pic-holder {
  text-align: center;
  position: relative;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.pic-holder .pic {
  height: 100%;
  width: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
}

.pic-holder .upload-file-block,
.pic-holder .upload-loader {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(90, 92, 105, 0.7);
  color: #f8f9fc;
  font-size: 12px;
  font-weight: 600;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pic-holder .upload-file-block {
  cursor: pointer;
}

.pic-holder:hover .upload-file-block {
  opacity: 1;
}

.pic-holder.uploadInProgress .upload-file-block {
  display: none;
}

.pic-holder.uploadInProgress .upload-loader {
  opacity: 1;
}

/* Snackbar css */
.snackbar {
  visibility: hidden;
  min-width: 250px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 14px;
  transform: translateX(-50%);
}

.snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

</style>
