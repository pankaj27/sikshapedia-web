<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/institutions/colleges/add/<?php echo $college_id;?>"><?php echo (!empty($college_data))?$college_data['college_name']:'';?></a></li>
			<li class="breadcrumb-item active" aria-current="page"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College Faculty Data</li>
		</ol>
	</nav>

	<?php
	if(isset($college_data) && (!empty($college_data))){
		?>
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
							<div class="profile-header table-responsive">
								<table class="table">
									<thead>
										<tr>
											<th>Inner Menu</th>
										</tr>
									</thead>
									<tbody>
										<tr>
										<?php
										foreach ($inner_menues_assigned as $key => $value) {
											?>
											<td>
												<div class="btn-group" role="group" aria-label="Basic example">
													<a class="btn btn-primary btn-icon-text btn-edit-profile" href="<?php echo $value['menu_link'];?>"> <?php echo (!empty($value['menu_name']))?$value['menu_name']:$value['menu_type'];?></a>
													<button class="btn btn-xs btn-danger btn_del_college_inner_menu" type="button" data-cid="<?php echo $college_id;?>" data-aid="<?php echo encode_data($value['menu_id']);?>">Remove Menu</button>
												</div>
											</td>
											<?php
										}
										?>
										</tr>
									</tbody>
								</table>						
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
                              <h6 class="card-title">Faculty Section Introduction</h6>
                              
                              
                              <form id="form_college_faculty_intro">
                                   	<div class="row"> 
	                                    <div class="col-sm-12">
	                                          <input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
	                                          <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	                                          <input type="hidden" name="college_info_type" value="8">
	                                          <input type="hidden" name="college_details_type" value="faculty_info">
								<input type="hidden" name="college_type" value="2">

								<div class="row">
									<div class="col-md-12">
										<div class="form-group">
											<textarea class="form-control college_general_info" name="college_general_info" id="college_general_info" rows="10" >
												<?php

												//print_obj($college_data['college_admission_info']);

												if(!empty($college_data['college_faculty_intro'])){
													echo $college_data['college_faculty_intro'];
												}
												?>
											</textarea>
										</div>
									</div>
								</div>		
	                                          <div class="col-sm-12">
									<div class="row table-responsive" id="data_heading_rows">
										<?php $table_row='0';?>
										<table class="table" style="width:100% !important;">
											<?php
											if(!empty($college_faculty_info)){
												foreach ($college_faculty_info as $key => $value) {
													if($value->info_value_type=='general'){
														?>
														<tr id="trFacultyIntroData<?php echo $table_row;?>">
														    <td>
														    <div class="form-group row">
														      	<div class="col-md-12">
													              <h6>Content Detail</h6>
													              <input type="hidden" name="college_general_info[<?php echo $table_row;?>][data_type]" value="general">
													              <input type="number" class="form-control" name="college_general_info[<?php echo $value->info_serial;?>][data_serial]" value="<?php echo $table_row;?>">
													              <textarea class="form-control college_general_info" rows="40" name="college_general_info[<?php echo $table_row;?>][data_content]"><?php echo $value->info_value;?></textarea>		              
													            </div>
													        </div>
														    <div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trFacultyIntroData<?php echo $table_row;?>').remove()">Delete Row</button></div></div>
														    </td>
													    </tr>
														<?php
													}else if($value->info_value_type=='image'){
														?>
														<tr id="trFacultyIntroData<?php echo $table_row;?>">
														    	<td>
															    <div class="form-group row">
															    <div class="col-md-12">
																    <h6>Image Data</h6>
																    <input type="hidden" id="college_general_info<?php echo $table_row;?>" name="college_general_info[<?php echo $table_row;?>][data_type]" value="image">
																    <input type="text" id="college_general_info<?php echo $table_row;?>" name="college_general_info[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->info_serial;?>">
																    <input type="hidden" id="college_general_info<?php echo $table_row;?>" name="college_general_info[<?php echo $table_row;?>][data_type_value]" value="<?php echo $value->info_value_id;?>">
																    <input type="hidden" id="college_general_info<?php echo $table_row;?>" name="college_general_info[<?php echo $table_row;?>][data_content]" value="<?php echo $value->info_value;?>">
																    <div class="row"><img id="data_img_src<?php echo $table_row;?>" src="<?php echo $value->info_value;?>" class="img-thumbnail" alt="Cinque Terre"></div>
															    <div>
															    </div>
															    <div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="<?php echo $table_row;?>" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trFacultyIntroData<?php echo $table_row;?>').remove()">Delete Row</button></div></div>';
														    	</td>
													    	<tr>
														<?php
													}else if($value->info_value_type=='ads'){
														?>
														<tr id="trFacultyIntroData<?php echo $table_row;?>">
													      	<td>
															    <div class="form-group row">
															        <div class="col-md-12">
															            <h6>Content Detail</h6>
															            <input type="hidden" name="college_general_info[<?php echo $table_row;?>][data_type]" value="ads">
															            <input type="hidden" name="college_general_info[<?php echo $table_row;?>][data_type_value]" value="<?php echo $table_row;?>">
															            <input type="number" class="form-control" name="college_general_info[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->info_serial;?>">
															            <textarea class="form-control" rows="40" name="college_general_info[<?php echo $table_row;?>][data_content]" style="display:none;"><?php echo $value->info_value;?></textarea>
															            <div class="col-md-12"><?php echo $value->info_value;?></div>
															        </div>
															    </div>
															    <div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trFacultyIntroData<?php echo $table_row;?>').remove()">Delete Row</button></div></div>
														   	</td>
													    	</tr>
														<?php
													}else if($value->info_value_type=='youtube'){

													}

													$table_row++;
												}
											}
											?>
											
										</table>
									</div>
								</div>                                                          
	                                    </div>
	                                    <!-- <div class="col-sm-12">
	                                      <button type="submit" class="btn btn-primary" id="btn_save_faculty_info">Save</button>
	                                  	</div -->
                                  	</div>

                                  	<div class="row">
							<div class="buy-now-wrapper" id="buttons_wrapper">
								<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_add_heading">Add Content</button>
								<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#specificFileBrowserModal" id="btn_add_media">Add Media</button>
								<button type="button" class="btn btn-dark btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#adsModal">Import Ads</button>
								<button type="submit" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_save_faculty_info">Save Data</button>
							</div>
						</div>
                            	</form>
                  </div>
            </div>
      </div>


	<div class="row">
		<div class="col-md-6 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College Faculty- [ <?php echo (!empty($college_data))?$college_data['college_name']:'';?> ]-[ Faculty Data]</h6>
					<form id="form_college_faculty">
						<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
						<input type="hidden" class="form-control" name="_faculty" value="<?php echo (!empty($college_data['college_faculties']))?encode_data($college_data['college_faculties']->faculty_id):'';?>">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">

						<div class="row">
      					<div class="col-sm-4">
      						<div class="form-group">
      							<label>Faculty Name</label>
									<input type="text" class="form-control" placeholder="Faculty Name" name="college_faculty_name" id="college_faculty_name" value="<?php echo (!empty($college_data['college_faculties']))?$college_data['college_faculties']->faculty_name:'';?>">
      						</div>
      					</div>
      					<div class="col-sm-4">
      						<div class="form-group">
      							<label>Faculty Email</label>
									<input type="text" class="form-control" placeholder="Faculty Email" name="college_faculty_email" id="college_faculty_email" value="<?php echo (!empty($college_data['college_faculties']))?$college_data['college_faculties']->faculty_email:'';?>">
      						</div>
      					</div>
      				
      					<div class="col-sm-4">
      						<div class="form-group">
      							<label>Faculty Phone No.</label>
									<input type="text" class="form-control" placeholder="Faculty Phone No" name="college_faculty_phone_no" id="college_faculty_phone_no" value="<?php echo (!empty($college_data['college_faculties']))?$college_data['college_faculties']->facullty_contact_no:'';?>">
      						</div>
      					</div>
      				</div>
      				<div class="row">
      					<div class="col-sm-4">
      						<div class="form-group">
      							<label>Faculty Experience</label>
									<input type="text" class="form-control" placeholder="Faculty Experience" name="college_faculty_experience" id="college_faculty_experience" value="<?php echo (!empty($college_data['college_faculties']))?$college_data['college_faculties']->faculty_academic_exp:'';?>">
      						</div>
      					</div>
      					<div class="col-sm-4">
      						<div class="form-group">
      							<label>Faculty Designation</label>
      							<select class="form-control" name="college_faculty_designation">
      								<option value="0">Select Designation</option>
      								<?php
      								if (!empty($college_data['college_designations'])) {
      									foreach ($college_data['college_designations'] as $key => $value) {
      										?>
      										<option value="<?php echo $value['designation_id'];?>" <?php echo $value['selected'];?>><?php echo $value['designation_name'];?></option>
      										<?php
      									}
      								}
      								?>
      							</select>
      						</div>
      					</div>
      					<div class="col-sm-4">
      						<div class="form-group">
      							<label>Faculty Department</label>
      							<select class="form-control" name="college_faculty_department">
      								<option value="0">Select Department</option>
      								<?php
      								if (!empty($college_data['college_departments'])) {
      									foreach ($college_data['college_departments'] as $key => $value) {
      										?>
      										<option value="<?php echo $value['department_id'];?>" <?php echo $value['selected'];?>><?php echo $value['department_name'];?></option>
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
      							<label class="control-label">Faculty Qualifications</label>
      							<select class="form-control" multiple="true"  name="college_faculty_qualifications[]" id="college_faculty_qualifications">
      							<?php
      							if(!empty($college_data['college_qualifications'])){
      								foreach ($college_data['college_qualifications'] as $_k => $_v) {
      									?>
      									<option value="<?php echo $_v['qualification_id'];?>" <?php echo $_v['selected'];?>><?php echo $_v['qualification_name'];?></option>
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
      							<label class="control-label">Faculty Subjects of Expertise</label>
      							<select class="form-control" multiple="true"  name="college_faculty_subjects[]" id="college_faculty_subjects">
            							<?php
            							if(!empty($college_data['college_subjects'])){
            								foreach ($college_data['college_subjects'] as $__k => $__v) {
            									?>
            									<option value="<?php echo $__v['subject_id'];?>" <?php echo $__v['selected'];?>><?php echo $__v['subject_name'];?></option>
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
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_college_faculty">Save</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
		<div class="col-md-6 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Faculties</h6>

					<div class="table-responsive">
						<table id="college_faculties_list_table" class="table">
							<thead>
		                      <tr>
	                      		<th>#</th>
		                        <th>Name</th>
		                        <!-- <th>Email</th> -->
		                        <!-- <th>Phone No.</th> -->
		                        <th>Status</th>
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
	<?php
	}
	?>
</div>

<script type="text/javascript">let _college='<?php echo (!empty($college_data))?$college_data['college_id']:'';?>'; let colleg_faq_row ='';var bposthdr='<?php echo ($table_row==0)?($table_row+1):$table_row;?>';var _ur='';var p_row='';var colleg_ranking_row='';var colleg_placement_faq_row ='';var colleg_scholarship_faq_row='';var college_type='<?php echo $college_type;?>';</script>


<script type="text/javascript">
	jQuery(function($) {
		'use strict';


		tiny_mce();


		$(document).on('click','#btn_add_media',function(){
		    localStorage.setItem('media_operation', 'add_college_faculty_media');
		});

		$(document).on('click','.btn_update_media',function(){
		    localStorage.setItem('media_operation', 'update_college_faculty_media');
		    localStorage.setItem('media_row',$(this).data('media_row'));
		});


		$('#adsModal').on('shown.bs.modal', function (e) {
		    $('#buttons_wrapper').css('display','none');
		    load_ads();
		});

		$('#adsModal').on('hidden.bs.modal', function (e) {
		    $('#buttons_wrapper').css('display','block');
		});

		$(document).on('click','.div_block',function(){
	      var d=$(this).html();
	      var datafile_id=$(this).attr('data-aid');
	      var heading_rows='';

	        heading_rows+='<tr id="trFacultyIntroData' + bposthdr + '">';
	      heading_rows+='<td>';
	      heading_rows+='<div class="form-group row">';
	        heading_rows+='<div class="col-md-12">';
	                heading_rows+='<h6>Content Detail</h6>';
	                heading_rows+='<input type="hidden" name="college_general_info['+ bposthdr +'][data_type]" value="ads">';
	                heading_rows+='<input type="hidden" name="college_general_info['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
	                heading_rows+='<input type="number" class="form-control" name="college_general_info['+ bposthdr +'][data_serial]" value="'+ bposthdr +'">';
	                heading_rows+='<textarea class="form-control" rows="40" name="college_general_info['+ bposthdr +'][data_content]" style="display:none;">'+d+'</textarea>';
	                heading_rows+='<div class="col-md-12">'+d+'</div>';
	              heading_rows+='</div>';
	          heading_rows+='</div>';
	      heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trFacultyIntroData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
	      heading_rows+='</td>';
	      heading_rows+='</tr>';

	      $('#data_heading_rows tbody').append(heading_rows);

	      tiny_mce();

	      $('#adsModal').modal('hide');

	      bposthdr++;
	  	});



			$(document).on('click','#btn_add_heading',function(){
		    var heading_rows='';

		    heading_rows+='<tr id="trFacultyIntroData' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		      heading_rows+='<div class="col-md-12">';
		              heading_rows+='<h6>Content Detail</h6>';
		              heading_rows+='<input type="hidden" name="college_general_info['+ bposthdr +'][data_type]" value="general">';
		              heading_rows+='<input type="number" class="form-control" name="college_general_info['+bposthdr+'][data_serial]" value="'+bposthdr+'">';
		              heading_rows+='<textarea class="form-control college_general_info" rows="40" name="college_general_info['+ bposthdr +'][data_content]"></textarea>';		              
		            heading_rows+='</div>';
		        heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-xs btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trFacultyIntroData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='</tr>';

		    $('#data_heading_rows tbody').append(heading_rows);

		    tiny_mce();

		    bposthdr++;
		});



		function load_ads(){
		    $('#ads_list_table').DataTable({ 
		      'bJQueryUI': false,
		      'stateSave': true,
		      'iDisplayLength':50,
		      'responsive': true,
		      "pagingType": "full_numbers",
		      'language': {
		        'paginate': {
		          'first': "<<", // This is the link to the first page
		          'previous': "<", // This is the link to the previous page
		          'next': ">", // This is the link to the next page
		          'last': ">>" // This is the link to the last page
		        }
		      },
		      "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
		      "processing": true, //Feature control the processing indicator.
		      "serverSide": true, //Feature control DataTables' server-side processing mode.
		      "order": [], //Initial no order.
		      // Load data for the table's content from an Ajax source
		      "ajax": {
		          "url": base_url+'/ads/search_import',
		          "type": "POST",
		          "data":{csrf_test_name:csrf_hash}
		      },
		      //Set column definition initialisation properties.
		      "columnDefs": [
		      { 
		          "targets": [ 0 ], //first column / numbering column
		          "orderable": false, //set not orderable
		      },
		      ],
		    });
		}

		function tiny_mce(){
		    tinymce.init({
		      selector: '.college_general_info',
		      entity_encoding : "raw",
		      height: 400,
		      theme: 'silver',
		      plugins: [
		        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
		        'searchreplace wordcount visualblocks visualchars code fullscreen table',
		      ],
		      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
		      toolbar2: 'forecolor backcolor emoticons | codesample',
		      table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
		      table_appearance_options: true,
		      table_use_colgroups: true,
		      link_quicklink: true,
		      default_link_target: '_blank',
		      link_context_toolbar: true,
		      link_default_protocol: 'https',
		      link_class_list: [
		        {title: 'None', value: ''},
		        {title: 'External Link', value: 'ext_link'},
		        {title: 'Internal Links',
		          menu: [
		            {title: 'Internal Support Link', value: 'int_sup_link'},
		            {title: 'Internal Marketing Link', value: 'int_mark_link'},
		            {title: 'Other Internal Link', value: 'int_other_link'}
		          ]
		        }
		      ],
		      link_list: [
		        {title: 'Connect to College Links',
		          menu: ''
		        },
		        {title: 'Connect to Exam Quick Links',
		          menu: ''
		        },
		        {title: 'Connect to Exam News',
		          menu: ''
		        },
		        {title: 'Connect to Course links',
		          menu: ''
		        },
		        {
		          title:'Connect to Blog Post Links',
		          menu:''
		        },
		        {
		          title:'Connect to Answer Paper',
		          menu:''
		        },
		        {
		          title:'Connect to Speaking Practice Paper',
		          menu:''
		        },
		        {
		          title:'Connect to Writing Practice Paper',
		          menu:''
		        },
		        {
		          title:'Connect to Listening Practice Paper',
		          menu:''
		        },
		        {
		          title:'Connect to Sample Practice Paper',
		          menu:''
		        }
		      ],
		      target_list: [
		        {title: 'None', value: ''},
		        {title: 'Same page', value: '_self'},
		        {title: 'New page', value: '_blank'},
		        {title: 'Parent frame', value: '_parent'}
		      ],
		      image_advtab: true,
		      templates: [{
		          title: 'Test template 1',
		          content: 'Test 1'
		        },
		        {
		          title: 'Test template 2',
		          content: 'Test 2'
		        }
		      ],
		      content_css: []
		    });
		}
	});
</script>