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
						<a class="nav-link inner_menu_link <?php echo ($i==0)?'active':'';?>" id="v-pills-<?php echo $value[0]['menu_alias'];?>-tab" data-toggle="pill" href="#v-pills-<?php echo $value[0]['menu_alias'];?>" role="tab" aria-controls="v-pills-<?php echo $value[0]['menu_alias'];?>" aria-selected="true"><?php echo $value[0]['menu_name'];?></a>
						<?php
						$i++;
					}
				}
				?>
				<a class="nav-link inner_menu_link" id="v-pills-logo-banner-tab" data-toggle="pill" href="#v-pills-logo-banner" role="tab" aria-controls="v-pills-logo-banner" aria-selected="true">LOGO & BANNER</a>
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
							<!-- <div class="panel-heading">
								<button type="button" class="btn btn-sm btn-primary btn_gen_meta" data-menu_name="<?php echo $value[0]['menu_name'];?>" data-ci="<?php echo decode_data($college_id);?>" data-college="<?php echo $college_id;?>" data-menu_type="<?php echo $value[0]['menu_alias'];?>" id="genmeta_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>">Generate <?php echo $value[0]['menu_name'];?> Meta</button>
							</div> -->
							<div class="panel-body">
								<form id="form_college_<?php echo str_replace('-', '_',$value[0]['menu_alias']);?>_meta">
									<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
				            		<input type="hidden" name="_college" id="_college" value="<?php echo $college_id;?>">
				            		<input type="hidden" name="menu_type" value="<?php echo $value[0]['menu_alias'];?>">
				            		<input type="hidden" name="menu_id" value="<?php echo $value[0]['menu_id'];?>">
				            		<div class="row">
				            			<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">Page Link</label>
												<input class="form-control" type="text" placeholder="" value="<?php echo $value[0]['menu_slug']->url_value;?>">
											</div>
										</div>
										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">Canonical Link</label>
												<input type="text" class="form-control" placeholder="" value="<?php echo $value[0]['menu_slug']->url_canonical_value;?>">
											</div>
										</div>
				            			<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College Page Heading</label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> page heading" name="college_page_heading" id="college_page_heading_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="5"><?php echo $value[0]['menu_slug']->url_page_heading;?></textarea>
											</div>
										</div>
										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College <?php echo $value[0]['menu_name'];?> Meta Heading/Title</label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> meta heading" name="college_meta_heading" id="college_meta_heading_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="5"><?php echo $value[0]['menu_slug']->url_meta_heading;?></textarea>
											</div>
										</div>
										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College <?php echo $value[0]['menu_name'];?> Meta Title</label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> meta heading" name="college_meta_title" id="college_meta_title_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="5"><?php echo $value[0]['menu_slug']->url_meta_title;?></textarea>
											</div>
										</div>
										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College <?php echo $value[0]['menu_name'];?> Meta Keywords</label>
												<input class="form-control txt_meta_keywords" placeholder="Enter <?php echo $value[0]['menu_name'];?> meta keys" name="college_meta_keywords" id="college_meta_keywords_<?php echo decode_data($college_id);?>_<?php echo str_replace('-', '_',$value[0]['menu_alias']);?>" value="<?php echo $value[0]['menu_slug']->url_meta_key_words;?>">
											</div>
										</div>
										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College <?php echo $value[0]['menu_name'];?> Meta Desc</label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> meta desc" name="college_meta_desc" id="college_meta_desc_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="5"><?php echo $value[0]['menu_slug']->url_meta_desc;?></textarea>
											</div>
										</div>
										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College <?php echo $value[0]['menu_name'];?> OG Title</label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> og title" name="college_og_title" id="college_og_title_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="5"><?php echo $value[0]['menu_slug']->url_og_title;?></textarea>
											</div>
										</div>
										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College <?php echo $value[0]['menu_name'];?> OG Desc</label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> og description" name="college_og_desc" id="college_og_desc_<?php echo decode_data($college_id);?>_<?php echo $value[0]['menu_alias'];?>" rows="5"><?php echo $value[0]['menu_slug']->url_og_desc;?></textarea>
											</div>
										</div>
										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College <?php echo $value[0]['menu_name'];?> Search Title</label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> search title" name="college_search_title" id="college_search_title_<?php echo decode_data($college_id);?>" rows="5"><?php echo $value[0]['menu_search_page_title'];?></textarea>
											</div>
										</div>

										<div class="col-md-12">
						            		<div class="form-group">
												<label class="lbl_strong">College <?php echo $value[0]['menu_name'];?> Schema Data</label>
												<textarea class="form-control" placeholder="Enter <?php echo $value[0]['menu_name'];?> Schema Data" name="college_schema_data" id="college_schema_data_<?php echo decode_data($college_id);?>" rows="20"><?php echo $value[0]['menu_article_struct_data']->slug_type_json_ld_data;?></textarea>
											</div>
										</div>

										<div class="col-md-12">
											<button type="submit" class="btn btn-primary" id="btn_update_college_<?php echo $value[0]['menu_alias'];?>_meta">Update <?php echo $value[0]['menu_name'];?> Meta</button>
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
				<div class="tab-pane fade" id="v-pills-logo-banner" role="tabpanel" aria-labelledby="v-pills-logo-banner-tab">
					<div class="panel-body">
						<form id="form_college_logo_banner_meta">
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
				            <input type="hidden" name="_college" id="_college" value="<?php echo $college_id;?>">
				            <div class="row">
				            	<div class="col-md-12">
				            		<div class="form-group">
										<div class="d-flex align-items-start">
											<div class="col-md-2">
												<img src="<?php echo $college_logo;?>" class="wd-100 wd-sm-200 me-3" alt="...">
											</div>
											<div class="col-md-10">
												<div class="form-group">
													<label class="lbl_strong">Logo File Name</label>
													<div class="input-group mb-3">
													  <input type="text" class="form-control" name="seo_logo_file_name" placeholder="" value="<?php echo  $logo_name;?>">
													  <div class="input-group-append">
													    <span class="input-group-text" id="basic-addon2">.<?php echo $logo_extension;?></span>
													  </div>
													</div>
												</div>
											
												<div class="form-group">
													<label class="lbl_strong">Logo Alt Text</label>
													<input type="text" class="form-control" name="seo_logo_alt_text" placeholder="No alt text given" value="<?php echo $college_logo_alt_name;?>">
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<div class="d-flex align-items-start">
											<div class="col-md-2">
												<img src="<?php echo $college_banner;?>" class="wd-100 wd-sm-200 me-3" alt="...">
											</div>
											<div class="col-md-10">
												<div class="form-group">
													<label class="lbl_strong">Banner File Name</label>
													<div class="input-group mb-3">
													  <input type="text" class="form-control" name="seo_banner_file_name" placeholder="" value="<?php echo $banner_name;?>">
													  <div class="input-group-append">
													    <span class="input-group-text" id="basic-addon2">.<?php echo $banner_extension;?></span>
													  </div>
													</div>
												</div>												
												<div class="form-group">
													<label class="lbl_strong">Banner Alt Text</label>
													<input type="text" class="form-control" name="seo_banner_alt_name" placeholder="No alt text given" value="<?php echo $college_banner_alt_name;?>">
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-12">
									<div class="form-group">
										<div class="d-flex align-items-start">
											<button type="submit" class="btn btn-primary" id="btn_update_college_logo_banner_meta">Update Logo & Banner Meta Data</button>
										</div>
									</div>
								</div>
				            </div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<?php
	}else{
		?>
		<div class="col-md-12 alert alert-info">There is inner menues created for this college.In order to generate meta inner menues needs to be created first.</div>
		<?php
	}

	?>
		
</div>

<style type="text/css">
	.lbl_strong{
		font-weight: bold;
	}
</style>


<script type="text/javascript">
	
	$(document).ready(function(){

		<?php
		if(!empty($inner_menues)){
			foreach ($inner_menues as $key => $value){
				?>
				 var keywordInputs_<?php echo decode_data($college_id);?>_<?php echo str_replace('-', '_',$value[0]['menu_alias']);?> = document.getElementById('college_meta_keywords_<?php echo decode_data($college_id);?>_<?php echo str_replace('-', '_',$value[0]['menu_alias']);?>');
		        // // Iterate over each textarea and initialize Tagify
		         new Tagify(keywordInputs_<?php echo decode_data($college_id);?>_<?php echo str_replace('-', '_',$value[0]['menu_alias']);?>);
				$('#form_college_<?php echo str_replace('-', '_',$value[0]['menu_alias']);?>_meta').validate({
					rules:{
						college_meta_heading:{
				  			required:true
				  		},
				  		college_meta_title:{
				  			required:true
				  		},
				  		college_meta_keywords:{
				  			required:true
				  		},
				  		college_meta_desc:{
				  			required:false
				  		},
				  		college_og_title:{
				  			required:true
				  		},
				  		college_og_desc:{
				  			required:false
				  		}
				  	},
				  	messages:{
				  		college_meta_heading:{
				  			required:'Please enter meta heading'
				  		},
				  		college_meta_title:{
				  			required:'Please enter meta title'
				  		},
				  		college_meta_keywords:{
				  			required:'Please enter meta keywords'
				  		},
				  		college_meta_desc:{
				  			required:'Please enter meta description'
				  		},
				  		college_og_title:{
				  			required:'Please enter og title'
				  		},
				  		college_og_desc:{
				  			required:'Please enter og description'
				  		}
				  	},
				  	submitHandler:function(){
				    	$.ajax({
					        type:'POST',
					        url:base_url+'/seo/colleges/add_meta',
					        data:$('#form_college_<?php echo $value[0]['menu_alias'];?>_meta').serialize(),
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
					            var table=$('#seo_college_list_table').DataTable();
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
			?>
			$('body').on('click','.btn_gen_meta',function(){
				var _college=$(this).attr('data-college');
				var ci=$(this).attr('data-ci');
				var menu_type=$(this).attr('data-menu_type');
				var menu_name=$(this).attr('data-menu_name');
				$.ajax({
			        type:'POST',
			        url:base_url+'/seo/colleges/generate_meta',
			        data:{csrf_test_name:csrf_hash,_college:_college,menu_type:menu_type},
			        beforeSend:function(){
			          $('#genmeta_'+ci+'_'+menu_type).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
			            var table=$('#seo_college_list_table').DataTable();
			            table.ajax.reload( null, false );

			            //console.log(d.slug_data.url_og_title);

			            $('#college_og_title_'+ci+'_'+menu_type).text(d.slug_data.url_og_title);
						$('#college_meta_desc_'+ci+'_'+menu_type).text(d.slug_data.url_meta_desc);
						$('#college_meta_keywords_'+ci+'_'+menu_type).text(d.slug_data.url_meta_key_words);
						$('#college_meta_title_'+ci+'_'+menu_type).text(d.slug_data.url_meta_title);
						$('#college_meta_heading_'+ci+'_'+menu_type).text(d.slug_data.url_meta_heading);
						$('#college_page_heading_'+ci+'_'+menu_type).text(d.slug_data.url_page_heading);
						$('#college_og_desc_'+ci+'_'+menu_type).text(d.slug_data.url_og_desc);

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
			          $('#genmeta_'+ci+'_'+menu_type).html('Generate '+menu_name+' Meta').prop('disabled',false);
			        }
		      	});
			});
			<?php
		}
		?>

		$('#form_college_logo_banner_meta').validate({
			rules:{
				seo_logo_file_name:{
					required:true
				}
			},
			messages:{

			},
			submitHandler:function(){
				$.ajax({
			        type:'POST',
			        url:base_url+'/seo/colleges/add_logo_banner_meta',
			        data:$('#form_college_logo_banner_meta').serialize(),
			        beforeSend:function(){
			          $('#btn_update_college_logo_banner_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
			            var table=$('#seo_college_list_table').DataTable();
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
			          $('#btn_update_college_logo_banner_meta').html('Update Logo & Banner Metadata').prop('disabled',false);
			        }
		      	});
			}
		});
	});
</script>
