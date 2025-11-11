<form id="form_stream_inner_menues_edit">            	
	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	<input type="hidden" name="_stream_id" id="_stream_id" value="<?php echo $stream_id;?>">
	<input type="hidden" class="form-control" name="menu_id" id="menu_id" value="<?php echo $stream_menu_data->menu_id;?>">
	<input type="hidden" class="form-control" name="menu_data_type_id" id="menu_data_type_id" value="<?php echo $stream_id;?>">
  <div class="row">
  	<div class="col-sm-3">
			<div class="form-group">
				<label class="control-label">Select Menu Type</label>
				<select class="form-control valid" name="stream_menu_fixed_type" id="stream_menu_fixed_type" aria-invalid="false">
					<option value="none">None</option>
					<option value="overview" <?php echo ($stream_menu_data->menu_slug=='overview')?'selected':'';?>>Overview</option>
					<option value="all-courses" <?php echo ($stream_menu_data->menu_slug=='all-courses')?'selected':'';?>>All Courses</option>
				</select>
			</div>
		</div>
    <div class="col-sm-3">
      <div class="form-group">
				<label class="control-label">Menu Name</label>
				<input type="text" class="form-control" placeholder="Enter name" name="stream_menu_name" id="stream_menu_name" value="<?php echo $stream_menu_data->menu_name;?>">
			</div>
		</div>
		<div class="col-sm-3">
        		<div class="form-group">
				<label class="control-label">Menu Serial</label>
				<input type="text" class="form-control" placeholder="Enter Serial" name="stream_inner_menu_serial" id="stream_inner_menu_serial" value="<?php echo $stream_menu_data->menu_serial;?>">
			</div>
		</div>
		<div class="col-sm-3">
			<div class="form-group">
				<label class="control-label">Menu Status</label>
				<select class="form-control" name="stream_menu_status" id="stream_menu_status">
					<option value="0">Select menu status</option>
					<option value="1" <?php echo ($stream_menu_data->menu_is_active==1)?'selected':'';?>>Active</option>
					<option value="2" <?php echo ($stream_menu_data->menu_is_active==2)?'selected':'';?>>Inactive</option>
				</select>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu page heading</label>
				<textarea class="form-control" placeholder="Enter name" name="stream_menu_page_heading" id="stream_menu_page_heading" rows="2"><?php echo $menu_slug_data->url_meta_heading;?></textarea>
			</div>
		</div>
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu Meta Title</label>
				<textarea class="form-control" placeholder="Enter name" name="stream_menu_title" id="stream_menu_title"><?php echo $menu_slug_data->url_meta_title;?></textarea>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu Meta Description</label>
				<textarea type="text" class="form-control" placeholder="Enter Menu Meta Description" name="stream_menu_meta_description" id="stream_menu_meta_description" rows="5"><?php echo $menu_slug_data->url_meta_desc;?></textarea>
			</div>
		</div>
		<div class="col-sm-6 menu_des_div">
       <div class="form-group">
				<label class="control-label">Menu Meta Keywords</label>
				<input type="text" class="form-control" placeholder="Enter Menu Meta Keywords" name="stream_menu_meta_keywords" id="stream_menu_meta_keywords" value="<?php echo $menu_slug_data->url_meta_key_words;?>">
			</div>
		</div>
	</div>


	<div class="row">
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu OG Title</label>
				<textarea class="form-control" placeholder="Enter name" name="stream_menu_og_title" id="stream_menu_og_title" rows="3"> <?php echo $menu_slug_data->url_og_title;?></textarea>
			</div>
		</div>
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu OG Description</label>
				<textarea class="form-control" rows="5" name="stream_menu_og_description" id="stream_menu_og_description" placeholder="Enter Meta Description" ><?php echo $menu_slug_data->url_og_desc;?></textarea>
			</div>
		</div>
	</div>



	<div class="row">
		<div class="col-sm-12 menu_des_div">
      <div class="form-group">
				<label class="control-label">Page Search Heading</label>
				<input type="text" class="form-control" placeholder="Enter Page Search Heading" name="stream_data_search_title" id="stream_data_search_title" value="<?php echo $search_data->search_data_name;?>">
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-3">
			<button type="submit" class="btn btn-primary" id="btn_stream_inner_menues_update">Save</button>
		</div>
	</div>
</form>

<script type="text/javascript">
	jQuery(function($) {
  	'use strict';
  		// The DOM element you wish to replace with Tagify
	  var input = document.querySelector('input[name=stream_menu_meta_keywords]');

	  // initialize Tagify on the above input node reference
	  new Tagify(input);

	  		$('#form_stream_inner_menues_edit').validate({
		      rules:{
		        stream_menu_name:{
		          required:true
		        },
		        stream_menu_page_heading:{
		        	required:true
		        },
		        stream_menu_title:{
		        	required:true
		        },
		        stream_menu_meta_description:{
		        	required:true
		        },
		        stream_menu_meta_keywords:{
		        	required:true
		        },
		        stream_inner_menu_serial:{
		          required:true,
		          digits: true
		        }
		      },
		      messages:{
		        stream_menu_name:{
		          required:'Menu name is invalid'
		        },
		        stream_menu_page_heading:{
		        	required:'Menu page heading required'
		        },
		        stream_menu_meta_description:{
		        	required:'Menu description required'
		        },
		        stream_menu_meta_keywords:{
		        	required:'Meta keywords required'
		        },
		        stream_inner_menu_serial:{
		          required:'Please enter serial number',
		          digits: 'Only digits are allowed'
		        }
		      },
		      submitHandler:function(){
		        $.ajax({
		          type:'POST',
		          url:base_url+'/streams/add_inner_menu',
		          data:$('#form_stream_inner_menues_edit').serialize(),
		          beforeSend:function(){
		             $('#btn_stream_inner_menues_update').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
		          },
		          success:function(d){
		            if(d.success){

		              $('#streamInnerMenuesEditModal').modal('hide');

		              Swal.fire({
		                icon: 'success',
		                title: d.success,
		                confirmButtonText:'Close',
		                confirmButtonColor:'#69da68',
		                allowOutsideClick: false,
		              });
		     
		              $('#btn_stream_inner_menues_update').html('Save').attr('disabled',false);
		            }else{
		              Swal.fire({
		                icon: 'error',
		                title: d.error,
		                confirmButtonText:'Close',
		                confirmButtonColor:'#69da68',
		                allowOutsideClick: false,
		              });
		              $('#btn_stream_inner_menues_update').html('Save').attr('disabled',false);
		            }
		          }
		        });
		      }
		    });

				//$('#streamInnerMenuesEditModal').trigger("chosen:updated");
		});
</script>