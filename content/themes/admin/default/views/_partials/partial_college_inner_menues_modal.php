<div class="modal fade bd-example-modal-xl modal-fullscreen" id="collegeInnerMenuesModal" tabindex="-1" role="dialog" aria-labelledby="collegeInnerMenuesModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="collegeInnerMenuesModal">Inner Menues</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            
            <div class="modal-body">
            	<div class="row">
            		<div class="col-md-12">
		            	<form id="form_college_inner_menues">            	
		            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            		<input type="hidden" class="form-control" name="menu_data_type_id" id="menu_data_type_id" value="">
		            		<input type="hidden" class="form-control" name="menu_data_type" id="menu_data_type" value="">
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
													<option value="<?php echo $value->menu_type_id;?>" data-menu="<?php echo $value->menu_type_name;?>"><?php echo $value->menu_type_name;?></option>
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
										<input type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_name" id="college_inner_menu_name" value="">
									</div>
								</div>
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">Menu Serial</label>
										<input type="text" class="form-control" placeholder="Enter Serial" name="college_inner_menu_serial" id="college_inner_menu_serial" value="">
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Menu Status</label>
										<select class="form-control" name="college_inner_menu_status" id="college_inner_menu_status">
											<option value="0">Select menu status</option>
											<option value="1">Active</option>
											<option value="2">Inactive</option>
										</select>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-6 menu_des_div">
				            		<div class="form-group">
										<label class="control-label">Menu page heading</label>
										<textarea type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_page_heading" id="college_inner_menu_page_heading" rows="3"></textarea>
									</div>
								</div>

								<div class="col-sm-6 menu_des_div">
				            		<div class="form-group">
										<label class="control-label">Menu Meta Title</label>
										<textarea type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_meta_title" id="college_inner_menu_meta_title" rows="3"></textarea>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-6 menu_des_div">
				            		<div class="form-group">
										<label class="control-label">Menu Meta Description</label>
										<textarea type="text" class="form-control" placeholder="Enter Menu Meta Description" name="college_inner_menu_meta_description" id="college_inner_menu_meta_description" rows="5"></textarea>
									</div>
								</div>

								<div class="col-sm-6 menu_des_div">
				            		<div class="form-group">
										<label class="control-label">Menu Meta Keywords</label>
										<input type="text" class="form-control" placeholder="Enter Menu Meta Keywords" name="college_inner_menu_meta_keywords" id="college_inner_menu_meta_keywords">
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-6 menu_des_div">
				            		<div class="form-group">
										<label class="control-label">Menu OG Title</label>
										<textarea type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_og_title" id="college_inner_menu_og_title" rows="3"></textarea>
									</div>
								</div>
				
								<div class="col-sm-6 menu_des_div">
				            		<div class="form-group">
										<label class="control-label">Menu OG Description</label>
										<textarea type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_og_description" id="college_inner_menu_og_description" rows="3"></textarea>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12 menu_des_div">
				            		<div class="form-group">
										<label class="control-label">Page Search Heading</label>
										<textarea type="text" class="form-control" placeholder="Enter Page Search Heading" name="college_data_search_title" id="college_data_search_title" rows="3"></textarea>
									</div>
								</div>
							</div>

							<div class="row">							
								<div class="col-sm-12 menu_des_div">
				            		<div class="form-group">
										<label class="control-label">Select Page Widgets</label><br>
										<input type="text" name="college_menu_widgets" placeholder="Select widgets from list below">
										
									</div>
								</div>
							</div>

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
									<button type="submit" class="btn btn-primary" id="btn_college_inner_menues">Save</button>
								</div>
							</div>

							<!-- <div class="col-md-12">
								<div class="alert alert-info">
									<strong>Note:</strong>If Custom link given then auto generated will be replaced with it.
								</div>
							</div>

							<div class="col-md-12">
								<label class="control-label">Custom Link</label>
								<selct class="form-control" name="custom_link">
									
								</selct>

							</div> -->
		            	</form>
	            	</div>
	            </div>
	            <div class="row" style="margin-top: 50px;border-top:1px solid #000000;">
	                <div class="table-responsive">
						<table id="college_menu_type_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Menu Type</th>
		                        <th>Menu Name</th>
		                        <th>Action</th>
		                        <th>Menu URL</th>			                        
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
<style type="text/css">
	#college_menu_widgets_chosen,#college_inner_menu_other_link_chosen{
		width: 100% !important;
	}
	/*.customSuggestionsList > div{
  max-height: 300px;
  min-height: 50px;
  border: 2px solid pink;
  overflow: auto;
}

.customSuggestionsList .empty{
  color: #999;
  font-size: 20px;
  text-align: center;
  padding: 1em;
}*/
</style>

<script type="text/javascript">
	<?php

	if(!empty($college_widgets)){
		foreach ($college_widgets as $key => $value) {
			$wd[]='"'.$value.'#'.$key.'"';
		}

		$_wd=char_separated($wd);
	}
	?>
</script>
<?php
	

?>


<script type="text/javascript">
	jQuery(function($) {
  		'use strict';

  		// The DOM element you wish to replace with Tagify
		  var input = document.querySelector('input[name=college_inner_menu_meta_keywords]');

		  // initialize Tagify on the above input node reference
		new Tagify(input);


		//Widget Section
		var input = document.querySelector('input[name=college_menu_widgets]'),
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

  		$('#form_college_inner_menues').validate({
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
	          data:$('#form_college_inner_menues').serialize(),
	          beforeSend:function(){
	             $('#btn_college_inner_menues').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	          },
	          success:function(d){
	            if(d.success){

	              var cid=$(this).attr('data-cid');
	              var menu_id=$(this).attr('data-aid');
	              var menu_type_name=$(this).attr('data-menu_name');

	              $.ajax({
	                type:'POST',
	                url:base_url+'/institutions/colleges/inner_menu_update',
	                data:{csrf_test_name:csrf_hash,cid:cid,menu_id:menu_id,menu_type_name:menu_type_name},
	                success:function(d){
	                }
	              });

	              Swal.fire({
	                icon: 'success',
	                title: d.success,
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
	              });
	              $('#form_college_inner_menues')[0].reset();
	              $('#form_college_inner_menues').find('#college_inner_menu_name').val('');
	              $('#form_college_inner_menues').find('#college_inner_menu_id').val('');
	              $('#form_college_inner_menues').find('#college_inner_menu_serial').val('');
	              var table=$('#college_menu_type_list_table').DataTable();
	              table.ajax.reload( null, false );
	              $('#btn_college_inner_menues').html('Save').attr('disabled',false);
	            }else{
	              Swal.fire({
	                icon: 'error',
	                title: d.error,
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
	              });
	              $('#btn_college_inner_menues').html('Save').attr('disabled',false);
	            }
	          }
	        });
	      }
	    });

	});
</script>