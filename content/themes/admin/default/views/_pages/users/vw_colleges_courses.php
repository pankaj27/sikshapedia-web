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
									<img src="<?php echo (!empty($college_banner))?$college_banner:'';?>" class="img-fluid" alt="profile cover" style="height: 300px;">
								</figure>
								<div class="cover-body d-flex justify-content-between align-items-center">
									<div>
										<img class="profile-pic" src="<?php echo (!empty($college_logo))?$college_logo:'';?>" alt="profile">
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
												<?php
												if(isset($college_id)){
													?>
													<button class="btn btn-xs btn-danger btn_del_college_inner_menu" type="button" data-cid="<?php echo $college_id;?>" data-aid="<?php echo encode_data($value['menu_id']);?>">Remove Menu</button>
													<?php
												}
												?>
												
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
			<div class="profile-page tx-13">
				<div class="row">
					<div class="col-12 grid-margin stretch-card">
						<div class="card">
							<div class="card-body">
								<h6 class="card-title">Course Section Introduction</h6>	

									<form id="form_college_courses_fees_intro">
									
									<div class="col-sm-12">
										<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
										<input type="hidden" name="college_type" value="2">
										<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
										<input type="hidden" name="college_info_type" value="3">
										<input type="hidden" name="college_details_type" value="general_info">
										<div class="form-group">
											<textarea class="form-control college_general_info" name="college_general_info" id="college_general_info" rows="10" >
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
			<div class="profile-page tx-13">
				<div class="row">
					<div class="col-md-12 grid-margin stretch-card">
						<div class="card">
							<div class="card-body">
								<h6 class="card-title">Courses & Fees <a href="<?php echo $admin_base_url;?>/institutions/colleges/courses/add/<?php echo (!empty($college_data))?$college_data['college_id']:'';?>" class="btn btn-sm btn-primary pull-right">Add</a></h6>

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
			</div>
		</div>
		<?php
	}

	$table_row=0;
	?>
</div>


<script type="text/javascript">let _college='<?php echo (!empty($college_data))?$college_data['college_id']:'';?>';var bposthdr='<?php echo ($table_row==0)?($table_row+1):$table_row;?>';var p_row='';var _ur='';var colleg_ranking_row='';var colleg_faq_row='';var colleg_placement_faq_row='';var colleg_scholarship_faq_row='';var college_type='<?php echo $college_data['college_type'];?>';</script>

<script type="text/javascript">
	jQuery(function($) {
  		'use strict';


  		tiny_mce('.college_general_info');

  		$(document).on('click','#btn_add_media',function(){
		    localStorage.setItem('media_operation', 'add_college_course_media');
		});

		$(document).on('click','.btn_update_media',function(){
		    localStorage.setItem('media_operation', 'update_college_course_media');
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

	        heading_rows+='<tr id="trCourseIntroData' + bposthdr + '">';
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
	      heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trCourseIntroData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
	      heading_rows+='</td>';
	      heading_rows+='</tr>';

	      $('#data_heading_rows tbody').append(heading_rows);

	      tiny_mce('.college_general_info');

	      $('#adsModal').modal('hide');

	      bposthdr++;
	  	});



  		$(document).on('click','#btn_add_heading',function(){
		    var heading_rows='';

		    heading_rows+='<tr id="trCourseIntroData' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		      heading_rows+='<div class="col-md-12">';
		              heading_rows+='<h6>Content Detail</h6>';
		              heading_rows+='<input type="hidden" name="college_general_info['+ bposthdr +'][data_type]" value="general">';
		              heading_rows+='<input type="number" class="form-control" name="college_general_info['+bposthdr+'][data_serial]" value="'+bposthdr+'">';
		              heading_rows+='<textarea class="form-control college_general_info" rows="40" name="college_general_info['+ bposthdr +'][data_content]"></textarea>';		              
		            heading_rows+='</div>';
		        heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-xs btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trCourseIntroData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='</tr>';

		    $('#data_heading_rows tbody').append(heading_rows);

		    tiny_mce('.college_general_info');

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