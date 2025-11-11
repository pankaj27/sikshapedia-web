
<div class="d-flex flex-column align-items-center text-center">
	<div class="profile-pic-wrapper">
	    <div class="pic-holder">
	        <img id="profilePic" class="pic" src="<?php echo $user_image;?>" draggable="false" loading="lazy">

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
	        <form id="form_user_image" enctype="multipart/form-data">
	            <Input class="uploadProfileInput" type="file" name="profile_pic" id="newProfilePhoto" accept="image/*" style="display: none;" />
	        </form>
	    </div>
	    </hr>
	    <p class="text-info text-center small">Note: Move the mouse over the image and select file to upload photo.Allowed file types are .png,.jpeg,.jpg</p>
	</div>
</div>