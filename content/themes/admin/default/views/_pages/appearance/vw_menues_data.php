<div class="row">
	<ol class="list-unstyled sortable">
		<?php
		if(!empty($menues)){
			$i=1;
			foreach ($menues as $k => $v){
				?>
				<li class="sort">
					<div class="card" style="width:100% !important;">
						<div class="card-header p-2">
							<div class="row form-inline">
								<div class="col-sm-1"> <i class="fas fa-bars handle"></i> </div>
								<div class="col-sm-10"> <strong><?php echo $v['menu_name'];?></strong> [ To change the order of the menues Drag the panel up or down to set menu orders. ]</div>
								<div class="col-sm-1 text-right">
									<i class="fas fa-chevron-down" style="cursor:pointer" data-toggle="collapse" data-target="#row-<?php echo $k;?>" aria-expanded="false" aria-controls="row-<?php echo $k;?>"></i>
								</div>
							</div>
						</div>
						<div class="collapse" id="row-<?php echo $k;?>">
							<div class="card-body">
								<form id="form_<?php echo $value->menu_category_name_alias;?>">
									<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
									<input type="hidden" name="menu_type" value="<?php echo $value->menu_category_name_alias;?>">
									<div class="row">
										<div class="col-md-8">
						            		<div class="form-group">
												<label>Menu Name</label>
												<input type="text" value="<?php echo $i;?>">
												<input type="text" class="form-control" name="<?php echo $value->menu_category_name_alias;?>_name" value="<?php echo $v['menu_name']?>">
											</div>
										</div>																	
										<div class="col-md-4">
						            		<div class="form-group">
												<label>Active</label>
												<select class="form-control" name="<?php echo $value->menu_category_name_alias;?>_status">
													<option value="1" <?php echo ($v['menu_status']==1)?'selected':'';?>>Yes</option>
													<option value="2" <?php echo ($v['menu_status']==2)?'selected':'';?>>No</option>
												</select>
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-md-12">
						            		<div class="form-group">
												<label>Menu Link</label>
												<input type="text" class="form-control" name="<?php echo $value->menu_category_name_alias;?>_link" value="<?php echo $v['menu_link']?>">
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-md-6">
						            		<div class="form-group">
												<label>Meta Title</label>
												<textarea class="form-control" rows="3" name="<?php echo $value->menu_category_name_alias;?>_meta_title"><?php echo $v['menu_meta_title']?></textarea>
											</div>
										</div>
										<div class="col-md-6">
						            		<div class="form-group">
												<label>Meta Description</label>
												<textarea class="form-control" rows="3" name="<?php echo $value->menu_category_name_alias;?>_meta_desc"><?php echo $v['menu_mete_desc']?></textarea>
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-md-12">
						            		<div class="form-group">
												<label>Meta Keywords</label>
												<textarea class="form-control" rows="3" name="<?php echo $value->menu_category_name_alias;?>_meta_keywords"><?php echo $v['menu_meta_keywords']?></textarea>
											</div>
										</div>
									</div>
									<div class="row">
										<button type="submit" class="btn btn-primary text-white font-weight-bold btn-icon-text" id="btn_<?php echo $value->menu_category_name_alias;?>"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</li>
				<?php
				$i++;
			}
		}
		?>
	</ol>
</div>