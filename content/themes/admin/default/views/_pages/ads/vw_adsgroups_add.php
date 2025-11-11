<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<script src="https://code.jquery.com/ui/1.13.0/jquery-ui.js"></script>
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
					<div class="card-title"><h6 class="card-title">Group Ads <a href="<?php echo $admin_base_url;?>/ads/add" class="btn btn-sm btn-primary pull-right" style="float:right;">Create Ads</a></h6></div>

					<hr>

					<form id="form_adsgroups_add_edit" method="post" enctype="multipart/form-data">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
						<input type="hidden" name="_ads" id="_ads" class="form-control" value="">
						<input type="hidden" name="ads_category" value="CUSTOM_HTML_ADS">
						<div class="row">
							<div class="col-sm-9">
								<div class="form-group">
									<input type="text" name="ads_name" id="adsgroup_name" class="form-control" value="<?php echo (!empty($listing_data))?$listing_data['listing_name']:'';?>" placeholder="Ads Title">
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<select class="form-control" name="ads_published">
										<option value="1">Published</option>
										<option value="2">unpublished</option>
									</select>
								</div>
							</div>
							
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="form-group">
									<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_adsgroups" style="float:right;">Save</button>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12" id="group_ads">
								<div class="live-form-body-row">
									<div class="live-form-container-new clearfix"><h4><span id="add_title"> Latest Application Forms 2021 </span> <span class="sponsored"> SPONSORED </span></h4>
										<div class="live-form-body-row" id="snaptarget"></div>
									</div>
								</div>
							</div>
						</div>
					</form>


					<div class="row" id="adsgroup_list_table">

						<p>Loading</p>
						
						
						
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">var ads_default_title='Latest Application Forms <?php echo date('Y');?>';var parent_folder='';var p_row</script>

<script>
  $( function() {
    // $( ".ads_body_live_form_container" ).draggable({ revert: "valid" });
    // $( "#snaptarget" ).droppable({
    //   accept: ".ads_body_live_form_container",
    //   drop: function( event, ui ) {
    //     var droppable = $(this);
    //    	var draggable = ui.draggable;
    //    // Move draggable into droppable
    //    droppable.find('p').remove();
    //    	draggable.appendTo(droppable);
    //     draggable.removeAttr('style');

    //   }
    // });
  } );
  </script>


<style type="text/css">
	#snaptarget { height: 300px; }
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