<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Ads List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">		
				<div class="card-body">
					<div class="card-title"><h6 class="card-title">Ads</h6></div>

						<div class="row">
							<div class="col-md-12">


								<form id="form_ads_add_edit_4" method="post" enctype="multipart/form-data">
								  		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
								  		<input type="hidden" name="ads_id" value="<?php echo (!empty($listing_data['listing_id']))?$listing_data['listing_id']:'';?>">
								  		<input type="hidden" name="ads_category" value="CUSTOM_IMG_ADS">
										<input type="hidden" name="ads_category_type" value="TYPE_1">
										<input type="hidden" name="ads_listing_grouped" value="2">
										<input type="hidden" name="ads_package_client_type" id="ads_package_client_type" value="6">
								  		<div class="row">
								  			<div class="col-sm-12">
								  				<label class="control-label">Ads Title</label>
								  				<input type="text" name="ads_name" class="form-control" value="<?php echo (!empty($listing_data))?$listing_data['listing_name']:'';?>">
								  			</div>
								  		</div>
								  		<div class="row">
											<div class="col-sm-12">
												<div class="form-group">
													<label class="control-label">Ads Short Description (If required)</label>
													<textarea class="form-control" rows="3" name="ads_short_desc" id="ads_short_desc"><?php echo (!empty($listing_data))?$listing_data['listing_short_desc']:'';?></textarea>
												</div>
											</div>
										</div>
								  		<div class="row">
											<div class="col-sm-3">
												<label class="control-label">Ads Type</label>
												<select class="ads_type" id="ads_type">
													<option value="GENERAL">General Ads</option>
													<option value="WAYTO_REVIEW_ADS">Wayto Review Ads</option>
												</select>
											</div>
											<div class="col-sm-9">
												<label class="control-label">Ads Page (Where the ads will be shown)</label>
												<input type="text" name="ads_page_link" class="form-control" value="<?php echo (!empty($listing_data))?$listing_data['listing_page_link']:'';?>">
											</div>
											
										</div>
										<div class="row">
											<div class="col-sm-12">
												<label class="control-label">Ads Link</label>
												<input type="text" name="ads_custom_link" class="form-control" value="<?php echo (!empty($listing_data))?$listing_data['listing_link']:'';?>">
											</div>
										</div>
										<div class="row">
											<div class="col-sm-6">
												<div class="form-group">
													<label>Ads Image (Desktop Version)</label>
													<input type="file" name="ads_image" class="file-upload-default">
													<div class="input-group col-xs-12">
														<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
														<span class="input-group-append">
															<button class="file-upload-browse btn btn-primary" type="button">Browse Image</button>
														</span>
													</div>
												</div>
											</div>
											<div class="col-sm-6">
												<div class="form-group">
													<label>Ads Image (Mobile Version)</label>
													<input type="file" name="ads_mobile_image" class="file-upload-default">
													<div class="input-group col-xs-12">
														<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
														<span class="input-group-append">
															<button class="file-upload-browse btn btn-primary" type="button">Browse Image</button>
														</span>
													</div>
												</div>
											</div>
										</div>
										

										<div class="row" style="padding:10px;">
											<div class="col-sm-6">
												<img src="<?php echo (!empty($listing_data['listing_imgae']))?$listing_data['listing_imgae']:'';?>" width="100%" class="img">
											</div>
											<div class="col-sm-6">
												<img src="<?php echo (!empty($listing_data['listing_mobile_imgae']))?$listing_data['listing_mobile_imgae']:'';?>" width="100%" class="img">
											</div>
										</div>
										<div class="row">
											<div class="col-sm-3">
												<div class="form-group">
													<label class="control-label">Ads Type</label>
													<select class="form-control" name="ads_package_category" id="ads_package_category">
														<option value="0">Select Type</option>
														<?php
														if(!empty($ads_categories)){
															foreach ($ads_categories as $key => $value) {
																?>
																<option value="<?php echo $value->package_category_id;?>" <?php echo (!empty($listing_data) && $value->package_category_id==$listing_data['listing_type'])?'selected':'';?>><?php echo $value->package_category_name;?></option>
																<?php
															}
														}
														?>
													</select>
												</div>
											</div>
											<div class="col-sm-9">
												<label class="control-label">Ads Page Type (in which page ads will be shown)</label>
												<select class="form-control" name="ads_page_type">
													<?php
													if(!empty($_get_listing_pacakge_type)){
														foreach ($_get_listing_pacakge_type as $key => $value) {
															?>
															<option value="<?php echo $value['package_type_id'];?>" <?php echo $value['selected'];?>><?php echo $value['package_type_name'];?></option>
															<?php
														}
													}
													?>
												</select>
											</div>
											

										</div>

										<div class="row">
											<div class="col-sm-3">
												<label class="control-label">Start Date</label>
												<input type="text" class="form-control" name="ads_start_date" id="ads_start_date" value="<?php echo (!empty($listing_data))?$listing_data['listing_package_start_date']:'';?>">
											</div>
											<div class="col-sm-3">
												<label class="control-label">End Date</label>
												<input type="text" class="form-control" name="ads_end_date" id="ads_end_date" value="<?php echo (!empty($listing_data))?$listing_data['listing_package_end_date']:'';?>">
											</div>
											<div class="col-sm-3">
												<label class="control-label">Track</label>
												<select class="form-control" name="ads_track_status">
													<option value="1" <?php echo (!empty($listing_data) && ($listing_data->listing_track=='1'))?'selected':'';?>>Yes</option>
													<option value="2" <?php echo (!empty($listing_data) && ($listing_data->listing_track=='2'))?'selected':'';?>>No</option>
												</select>
											</div>
											<div class="col-sm-3">
												<label class="control-label">Published</label>
												<select class="form-control" name="ads_published">
													<option value="1" <?php echo (!empty($listing_data) && ($listing_data->listing_status=='1'))?'selected':'';?>>Yes</option>
													<option value="2" <?php echo (!empty($listing_data) && ($listing_data->listing_status=='2'))?'selected':'';?>>No</option>
												</select>
											</div>
										</div>

										<div class="row">
											<div class="col-sm-12">
												<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_custom_free_image_ads">Save</button>
											</div>
										</div>
								  	</form>




								
							</div>
						</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div id="adsgroup_list_table"></div>

<style type="text/css">
.bodyslot-new {
    background: #F5F8F9;
    padding-bottom: 16px;
    margin-top: 0;
    margin-bottom: 10px;
}

.live-form-container-new .live-form-heading--icon {
    height: 30px;
    width: 30px;
    margin-right: 10px;
}
.live-form-container-new h4 {
    padding: 16px;
    text-transform: uppercase;
    color: #000;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    background: #f5f8f9;
}

.live-form-container-new .live-form-heading--icon svg {
    height: 30px;
    width: 30px;
}

.live-form-container-new h4 .sponsored {
    font-size: 13px;
    background: #ef233f1f;
    border-radius: 30px;
    color: #EF233F;
    padding: 5px 20px;
}
  
  .live-form-container-new .live-form-body-row {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    box-shadow: 0 0 4px 0 #cfcfcf80;
    border-radius: 4px 4px 0px 0px;
    overflow-x: scroll;
}

.live-form-container-new {
    overflow: hidden;
    text-align: initial;
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 #cfcfcf80;
    border-radius: 4px;
}
  
  .ads_body_live_form_container{
    -webkit-text-decoration: none;
    text-decoration: none;
    margin: 0 auto 0px;
    max-width: 100%;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .live-form-container-new {
    overflow: hidden;
    text-align: initial;
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 #cfcfcf80;
    border-radius: 4px;
  }
  
  .ads_live_form_desktop_tnew{
    -webkit-text-decoration: none;
    text-decoration: none;
    margin: 0 auto 0px;
    max-width: 100%;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  
  .ads_live_form_desktop_tnew {
    background: #fff;
    position: relative;
    min-height: 100px;
    height: 100%;
    display: block;
    font-size: 14px;
    line-height: 18px;
    color: #333;
    font-weight: 400;
    flex: 1;
    padding: 16px;
    padding-top: 12px;
    text-align: left;
    border-right: 1px solid #00000012;
}

.live-form-container-new .ads_body_live_form_container:nth-child(odd) a .ads_bottom_border {
    background: #ff7900;
}
.live-form-container-new .ads_body_live_form_container:nth-child(even) a .ads_bottom_border {
    background: #4FB8DD;
}

a.ads-live-form-review-banner .ads-bottom-border {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 5px;
    background: #ff7900 !important;
}
  a.ads_live_form_desktop_tnew:last-child {
    border-right: 1px  solid #00000012;
  }
  .top-section {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  .top-section.logo {
      border: 2px  solid #E7EBEF;
      height: 48px;
      width: 48px;
      min-width: 48px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 12px;
  }
  .top-section .college_name {
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: #4FB8DD;
    height: 42px;
    overflow: hidden;
  }
  .ads_live_form_desktop_tnew .extra_info, .ads_live_form_desktop_tnew:hover .extra_info {
    color: #333;
  }
  .extra_info {
    height: 72px;
    overflow: hidden;
  }
  .info-section .admission_info {
    line-height: 17px;
    color: #1BCE90;
    margin-top: 4px;
    height: 32px;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }
  .apply-btn {
    text-align: center;
  }
  .ads_live_form_desktop_tnew .apply, .ads_live_form_desktop_tnew .apply:hover {
    background: #ff7900;
    display: inline-block;
    font-size: 14px;
    color: #fff;
    min-width: 220px;
    text-align: center;
    text-transform: uppercase;
    border-radius: 4px;
    padding: 6px;
    margin-top: 8px;
  }
  .ads_live_form_desktop_tnew .ads_bottom_border {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 5px;
  }
  a.ads-live-form-review-banner {
    min-height: 210px;
    min-width: 255px;
    height: 100%;
    color: #333;
    padding: 16px 16px 20px 16px;
    background: #FFF8F1;
}
</style>

<script type="text/javascript">
	var p_row='';
	var parent_folder='<?php echo $parent_folder_data->media_disk_name;?>';
	var review_link='<?php echo base_url('reviews/write');?>';
	var ads_default_title='';
</script>