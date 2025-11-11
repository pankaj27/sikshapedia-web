<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="row">
	<?php
	if(!empty($inner_menues)){
		?>
		<div class="col-lg-3">
			<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
				<?php
				if(!empty($inner_menues)){
					$i=0;
					foreach ($inner_menues as $key => $value) {
						?>
						<a class="nav-link <?php echo ($i==0)?'active':'';?>" id="v-pills-<?php echo $value[0]['menu_alias'];?>-tab" data-toggle="pill" href="#v-pills-<?php echo $value[0]['menu_alias'];?>" role="tab" aria-controls="v-pills-<?php echo $value[0]['menu_alias'];?>" aria-selected="true"><?php echo $value[0]['menu_name'];?></a>
						<?php
						$i++;
					}
				}

				?>
			</div>
		</div>
		<div class="col-lg-9">
			<div class="tab-content" id="v-pills-tabContent">
				<?php

				if(!empty($inner_menues)){
					$j=0;
					foreach ($inner_menues as $key => $value) {
						?>
						<div class="tab-pane fade <?php echo ($j==0)?'show active':'';?>" id="v-pills-<?php echo $value[0]['menu_alias'];?>" role="tabpanel" aria-labelledby="v-pills-<?php echo $value[0]['menu_alias'];?>-tab">
							<div class="panel-heading">
							</div>
							<div class="panel-body">
								<form id="form_college_<?php echo $value[0]['menu_alias'];?>_meta">
									<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
				            		<input type="hidden" name="_college" id="_college" value="<?php echo $college_id;?>">
				            		<input type="hidden" name="menu_type" value="<?php echo $value[0]['menu_alias'];?>">
				            		<input type="hidden" name="menu_link" value="<?php echo $value[0]['menu_slug']->url_value;?>">
				            		<div class="row">
				            			<div class="col-md-12">
						            		<div class="form-group">
												<label>College <?php echo strtoupper($value[0]['menu_name']);?> Page Structure Data <button type="button" class="btn btn-primary btn_gen_struct_data" data-menu_link="<?php echo $value[0]['menu_slug']->url_value;?>" data-college_id="<?php echo $college_id;?>" data-menu_struct_type="CollegeOrUniversity">Generate</button></label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> page heading" name="college_page_CollegeOrUniversity_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" id="college_page_CollegeOrUniversity_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="30"><?php echo $CollegeOrUniversity_json_ld;?></textarea>
											</div>
										</div>										
									</div>
									<hr>
									<div class="row">
										<div class="col-md-12">
						            		<div class="form-group">
												<label>College <?php echo strtoupper($value[0]['menu_name']);?> Page Breadcrumb List <button type="button" class="btn btn-primary btn_gen_struct_data" data-menu_link="<?php echo $value[0]['menu_slug']->url_value;?>" data-college_id="<?php echo $college_id;?>" data-menu_struct_type="BreadcrumbList">Generate</button></label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> page heading" name="college_page_BreadcrumbList_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" id="college_page_BreadcrumbList_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="30"><?php echo $BreadcrumbList_jsopn_ld;?></textarea>
											</div>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-md-12">
						            		<div class="form-group">
												<label>College <?php echo strtoupper($value[0]['menu_name']);?> Page Article Structure Data <button type="button" class="btn btn-primary btn_gen_struct_data" data-menu_link="<?php echo $value[0]['menu_slug']->url_value;?>" data-college_id="<?php echo $college_id;?>" data-menu_struct_type="Article">Generate</button></label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> page heading" name="college_page_Article_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" id="college_page_Article_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="30"><?php echo $Article_json_ld;?></textarea>
											</div>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-md-12">
											<button type="submit" class="btn btn-primary" id="btn_update_college_<?php echo $value[0]['menu_alias'];?>_meta">Update Page Structure Data</button>
										</div>
									</div>
								</form>
							</div>
						</div>
							
						<?php
						$j++;
					}
				}

				?>
			</div>
		</div>
		<?php
	}
	?>
</div>

<script type="text/javascript">
	$(document).ready(function(){
		<?php
			if(!empty($inner_menues)){
				foreach ($inner_menues as $key => $value) {
					?>
					$('#form_college_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>_meta').validate({
						rules:{
							college_page_CollegeOrUniversity_<?php echo decode_data($college_id);?>_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>:{
								required:true
							},
							college_page_BreadcrumbList_<?php echo decode_data($college_id);?>_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>:{
								required:true
							},
							college_page_Article_<?php echo decode_data($college_id);?>_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>:{
								required:true
							}
						},
						messages:{
							college_page_CollegeOrUniversity_<?php echo decode_data($college_id);?>_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>:{
								required:'Data is blank'
							},
							college_page_BreadcrumbList_<?php echo decode_data($college_id);?>_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>:{
								required:'Data is blank'
							},
							college_page_Articley_<?php echo decode_data($college_id);?>_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>:{
								required:'Data is blank'
							}
						},
						submitHandler:function(){
							var college_page_CollegeOrUniversity=$('#college_page_CollegeOrUniversity_<?php echo decode_data($college_id);?>_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>').val();
							var college_page_BreadcrumbList=$('#college_page_BreadcrumbList_<?php echo decode_data($college_id);?>_<?php echo str_replace('-','_',$value[0]['menu_alias']);?>').val();
							$.ajax({
								type:'POST',
								url:base_url,
								data:{[csrf_name]:csrf_hash,college_page_CollegeOrUniversity:college_page_CollegeOrUniversity,college_page_BreadcrumbList:college_page_BreadcrumbList,college_page_Article:college_page_Article},
								beforeSend:function(){
						          $('#btn_update_college_<?php echo $value[0]['menu_alias'];?>_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
						        },
								success:function(d){
						          if(d.success){
						            Swal.fire({
						              icon: 'success',
						              title: d.success,
						              confirmButtonText:'Close',
						              confirmButtonColor:'#69da68',
						              allowOutsideClick: false,
						            });
						            var table=$('#seo_college_strcu_data_list_table').DataTable();
						            table.ajax.reload( null, false );
						          }else{
						            Swal.fire({
						              icon: 'error',
						              title: d.error,
						              confirmButtonText:'Close',
						              confirmButtonColor:'#69da68',
						              allowOutsideClick: false,
						            });
						          }
						        },
						        complete:function(){
						          $('#btn_update_college_<?php echo $value[0]['menu_alias'];?>_meta').html('Update <?php echo $value[0]['menu_name'];?> Meta').prop('disabled',false);
						        }
							});
						}
					});
					<?php
				}
			}
		?>


		$('body').on('click','.btn_gen_struct_data',function(){
			var _college=$(this).data('college_id');
			var menu_type=$(this).data('menu_struct_type');
			var menu_link=$(this).data('menu_link');

			$.ajax({
				type:'POST',
				uel:base_url+'/seo_college_structured_data_generate',
				data:{[csrf_name]:csrf_hash,_college:_college,menu_type:menu_type,menu_link:menu_link},
				success:function(d){
					console.log(d.stucture_data)
				}
			});
		});



	});
</script>
