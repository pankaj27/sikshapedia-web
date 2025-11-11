<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/institutions/colleges/add/<?php echo $college_id;?>"><?php echo (!empty($college_data))?'Back to '.$college_data['college_name']:'';?></a></li>
			<li class="breadcrumb-item active" aria-current="page"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College Course & Fees Data</li>
		</ol>
	</nav>

	<?php
	if(isset($college_data) && (!empty($college_data))){
		?>
		<div class="profile-page tx-13">

			<div class="profile-page tx-13">
				<div class="row">
		            <div class="col-12 grid-margin">
						<div class="profile-header">
							<div class="cover">
								<div class="gray-shade"></div>
								<figure>
									<img src="<?php echo (!empty($college_data))?$college_data['college_banner']:'';?>" class="img-fluid" alt="profile cover" style="height: 300px;">
								</figure>
								<div class="cover-body d-flex justify-content-between align-items-center">
									<div>
										<img class="profile-pic" src="<?php echo (!empty($college_data))?$college_data['college_logo']:'';?>" alt="profile">
										<a href="<?php echo (!empty($college_data))?$college_data['college_access_url']:'';?>" target="_blank"><span class="profile-name"><?php echo (!empty($college_data))?$college_data['college_name']:'';?></span></a>
									</div>
								</div>
							</div>
							<div class="header-links">
								<ul class="links d-flex align-items-center mt-3 mt-md-0">
									<li class="header-link-item d-flex align-items-center active">
										<button class="btn btn-primary btn-icon-text btn-edit-profile" data-toggle="modal" data-target="#collegeInnerMenuesModal"> Create inner Menues</button>
									</li>
								</ul>
							</div>
		            	</div>
		            </div>
				</div>
			</div>
			<?php
			if(isset($inner_menues_assigned) && !empty($inner_menues_assigned)){
				?>
				<div class="profile-page tx-13">
					<div class="row">
						<div class="col-12 grid-margin">
							<div class="profile-header">
							<?php
							foreach ($inner_menues_assigned as $key => $value) {
								?>
								<a class="btn btn-primary btn-icon-text btn-edit-profile" href="<?php echo $value['menu_link'];?>"> <?php echo $value['menu_name'];?></a>
								<?php
							}
							?>
							</div>
						</div>
					</div>
				</div>
				<?php
			}
			?>
			<div class="row">
				<div class="col-12 grid-margin stretch-card">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title">Course Section Introduction</h6>
							
							<div class="row">
								<form id="form_college_courses_fees_intro">
									
									<div class="col-sm-12">
										<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
										<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
										<input type="hidden" name="college_info_type" value="3">
										<div class="form-group">
											<textarea class="form-control college_info" name="college_general_info" id="college_general_info" rows="10" >
												<?php
												if(!empty($college_data['college_course_info'])){
													echo $college_data['college_course_info'];
												}
												?>
											</textarea>
										</div>										
									</div>
									<div class="col-sm-12">
								        <button type="submit" class="btn btn-primary" id="btn_save_course_info">Save</button>
								    </div>
							    </form>
							</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 grid-margin stretch-card">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title">Courses & Fees</h6>

							<div class="table-responsive">
								<table id="college_courses_fees_list_table" class="table">
									<thead>
				                      <tr>
			                      		<th>#</th>
				                        <th>Course</th>
				                        <th>Duration</th>
				                        <th>Total Fees</th>
				                        <th>Action</th>		                         
				                      </tr>
				                    </thead>
				                    <tbody>		                    	
				                    </tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 grid-margin stretch-card">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College - [ <?php echo (!empty($college_data))?$college_data['college_name']:'';?> ]-[ Course & Fees Data]</h6>

							<form id="form_college_courses_fees">
								<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
								<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Course Name</label>
							            	<select class="form-control" id="_course" name="_course" >
							            		<option value="0">Select Course to Add</option>
												<?php
								            	if(!empty($college_data['college_courses'])){
								            		foreach ($college_data['college_courses'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_id'];?>" <?php echo $value['selected'];?>><?php echo $value['course_name'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>								            	
						            	</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-3">
										<div class="form-group">
											<label>Total Seats</label>
											<input type="text" class="form-control" name="college_course_seats" placeholder="Seats available" value="">
										</div>
									</div>
									<div class="col-sm-9">
										<div class="form-group">
											<label>Eligibility</label>
											<input type="text" class="form-control" name="college_course_eligibility" placeholder="Eligibility" value="">
										</div>
									</div>
								</div>

								<h6>Course Duration</h6>
								<hr>
								<div class="row">
									<div class="col-sm-6">
										<div class="form-group">
											<label>Course Duration (Years)</label>
							            	<select class="form-control" id="course_duration" name="course_duration">
							            		<option value="0">Select Course Duration</option>
												<?php
								            	if(!empty($college_data['college_course_duration'])){
								            		foreach ($college_data['college_course_duration'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_duration_year'];?>" <?php echo $value['selected'];?>><?php echo $value['course_duration_year'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>								            	
						            	</div>
									</div>
									<div class="col-sm-6">
										<div class="form-group">
											<label>Course Duration Type</label>
							            	<select class="form-control" id="course_duration_type" name="course_duration_type" >
							            		<option value="0">Select Duration Type</option>
												<?php
								            	if(!empty($college_data['course_duration_types'])){
								            		foreach ($college_data['course_duration_types'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['duration_type'];?>" <?php echo $value['selected'];?>><?php echo $value['duration_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>							            	
						            	</div>
									</div>
								</div>

								<h6>Others</h6>
								<hr>
								<div class="row">
									<div class="col-sm-3">
										<div class="form-group">
											<label>Course Type</label>
							            	<select class="form-control" id="course_type" name="course_type" >
							            		<option value="0">Select Course Type</option>
												<?php
								            	if(!empty($college_data['college_course_types'])){
								            		foreach ($college_data['college_course_types'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_type'];?>" <?php echo $value['selected'];?>><?php echo $value['course_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>
								            	
						            	</div>
									</div>
									<div class="col-sm-2">
										<div class="form-group">
											<label>Course Pass Type</label>
							            	<select class="form-control" id="course_pass_type" name="course_pass_type" >
							            		<option value="0">Select Course Pass Type</option>
												<?php
								            	if(!empty($college_data['college_course_pass_types'])){
								            		foreach ($college_data['college_course_pass_types'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_pass_type'];?>" <?php echo $value['selected'];?>><?php echo $value['course_pass_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>
								            	
						            	</div>
									</div>
								
									<div class="col-sm-3">
										<div class="form-group">
											<label>Placement Type</label>
							            	<select class="form-control" id="course_placement_type" name="course_placement_type" >
							            		<option value="0">Select Placement Type</option>
												<?php
								            	if(!empty($college_data['college_placement_types'])){
								            		foreach ($college_data['college_placement_types'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['placement_type'];?>" <?php echo $value['selected'];?>><?php echo $value['placement_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>	
						            	</div>
									</div>
								</div>


								<h6>Course Cost (In general)</h6>
								<hr>

								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Cost Type</label>
											<select class="form-control" id="course_cost_type" name="course_cost_type">
												<?php
												if(!empty($course_cost_types)){
													foreach ($course_cost_types as $key => $value) {
														?>
														<option value="<?php echo $value['cost_key'];?>" <?php echo $value['selected'];?>><?php echo $value['cost_value'];?></option>
														<?php
													}
												}
												?>
											</select>
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Course Cost (In general)</label>
											<div class="table-responsive">
												<table class="table" id="course_price_list_table">
								                    <thead>
									                    <tr>
									                        <th>Year</th>
									                        <th>Tuition Fees(<?php echo $user_currency;?>)</th>
									                        <th>Admission Fees(<?php echo $user_currency;?>)</th>
									                        <th>Registration Fees(<?php echo $user_currency;?>)</th>
									                        <th>Exam Fees(<?php echo $user_currency;?>)</th>
									                        <th>Other Fees(<?php echo $user_currency;?>)</th>
									                    </tr>
									                </thead>
									                <tbody>
									                	<?php
									                	$i=1;
									                	if(!empty($course_data_costs))
									                		foreach ($course_data_costs as $key => $value) {
									                			?>
									                			<tr>
									                				<td><?php echo ordinal($value->user_course_year);?> Year <input type="hidden" name="registration_course_fees[<?php echo $i;?>][course_year]" value="<?php echo $value->user_course_year;?>"></td>
									                				<td>
									                					<table class="table">
									                						<tbody>
									                							<tr>
									                								<td><label>Semester 1</label>
									                								<input type="number" min="0" class="valid" value="<?php echo $value->user_course_tution_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_tution_fee_sem_1]"></td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_tution_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_tution_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                				<td>
									                					<table>
									                						<tbody>
									                							<tr>
									                								<td>
									                									<label>Semester 1</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_admisssion_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_admisssion_fee_sem_1]">
									                								</td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_admisssion_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_admisssion_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                				<td>
									                					<table>
									                						<tbody>
									                							<tr>
									                								<td>
									                									<label>Semester 1</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_reg_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_reg_fee_sem_1]">
									                								</td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_reg_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_reg_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                				<td>
									                					<table>
									                						<tbody>
									                							<tr>
									                								<td>
									                									<label>Semester 1</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_exam_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_exam_fee_sem_1]">
									                								</td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_exam_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_exam_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                				<td>
									                					<table>
									                						<tbody>
									                							<tr>
									                								<td>
									                									<label>Semester 1</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_other_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_other_fee_sem_1]">
									                								</td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_other_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_other_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                			</tr>
									                			<?php
									                			$i++;
									                		}
									                	?>
									                </tbody>
								                </table>								                
								            </div>
							        	</div>
									</div>
								</div>

								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Tag Streams</label>
											<br>
											<?php
											if(!empty($college_data['college_streams'])){
												foreach ($college_data['college_streams'] as $key => $value) {
													?>
													<input type="checkbox" name="course_streams[]" value="<?php echo $value['stream_id'];?>"><?php echo $value['stream_name'];?><br>
													<?php
												}
											}
											?>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-12">
							           <button type="submit" class="btn btn-primary" id="btn_save_course">Save</button>
							        </div>
							    </div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
	?>
</div>







<script type="text/javascript">let _college='<?php echo (!empty($college_data))?$college_data['college_id']:'';?>';</script>

<script type="text/javascript">
	jQuery(function($) {
  		'use strict';

  		tiny_mce('#college_general_info');

		function tiny_mce(ctrl_area){
		    tinymce.init({
		      selector: ctrl_area,
		      entity_encoding : "raw",
		      height: 400,
		      theme: 'silver',
		      font_formats:"UbuntuCondensed-Regular;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
		      plugins: [
		        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
		        'searchreplace wordcount visualblocks visualchars code fullscreen table',
		      ],
		      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
		      toolbar2: 'forecolor backcolor emoticons | codesample',
		      table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
		      setup: function(editor) {
		        // Register our custom button callback function
		        editor.on('init',function(e) {
		            //tinyMceEditLink(editor);
		            tinyMceEditLinkSearch(editor);
		        });

		      },
		      table_appearance_options: true,
		      table_use_colgroups: true
		    });
		  }

		function tinyMceEditLinkSearch(editor){
			  editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
			    editor.windowManager.open = function (t, r) {    // replace with our own function
			        var modal = this.oldOpen.apply(this, [t, r]);  // call original
			        var h='';
			        h+='<select class="form-control" id="search_form">';
			        h+='<optgroup label="Exams">';
			        h+='<option value="exam">Search from exams</option>';
			        h+='</optgroup>';
			        h+='<optgroup label="Colleges & Universities">';
			        h+='<option value="college">Search from college</option>';
			        h+='<option value="universities">Search from universities</option>';
			        h+='</optgroup>';
			        h+='<optgroup label="Streams & Courses">';
			        h+='<option value="streams">Search from streams</option>';
			        h+='<option value="courses">Search from course</option>';
			        h+='</optgroup>';
			        h+='</select>'

			        if (t.title === "Insert/Edit Link") {
			            $('.tox-form').prepend('<div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false">'+h+'<div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div><div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false"><input type="text" role="combobox" aria-autocomplete="list" aria-haspopup="true" tabindex="-1" class="tox-textfield jAuto" aria-expanded="false" id="search-box"><div id="suggesstion-box"><ul id="search_tag-list"></ul></div><div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div>'
			            );

			            $('.tox-dialog__footer-end').prepend(
			                '<button title="Custom button" type="button" data-alloy-tabstop="true" tabindex="-1" class="tox-button" id="custom_button">Search</button>'
			            );

			        }

			        return modal; // Template plugin is dependent on this return value
			    };
			}


  	});
</script>