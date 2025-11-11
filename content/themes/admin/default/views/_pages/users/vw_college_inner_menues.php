<form id="form_college_inner_menues_edit">            	
	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	<input type="hidden" class="form-control" name="menu_id" id="menu_id" value="<?php echo $college_menu_data->menu_id;?>">
	<input type="hidden" class="form-control" name="menu_data_type_id" id="menu_data_type_id" value="<?php echo $college_id;?>">
	<input type="hidden" class="form-control" name="menu_data_type" id="menu_data_type" value="<?php echo $menu_type;?>">
  <div class="row">
  	<div class="col-sm-3">
			<div class="form-group">
				<label class="control-label">Select Menu Type</label>
				<select class="form-control" name="college_inner_menu_type" id="college_inner_menu_type">
					<option value="0">Select menu type</option>
					<?php
					if(!empty($inner_menu_types)){
						foreach ($inner_menu_types as $key => $value) {
							?>
							<option value="<?php echo $value->menu_type_id;?>" data-menu="<?php echo $value->menu_type_name;?>" <?php echo ($value->menu_type_id==$college_menu_data->menu_type)?'selected':'';?>><?php echo $value->menu_type_name;?></option>
							<?php
						}
					}

					?>
				</select>
			</div>
		</div>
    <div class="col-sm-3">
      <div class="form-group">
				<label class="control-label">Menu Name</label>
				<input type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_name" id="college_inner_menu_name" value="<?php echo $college_menu_data->menu_name;?>">
			</div>
		</div>
		<div class="col-sm-3">
        		<div class="form-group">
				<label class="control-label">Menu Serial</label>
				<input type="text" class="form-control" placeholder="Enter Serial" name="college_inner_menu_serial" id="college_inner_menu_serial" value="<?php echo $college_menu_data->menu_serial;?>">
			</div>
		</div>
		<div class="col-sm-3">
			<div class="form-group">
				<label class="control-label">Menu Status</label>
				<select class="form-control" name="college_inner_menu_status" id="college_inner_menu_status">
					<option value="0">Select menu status</option>
					<option value="1" <?php echo ($college_menu_data->menu_is_active==1)?'selected':'';?>>Active</option>
					<option value="2" <?php echo ($college_menu_data->menu_is_active==2)?'selected':'';?>>Inactive</option>
				</select>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu page heading</label>
				<input type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_page_heading" id="college_inner_menu_page_heading" value="<?php echo (!empty($menu_slug_data->url_meta_heading))?$menu_slug_data->url_meta_heading:'';?>">
			</div>
		</div>

		<div class="col-sm-6 menu_des_div">
        		<div class="form-group">
				<label class="control-label">Menu Meta Title</label>
				<textarea type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_meta_title" id="college_inner_menu_meta_title" rows="3"><?php echo (isset($menu_slug_data->url_meta_title))?$menu_slug_data->url_meta_title:'';?></textarea>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu Meta Description</label>
				<textarea type="text" class="form-control" placeholder="Enter Menu Meta Description" name="college_inner_menu_meta_description" id="college_inner_menu_meta_description" rows="5"><?php echo (isset($menu_slug_data->url_meta_desc))?$menu_slug_data->url_meta_desc:'';?></textarea>
			</div>
		</div>

		<div class="col-sm-6 menu_des_div">
       <div class="form-group">
				<label class="control-label">Menu Meta Keywords</label>
				<input type="text" class="form-control" placeholder="Enter Menu Meta Keywords" name="college_inner_menu_meta_keywords_edit" id="college_inner_menu_meta_keywords_edit" value="<?php echo (isset($menu_slug_data->url_meta_key_words))?$menu_slug_data->url_meta_key_words:'';?>">
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu OG Title</label>
				<textarea type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_og_title" id="college_inner_menu_og_title" rows="3"><?php echo (isset($menu_slug_data->url_og_title))?$menu_slug_data->url_og_title:'';?></textarea>
			</div>
		</div>

		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Menu OG Description</label>
				<textarea class="form-control" rows="5" name="college_inner_menu_og_description" id="college_inner_menu_og_description" placeholder="Enter Meta Description" ><?php echo (isset($menu_slug_data->url_og_desc))?$menu_slug_data->url_og_desc:'';?></textarea>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-12 menu_des_div">
      <div class="form-group">
				<label class="control-label">Page Search Heading</label>
				<textarea type="text" class="form-control" placeholder="Enter Page Search Heading" name="college_data_search_title" id="college_data_search_title" rows="3"><?php echo (isset($menu_searched_data->search_data_name))?$menu_searched_data->search_data_name:'';?></textarea>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-6 menu_des_div">
      <div class="form-group">
				<label class="control-label">Select Page Widgets</label><br>
				<input type="text" name="college_menu_widgets_edit" placeholder="Select widgets from list below" value="">
			</div>

		</div>
		<div class="col-sm-6 selected_widgets">
			 	<div class="form-group">
			 		<label class="control-label">Selected Page Widgets</label>
					<table id="selected_widgets" class="table table-bordered">
						<tbody>
							<?php

							$wds=(!empty($college_menu_data->menu_main_widget))?unserialize($college_menu_data->menu_main_widget):'';

							if(!empty($wds)){
								foreach ($wds as $key => $value) {
									?>
									<tr>
										<td><b><?php echo $value;?></b></td>
									</tr>
									<?php
								}
							}

							?>
						</tbody>
					</table>
				</div>
		</div>
	</div>


		
			<?php
			if(!empty($menu_slug_data)){
				?>
				<div class="row">
					<div class="col-sm-6 menu_des_div">
			      <div class="form-group">
							<button type="button" class="btn btn-sm btn-primary" id="btn_update_college_breadcrumb_structure_data" data-pre_id="college_strcut_breadcrumb-display" data-college_id="<?php echo $college_id;?>" data-url_id="<?php echo $menu_slug_data->url_id;?>" data-struct_data_type="BreadcrumbList">Update Structure Data</button>
						</div>
						<div class="form-group">
							<pre id="college_strcut_breadcrumb-display"></pre>
						</div>
					</div>
					<div class="col-sm-6 menu_des_div">
			      <div class="form-group">
							<button type="button" class="btn btn-sm btn-primary" id="btn_update_college_structure_data" data-pre_id="college_strcut_collegeuniversity-display" data-college_id="<?php echo $college_id;?>" data-url_id="<?php echo $menu_slug_data->url_id;?>" data-struct_data_type="CollegeOrUniversity">Update Structure Data</button>
						</div>
						<div class="form-group">
							<pre id="college_strcut_collegeuniversity-display"></pre>
						</div>
					</div>
				</div>
				<?php
			}

			?>
			
	

	<div class="col-sm-12" id="special_menu_type_link_div" style="display:none;">
		<table class="table table-bordered table-condensed">
			<thead>
				<tr>
					<th>Link To Exam/Other Colleges/University</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<div class="col-sm-12">
							<div class="form-group">
								<select class="form-control select2_option" name="college_inner_menu_other_link" id="college_inner_menu_other_link">
									<option value="0">Select Menu Link</option>
									<optgroup label="Exams">
									<?php
									if(!empty($exams_links)){
										foreach ($exams_links as $key => $value) {
											?>
											<option value="exam#<?php echo $value['exam_link'];?>"><?php echo $value['exam_name'];?></option>
											<?php
										}
									}
									?>
									</optgroup>
									<optgroup label="College/University">
										<?php
										foreach ($college_links as $key => $value) {
											?>
											<option value="college_university#<?php echo $value['college_link'];?>"><?php echo $value['college_name'];?></option>
											<?php
										}
										?>
									</optgroup>
								</select>
							</div>
						</div>
					</td>
				</tr>
			</tbody>
		</table>									
	</div>

	<div class="row">
		<div class="col-sm-3">
			<button type="submit" class="btn btn-primary" id="btn_college_inner_menues_update">Save</button>
		</div>
	</div>
</form>

<?php

	if(!empty($college_widgets)){
		foreach ($college_widgets as $key => $value) {
			$wd[]='"'.$value.'#'.$key.'"';
		}

		$_wd=char_separated($wd);

		//"College Info Section#front_info_section",
	        	// "College Admission Info Section#front_admission_section",
	        	// "College Course Fees Section#front_course_fees_section",
	        	// "College Course Fees Section With Ads#front_course_fees_brief_with_ads_section",
	        	// "College Placement Section#front_placement_section",
	        	// "College Placement Details Section#front_placement_details_section",
	        	// "College Facilities Section#front_facilities_section",
	        	// "College News Brief Section#front_news_brief_section",
	        	// "College Gallery Brief Section#front_gallery_brief_section",
	        	// "College Gallery Full Section#front_gallery_section",
	        	// "College Address Google Map Section#front_google_maps_section",
	        	// "College Comment Section#front_college_comment_section",
	        	// "Nearby College/University Section#front_nearby_colleges_universities_section",
	        	// "Newsletter Subscription Section#front_subscription_section",
	        	// "Google Ads Section#front_google_ads_section",
	        	// "College Review Section#front_review_list_section"
	}
	?>

<script type="text/javascript">

	jQuery(function($) {
  		'use strict';

      
			const elem = document.getElementById('college_strcut_breadcrumb-display');
			<?php
			if(!empty($menu_breadcrumb_struct_data)){
				?>
				elem.innerHTML = <?php echo (!empty($menu_breadcrumb_struct_data))?$menu_breadcrumb_struct_data->slug_type_json_ld_data:'""';?>;
				<?php
			}
			?>
			
			
			
			const elem2 = document.getElementById('college_strcut_collegeuniversity-display');

			<?php
			if(!empty($menu_collegeuniversity_struct_data_data)){
				?>
				elem2.innerHTML = <?php echo (!empty($menu_collegeuniversity_struct_data_data))?$menu_collegeuniversity_struct_data_data->slug_type_json_ld_data:'""';?>;
				<?php
			}

			?>
			
  		// The DOM element you wish to replace with Tagify
		  var input = document.getElementById('college_inner_menu_meta_keywords_edit');

		  // initialize Tagify on the above input node reference
		  new Tagify(input);

		  //Widget Section
		var input = document.querySelector('input[name=college_menu_widgets_edit]'),
	    // init Tagify script on the above inputs
	    tagify = new Tagify(input, {
	        whitelist : [<?php echo $_wd;?>],
	        dropdown: {
	            position: "manual",
	            maxItems: Infinity,
	            enabled: 0,
	            classname: "customSuggestionsList"
	        },
	        templates: {
	            dropdownItemNoMatch() {
	                return `<div class='empty'>Nothing Found</div>`;
	            }
	        },
	        enforceWhitelist: true
	    })

	    tagify.on("dropdown:show", onSuggestionsListUpdate)
	          .on("dropdown:hide", onSuggestionsListHide)
	          .on('dropdown:scroll', onDropdownScroll)

	    renderSuggestionsList()  // defined down below

	    // ES2015 argument destructuring
	    function onSuggestionsListUpdate({ detail:suggestionsElm }){
	        console.log(  suggestionsElm  )
	    }

	    function onSuggestionsListHide(){
	        console.log("hide dropdown")
	    }

	    function onDropdownScroll(e){
	        console.log(e.detail)
	    }

	    // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
	    function renderSuggestionsList(){
	        tagify.dropdown.show() // load the list
	        tagify.DOM.scope.parentNode.appendChild(tagify.DOM.dropdown)
	    }

  		$('#college_menu_widgets_section').chosen({no_results_text: "Select Menu Widgets"});

  		$('#form_college_inner_menues_edit').validate({
	      rules:{
	        college_inner_menu_type:{
	          valueNotEquals:'0'
	        },
	        college_inner_menu_name:{
	          required:true
	        },
	        college_inner_menu_serial:{
	          required:true,
	          digits: true
	        }
	      },
	      messages:{
	        college_inner_menu_type:{
	          valueNotEquals:'Select menu type'
	        },
	        college_inner_menu_name:{
	          required:'Menu name is invalid'
	        },
	        college_inner_menu_serial:{
	          required:'Please enter serial number',
	          digits: 'Only digits are allowed'
	        }
	      },
	      submitHandler:function(){
	        $.ajax({
	          type:'POST',
	          url:base_url+'/institutions/colleges/inner_menu_add',
	          data:$('#form_college_inner_menues_edit').serialize(),
	          beforeSend:function(){
	             $('#btn_college_inner_menues_update').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	          },
	          success:function(d){
	            if(d.success){

	              var cid=$(this).attr('data-cid');
	              var menu_id=$(this).attr('data-aid');
	              var menu_type_name=$(this).attr('data-menu_name');

	              // $.ajax({
	              //   type:'POST',
	              //   url:base_url+'/institutions/colleges/inner_menu_update',
	              //   data:{csrf_test_name:csrf_hash,cid:cid,menu_id:menu_id,menu_type_name:menu_type_name},
	              //   success:function(d){
	              //   }
	              // });

	              $('#collegeInnerMenuesEditModal').modal('hide');

	              Swal.fire({
	                icon: 'success',
	                title: d.success,
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
	              });
	             
	              var table=$('#college_menu_type_list_table').DataTable();
	              table.ajax.reload( null, false );
	              $('#btn_college_inner_menues_update').html('Save').attr('disabled',false);
	            }else{
	              Swal.fire({
	                icon: 'error',
	                title: d.error,
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
	              });
	              $('#btn_college_inner_menues_update').html('Save').attr('disabled',false);
	            }
	          }
	        });
	      }
	    });

			$('#college_menu_widgets_section').trigger("chosen:updated");

			

	});
</script>