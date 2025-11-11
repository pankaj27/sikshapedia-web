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
					<h6 class="card-title">Ads</h6>
					<div class="col-md-12">
						<form id="form_ads_add_edit" method="post" enctype="multipart/form-data">
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<input type="hidden" name="_ads" id="_ads" class="form-control" value="<?php echo (!empty($listing_data))?$listing_data['listing_id']:'';?>">
							<div class="row">
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Ads Category</label>
										<select class="form-control" name="ads_package_category_type" id="ads_package_category_type">
											<option value="0">Select Category</option>
											<option value="CUSTOM_IMG_ADS">Custom Image Ads</option>
											<option value="CUSTOM_HTML_ADS">Custom Html Ads</option>
											<option value="CUSTOM_INNER_LINK_ADS">Custom Inner Link Ads</option>
											<option value="GOOGLE_ADSENSE">Google AdSense</option>
											<option value="AMAZON_ADS">Amazon Ads</option>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Ads Type</label>
										<select class="form-control" name="ads_package_category" id="ads_package_category">
											<option value="0">Select Type</option>
											<?php
											if(!empty($ads_categories)){
												foreach ($ads_categories as $key => $value) {
													?>
													<option value="<?php echo $value->package_category_id;?>"><?php echo $value->package_category_name;?></option>
													<?php
												}
											}

											?>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Ads Positions/Types</label>
										<select class="form-control" name="ads_package_type" id="ads_package_type">
											<option value="0">Select Position/Type</option>
											<?php
											if(!empty($ads_positions)){
												foreach ($ads_positions as $key => $value) {
													?>
													<option value="<?php echo $value['pacakge_type_id'];?>"><?php echo $value['package_name'];?></option>
													<?php
												}
											}

											?>
										</select>
									</div>
								</div>
								<div class="col-sm-3" style="display: none;" id="ads_menu_type_div">
									<div class="form-group">
										<label class="control-label">Menu(Ads under menu)</label>
										<select class="form-control" name="ads_menu_type" id="ads_menu_type">
											<option value="0">Select Ads under menu</option>
											<?php
											if(!empty($listing_top_menues)){
												foreach ($listing_top_menues as $key => $value) {
													?>
													<option value="<?php echo $value->menu_id;?>"><?php echo $value->menu_name;?></option>
													<?php
												}
											}
											?>	
										</select>

									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-md-12">
									<blockquote class="blockquote shadow-sm" style="background: #f6f6f6;border-left: 4px solid #e8522e;padding: 10px;box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;">
						                <div class="media" style="display: -ms-flexbox;display: flex;-ms-flex-align: start;align-items: flex-start;">
						                  <a href="#"> <img src="https://static.waytoadmissions.com/data/app/app_data/no.jpg" width="40" class="mr-2" alt="..." style="margin-right: 0.5rem!important;"></a> 
						                  <div class="media-body" style="flex: 1;">
						                    <h6 class="m-0" style="margin: 0!important;">NIIT University - The University of the Future</h6>
						                    <small class="f10" style="font-size: 10px;">Applications Open for 2020-21</small> 
						                    <button type="button" data-toggle="modal" data-target="#reg3ApplyModal" class="btn btn-primary float-right" style="position: relative;color: #fff;background: #1b1f4c;border-color: #1b1f4c;">APPLY NOW</button>
						                  </div>
						                </div>
						                <p class="mb-0 f12" style="font-size: 12px;margin-bottom: 0!important;"><i class="far fa-check-circle color2" style="color: #e8522e!important;"></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
					              	</blockquote>
								</div>
								<div class="col-md-12">
									<div class="live-form-body-row">
										<div class="live-form-container-new clearfix"><h4><span> <span class="live-form-heading--icon"><svg><use href="#icon-live_form_sponsored_icon"></use></svg></span> Latest Application Forms 2021 </span> <span class="sponsored"> SPONSORED </span></h4><div class="live-form-body-row"><div class="ads_body_live_form_container clearfix " data-ads-id="70440" data-template-type="25"><a class="ads_live_form_desktop_tnew" href="https://epgpkochi.iimk.ac.in/?utm_source=Collegedunia&amp;utm_medium=LiveForm&amp;utm_campaign=Online" target="_blank" rel="nofollow" style="
" id="ads_viewport_70440" data-id="70440">             
  <div class="top-section" style="
">
    <div class="logo">
    <img src="https://images.static-collegedunia.com/public/image/client_images_new/iimklogo20211124151408.jpg?tr=w-50,h-50,c-force" alt="IIM Kozhikode, Kochi Campus">
    </div>    
    <span class="college_name" title="IIM Kozhikode, Kochi Campus ">IIM Kozhikode, Kochi Campus </span>
   </div>
    <div class="info-section">
    <div class="extra_info">  Master of Business Administration(MBA) for Working Executives. A two-year class room programme at IIMK Kochi campus   </div>
    <div class="admission_info"> MBA for Working Executives </div>
    
    <div class="apply-btn">
      <span class="apply"> Apply Now </span>
    </div>     
  </div>
    <div class="ads_bottom_border"></div>
</a></div><div class="ads_body_live_form_container clearfix " data-ads-id="66441" data-template-type="25"><a class="ads_live_form_desktop_tnew" href="https://unacademy.onelink.me/SXoE/bcb3d02a" target="_blank" rel="nofollow" style="
" id="ads_viewport_66441" data-id="66441">             
  <div class="top-section" style="
">
    <div class="logo">
    <img src="https://images.static-collegedunia.com/public/image/client_images_new/unacademyicon20210819180442.jpeg?tr=w-50,h-50,c-force" alt="Prepare for Competitive Exams with Unacademy">
    </div>    
    <span class="college_name" title="Prepare for Competitive Exams with Unacademy ">Prepare for Competitive Exams with Unacademy </span>
   </div>
    <div class="info-section">
    <div class="extra_info">  India's largest learning Platform   </div>
    <div class="admission_info"> New Batches Every Week </div>
    
    <div class="apply-btn">
      <span class="apply"> Apply Now </span>
    </div>     
  </div>
    <div class="ads_bottom_border"></div>
</a></div><div class="ads_body_live_form_container clearfix " data-template-type="25" data-rank="2" data-category="default_review_banner" data-label="banner_body2-3" data-non-interaction="true"><a class="ads-live-form-review-banner position-relative d-block text-base text-left" href="https://collegedunia.com/write-review?utm_source=review-form-ad-liveform&amp;utm_medium=Body&amp;utm_campaign=desktop" target="_blank">             
      <div class="top-section d-flex align-items-center mb-1">
        <div class="logo d-flex align-items-center justify-content-center bg-white mr-3"> <span class="icon"><svg width="21" height="28" viewBox="0 0 21 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.9688 12.1437V11.1312C17.9688 10.7937 17.6875 10.4562 17.2938 10.4562H16.225C15.8875 10.4562 15.55 10.7375 15.55 11.1312V12.1437H17.9688Z" fill="#FF7900"></path>
                  <path d="M15.6063 19.2312L16.7875 21.0312L17.9688 19.2312V13.0437H15.6063V19.2312Z" fill="#FF7900"></path>
                  <path d="M3.68134 11.6375H10.0938C10.4313 11.6375 10.6563 11.4125 10.6563 11.075C10.6563 10.7375 10.4313 10.5125 10.0938 10.5125H3.68134C3.34384 10.5125 3.11884 10.7375 3.11884 11.075C3.11884 11.3562 3.40009 11.6375 3.68134 11.6375Z" fill="#FF7900"></path>
                  <path d="M3.68134 15.575H13.3563C13.6938 15.575 13.9188 15.35 13.9188 15.0125C13.9188 14.675 13.6938 14.45 13.3563 14.45H3.68134C3.34384 14.45 3.11884 14.675 3.11884 15.0125C3.11884 15.35 3.40009 15.575 3.68134 15.575Z" fill="#FF7900"></path>
                  <path d="M3.68134 19.5688H13.3563C13.6938 19.5688 13.9188 19.3438 13.9188 19.0063C13.9188 18.6688 13.6938 18.4438 13.3563 18.4438H3.68134C3.34384 18.4438 3.11884 18.6688 3.11884 19.0063C3.11884 19.3438 3.40009 19.5688 3.68134 19.5688Z" fill="#FF7900"></path>
                  <path d="M17.4063 22.4375H3.68134C3.34384 22.4375 3.11884 22.6625 3.11884 23C3.11884 23.3375 3.34384 23.5625 3.68134 23.5625H17.3501C17.6876 23.5625 17.9126 23.3375 17.9126 23C17.9688 22.6625 17.6876 22.4375 17.4063 22.4375Z" fill="#FF7900"></path>
                  <path d="M16.2249 6.23755H20.2749L15.0999 1.06255V5.11255C15.0999 5.7313 15.6062 6.23755 16.2249 6.23755Z" fill="#FF7900"></path>
                  <path d="M15.6625 7.3625C14.7062 7.3625 13.975 6.63125 13.975 5.675V0.5H1.9375C0.98125 0.5 0.25 1.23125 0.25 2.1875V25.8125C0.25 26.7687 0.98125 27.5 1.9375 27.5H19.2062C20.1625 27.5 20.8937 26.7687 20.8937 25.8125V7.3625H15.6625ZM19.7125 25.8125C19.7125 26.15 19.4312 26.375 19.15 26.375H1.9375C1.65625 26.375 1.375 26.15 1.375 25.8125V2.1875C1.375 1.90625 1.65625 1.625 1.9375 1.625H12.85V5.675C12.85 7.25 14.0875 8.4875 15.6625 8.4875H19.7125V25.8125Z" fill="#FF7900"></path>
                  </svg> </span> </div>    
        <span class="review-text text-lg font-weight-bold">Collegedunia Review Rewards </span> </div>
        <div class="info-section"> Write a Review &amp; Get Assured Reward of </div> <div class="rupee"> ₹90 </div>
        <span class="apply bg-primary d-inline-block text-base text-white text-center p-2 mt-4"> AVAIL NOW </span>  
        <svg class="bottom-svg" width="166" height="133" viewBox="0 0 166 133" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0)">
                  <path d="M143.653 43.7273C153.036 43.7273 160.641 36.155 160.641 26.8142C160.641 17.4733 153.036 9.90112 143.653 9.90112C134.271 9.90112 126.665 17.4733 126.665 26.8142C126.665 36.155 134.271 43.7273 143.653 43.7273Z" fill="#EE903C"></path>
                  <path d="M67.5982 47.3271C74.2093 47.3271 79.5688 41.9913 79.5688 35.4093C79.5688 28.8273 74.2093 23.4915 67.5982 23.4915C60.987 23.4915 55.6276 28.8273 55.6276 35.4093C55.6276 41.9913 60.987 47.3271 67.5982 47.3271Z" fill="#EE903C"></path>
                  <path d="M149.394 104.044L154.855 99.4897L150.687 93.9731L145.079 98.1822L149.394 104.044Z" fill="#EFBCA3"></path>
                  <path d="M149.384 104.043L150.313 105.588C150.716 106.26 150.958 107.017 151.018 107.798C151.079 108.578 150.957 109.363 150.663 110.089L150.16 111.355C149.943 111.891 149.854 112.469 149.897 113.045C149.941 113.621 150.117 114.18 150.411 114.677L150.907 115.505C150.96 115.597 151.03 115.677 151.115 115.74C151.2 115.803 151.296 115.848 151.399 115.872C151.502 115.896 151.609 115.899 151.713 115.88C151.818 115.861 151.917 115.821 152.004 115.763C152.096 115.72 152.174 115.653 152.228 115.568L160.705 104.589C160.935 104.293 161.037 103.918 160.99 103.546C160.943 103.175 160.75 102.837 160.453 102.606C160.406 102.563 160.35 102.531 160.289 102.513L154.698 99.2288L149.384 104.043Z" fill="#384D7B"></path>
                  <path d="M153.258 73.3238L151.5 66.45L144.701 67.8032L146.081 74.6561L153.258 73.3238Z" fill="#EFBCA3"></path>
                  <path d="M153.259 73.3234L155.058 73.1564C155.841 73.0853 156.63 73.196 157.363 73.4797C158.096 73.7634 158.753 74.2123 159.282 74.7914L160.212 75.7863C160.603 76.213 161.088 76.5445 161.628 76.755C162.168 76.9655 162.75 77.0494 163.329 77.0003L164.293 76.9168C164.398 76.9089 164.5 76.8795 164.593 76.8305C164.686 76.7815 164.768 76.7139 164.833 76.6319C164.899 76.55 164.947 76.4554 164.974 76.3542C165.001 76.253 165.007 76.1473 164.992 76.0437C164.995 75.9426 164.967 75.8429 164.911 75.7584L158.646 63.3989C158.566 63.2308 158.451 63.0806 158.311 62.9572C158.171 62.8339 158.007 62.7399 157.829 62.6808C157.651 62.6218 157.464 62.5989 157.277 62.6134C157.09 62.628 156.908 62.6798 156.742 62.7657C156.683 62.7877 156.631 62.8235 156.588 62.8701L151.201 66.474L153.259 73.3234Z" fill="#384D7B"></path>
                  <path d="M127.794 53.0845L118.094 73.3093C117.878 73.7562 117.745 74.2381 117.7 74.732C117.645 75.3079 117.71 75.8889 117.89 76.4388C118.071 76.9887 118.362 77.4959 118.748 77.9289C119.967 79.2855 121.892 79.449 123.618 79.5221C125.907 79.616 128.189 79.4386 130.474 79.4073L140.1 79.2751L148.412 79.1603L151.207 79.1221L149.247 66.0946L130.201 70.3002L139.516 55.1995L127.794 53.0845Z" fill="#384D7B"></path>
                  <path d="M147.375 46.6143L148.482 55.7005L144.544 67.5278C144.517 67.6084 144.506 67.6938 144.513 67.7787C144.519 67.8637 144.543 67.9464 144.583 68.0218L146.473 71.6604L145.816 74.3946C145.782 74.5379 145.778 74.6867 145.804 74.8317C145.831 74.9766 145.887 75.1144 145.97 75.2364L147.214 77.0697C147.234 77.1005 147.262 77.1259 147.295 77.1434C147.327 77.161 147.364 77.1701 147.401 77.1701C147.438 77.1701 147.474 77.161 147.507 77.1434C147.54 77.1259 147.567 77.1005 147.588 77.0697L149.122 74.5512C149.397 74.1053 149.503 73.5756 149.419 73.0588L148.825 69.3402C148.783 69.0641 148.81 68.782 148.905 68.5192L153.423 56.2258C153.672 55.5499 153.747 54.823 153.643 54.1107L153.412 47.0491L147.375 46.6143Z" fill="#EFBCA3"></path>
                  <path d="M131.11 52.9285L128.859 71.5809C128.436 75.086 129.384 78.619 131.508 81.4463L145.54 100.162L155.55 95.58L139.74 76.7954C139.519 76.5333 139.379 76.2137 139.336 75.8745C139.292 75.5353 139.348 75.1909 139.495 74.8821L142.553 68.471C144.17 65.0778 144.443 61.2025 143.318 57.6177L142.325 54.4695L131.11 52.9285Z" fill="#48639E"></path>
                  <path d="M143.577 31.3358C147.07 31.3358 149.901 28.5169 149.901 25.0395C149.901 21.5622 147.07 18.7432 143.577 18.7432C140.084 18.7432 137.253 21.5622 137.253 25.0395C137.253 28.5169 140.084 31.3358 143.577 31.3358Z" fill="#EFBCA3"></path>
                  <path d="M127.793 53.0843L128.842 44.7739C128.842 44.7739 126.567 41.1491 128.842 38.1262L125.124 35.4059L124.684 26.0901L147.095 33.5205C148.689 34.0478 150.109 34.9983 151.201 36.2697C152.294 37.541 153.017 39.0849 153.293 40.7352L154.341 47.0523L146.874 47.4315L142.332 55.2132L127.793 53.0843Z" fill="white"></path>
                  <path d="M124.684 26.0901L117.983 22.9315L110.355 13.0591C110.303 12.9916 110.238 12.935 110.163 12.8926C110.089 12.8502 110.007 12.8229 109.922 12.8122L105.841 12.3425L103.933 10.2554C103.833 10.1461 103.711 10.0587 103.575 9.99877C103.439 9.93897 103.292 9.90787 103.144 9.90747H101.802C101.765 9.90777 101.728 9.91727 101.696 9.93507C101.663 9.95287 101.636 9.97847 101.616 10.0095C101.596 10.0406 101.583 10.0762 101.581 10.113C101.578 10.1498 101.584 10.1868 101.599 10.2206L101.949 12.8956C102.168 13.3723 102.551 13.7557 103.028 13.9775L106.452 15.5672C106.708 15.6861 106.93 15.8681 107.095 16.096L114.782 26.7023C115.206 27.2842 115.768 27.7527 116.417 28.0659L124.957 32.1812L124.684 26.0901Z" fill="#EFBCA3"></path>
                  <path d="M140.379 25.9373C140.613 27.2278 139.89 28.5114 138.982 29.4576C138.332 30.129 137.584 30.6925 136.885 31.3222C136.186 31.9518 135.68 32.6788 136.295 33.6459C136.49 33.9336 136.759 34.1642 137.074 34.3138C138.363 34.9643 139.953 34.533 141.183 33.7816C142.413 33.0302 143.444 31.9796 144.677 31.2561C144.351 30.8469 144.116 30.3727 143.99 29.8657C143.863 29.3586 143.847 28.8303 143.943 28.3166C144.145 27.2917 144.526 26.3098 145.068 25.4155L140.379 25.9373Z" fill="#EFBCA3"></path>
                  <path d="M150.508 26.0278C155.225 18.8097 147.472 16.3364 147.472 16.3364C144.799 15.2928 140.428 15.9885 139.296 18.9801C138.286 21.6517 136.934 24.2642 134.914 26.3235C134.526 26.7463 134.091 27.1244 133.618 27.4506C133.618 30.6092 138.768 31.0127 138.768 31.0127C139.467 29.0647 138.593 28.5359 138.593 28.5359C137.598 26.5566 138.143 24.2259 138.894 22.2744C139.292 21.2308 140.11 19.1436 141.612 19.3523C146.763 20.0481 149.072 23.2414 149.072 23.2414C150.763 27.5132 147.115 26.0244 147.115 26.0244C143.712 26.3479 143.653 31.7154 143.653 31.7154C146.228 36.1367 153.688 33.6599 153.688 33.6599C150.823 31.2875 150.449 27.9585 150.508 26.0278ZM147.192 18.8271L147.168 18.8097L147.192 18.8271Z" fill="#384D7B"></path>
                  <path d="M110.91 15.018C110.91 15.018 110.637 10.4123 111.773 8.71817C111.773 8.71817 113.426 6.55446 110.896 6.17529C110.896 6.17529 106.958 10.4227 107.276 16.4199L110.91 15.018Z" fill="#EFBCA3"></path>
                  <path d="M112.018 2.57614L106.105 0.0381978C105.867 -0.0637122 105.592 0.0453178 105.489 0.281728L100.742 11.2451C100.64 11.4815 100.75 11.7558 100.987 11.8577L106.9 14.3957C107.138 14.4976 107.413 14.3885 107.516 14.1521L112.263 3.18873C112.365 2.95232 112.256 2.67805 112.018 2.57614Z" fill="white"></path>
                  <path d="M111.3 3.66866L105.801 1.30835L101.589 11.0355L107.088 13.3958L111.3 3.66866Z" fill="#384D7B"></path>
                  <path d="M106.288 6.92969C106.288 6.92969 106.476 5.04776 103.164 4.19897C103.164 4.19897 101.179 5.83045 101.651 11.0415C101.651 11.0415 104.869 11.5737 105.145 11.0415C105.421 10.5092 104.869 8.15417 106.288 6.92969Z" fill="#EFBCA3"></path>
                  <path d="M79.7064 3.79623C80.0982 4.63969 80.2304 5.57982 80.086 6.49797C79.9417 7.41611 79.5274 8.2711 78.8954 8.95506C78.2634 9.63896 77.4421 10.1211 76.535 10.3407C75.628 10.5603 74.676 10.5074 73.7992 10.1888C72.9223 9.87016 72.1599 9.29996 71.6083 8.55034C71.0566 7.80069 70.7404 6.90514 70.6995 5.97671C70.6586 5.04828 70.8949 4.1286 71.3786 3.33377C71.8622 2.53894 72.5716 1.90458 73.4171 1.51077C73.9805 1.24832 74.5905 1.09926 75.212 1.07214C75.8335 1.04501 76.4542 1.14037 77.0386 1.35272C77.623 1.56508 78.1595 1.89025 78.6173 2.30958C79.0751 2.7289 79.4452 3.23412 79.7064 3.79623Z" fill="#C0CDE2"></path>
                  <path d="M79.2267 4.59775C79.6186 5.44121 79.7507 6.38134 79.6064 7.29949C79.4621 8.21763 79.0478 9.07266 78.4158 9.75656C77.7838 10.4405 76.9624 10.9227 76.0554 11.1422C75.1484 11.3618 74.1964 11.309 73.3196 10.9903C72.4427 10.6717 71.6803 10.1015 71.1287 9.35186C70.577 8.60221 70.2607 7.70665 70.2199 6.77822C70.179 5.84979 70.4153 4.93011 70.899 4.13528C71.3826 3.34045 72.092 2.7061 72.9375 2.31229C73.5009 2.04984 74.1109 1.90078 74.7324 1.87365C75.3539 1.84653 75.9746 1.94189 76.559 2.15424C77.1434 2.36659 77.6799 2.69177 78.1377 3.1111C78.5955 3.53042 78.9656 4.03564 79.2267 4.59775Z" fill="white"></path>
                  <path d="M78.2553 5.1287C78.5515 5.76173 78.6523 6.46805 78.5449 7.15817C78.4375 7.84828 78.1268 8.49113 77.6521 9.00526C77.1774 9.51936 76.5601 9.88166 75.8784 10.0462C75.1967 10.2108 74.4813 10.1701 73.8228 9.92946C73.1643 9.68876 72.5924 9.25896 72.1795 8.69438C71.7666 8.12982 71.5314 7.45596 71.5035 6.75816C71.4757 6.06036 71.6565 5.37004 72.0231 4.77466C72.3897 4.17928 72.9256 3.70563 73.5628 3.41373C74.4138 3.02391 75.3852 2.98549 76.2646 3.30688C77.144 3.62827 77.8597 4.2833 78.2553 5.1287Z" fill="#F07A39"></path>
                  <path d="M75.4463 4.10567L74.398 4.5892C74.6932 4.67442 74.9436 4.87017 75.0969 5.13535L75.7957 4.81879L75.9599 5.16665L75.2611 5.48321C75.5301 6.22416 75.2261 6.91641 74.426 7.31993C75.1842 7.6678 76.0577 8.11654 76.9242 8.58963L76.3163 8.87136C75.5161 8.44353 74.7684 8.05045 73.846 7.62953L73.6433 7.19818L73.9927 7.03469C74.6915 6.71813 74.9012 6.2346 74.7195 5.73368L73.273 6.40158L73.1122 6.05371L74.5378 5.39277C74.2618 5.04491 73.839 4.98229 73.28 5.23623L72.8292 5.44495L72.6161 4.99273L75.289 3.75781L75.4463 4.10567Z" fill="white"></path>
                  <path d="M115.665 39.2644C115.192 40.5757 114.34 41.7157 113.218 42.5406C112.095 43.3655 110.752 43.8383 109.358 43.8993C107.963 43.9603 106.58 43.6067 105.383 42.8833C104.186 42.1598 103.229 41.0989 102.632 39.8344C102.035 38.57 101.825 37.1586 102.029 35.7786C102.233 34.3985 102.841 33.1116 103.777 32.0804C104.714 31.0491 105.936 30.3196 107.289 29.984C108.643 29.6485 110.067 29.7219 111.383 30.195C112.259 30.5102 113.066 30.9953 113.756 31.6223C114.446 32.2492 115.006 33.0058 115.404 33.8485C115.802 34.6912 116.03 35.6034 116.074 36.5328C116.119 37.4623 115.98 38.3905 115.665 39.2644Z" fill="#C0CDE2"></path>
                  <path d="M114.308 39.6116C113.835 40.9229 112.983 42.0629 111.861 42.8878C110.738 43.7127 109.395 44.1855 108.001 44.2464C106.606 44.3074 105.223 43.9539 104.026 43.2304C102.829 42.507 101.872 41.4461 101.275 40.1816C100.678 38.9171 100.468 37.5058 100.672 36.1258C100.876 34.7457 101.484 33.4588 102.421 32.4275C103.357 31.3962 104.579 30.6668 105.932 30.3312C107.286 29.9956 108.71 30.069 110.026 30.5421C110.902 30.8574 111.709 31.3425 112.399 31.9694C113.089 32.5964 113.649 33.353 114.047 34.1956C114.445 35.0383 114.673 35.9506 114.718 36.88C114.762 37.8094 114.623 38.7377 114.308 39.6116Z" fill="white"></path>
                  <path d="M112.714 39.1516C112.362 40.138 111.723 40.9961 110.881 41.6173C110.038 42.2385 109.029 42.5948 107.981 42.641C106.934 42.6873 105.894 42.4214 104.995 41.8772C104.096 41.3329 103.377 40.5347 102.931 39.5836C102.484 38.6326 102.329 37.5716 102.485 36.535C102.641 35.4985 103.102 34.533 103.809 33.7609C104.515 32.9888 105.436 32.4449 106.455 32.1981C107.473 31.9513 108.543 32.0126 109.53 32.3744C110.847 32.8576 111.921 33.8418 112.518 35.1119C113.115 36.3819 113.185 37.8344 112.714 39.1516Z" fill="#F07A39"></path>
                  <path d="M110.803 35.0977L109.178 34.5062C109.402 34.9083 109.462 35.381 109.345 35.8249L110.423 36.2254L110.231 36.7689L109.153 36.3684C108.657 37.441 107.603 37.857 106.326 37.4421C106.766 38.6124 107.222 40.0119 107.645 41.4298L106.7 41.0881C106.3 39.7884 105.919 38.5809 105.382 37.1595L105.621 36.4866L106.166 36.6813C107.243 37.0818 107.977 36.7884 108.312 36.0635L106.068 35.2478L106.264 34.708L108.478 35.5089C108.552 34.8474 108.168 34.3346 107.305 34.0149L106.605 33.7614L106.855 33.0552L111.003 34.5615L110.803 35.0977Z" fill="white"></path>
                  <path d="M64.3032 79.3931L48 79.3932V86.7227L64.3032 86.7226V79.3931Z" fill="#384D7B"></path>
                  <path d="M63.3255 82.8965H61.5226V85.7525H63.3255V82.8965Z" fill="white"></path>
                  <path d="M56.2883 77.4491C56.2883 77.4491 57.2212 84.9594 55.8201 88.3302C55.7026 88.6137 55.4944 88.8506 55.2277 89.0041C54.9611 89.1575 54.651 89.219 54.3456 89.179C53.8421 89.054 53.3872 88.7828 53.0388 88.3998C52.5899 87.9554 52.1915 87.4631 51.8509 86.9318C51.5713 86.5005 51.1521 85.8882 51.3757 85.3421C51.477 85.1055 51.8089 85.1925 52.036 85.1925H53.4756C53.4756 85.1925 52.8921 77.5395 53.0074 76.5933L56.2883 77.4491Z" fill="#EFBCA3"></path>
                  <path d="M95.886 24.2956L99.324 20.5908C99.635 20.5908 100.138 20.4969 100.418 20.6152C100.418 20.6152 99.352 22.7545 99.237 22.9806L101.379 21.0187L102.469 21.0987L103.262 21.1578C103.695 21.1892 103.692 21.2726 103.692 21.7005C103.692 21.7005 101.641 25.4922 98.468 26.3688L95.886 24.2956Z" fill="#EFBCA3"></path>
                  <path d="M96.588 91.8399L88.6879 90.3093L89.785 82.5903L97.64 83.6999L96.588 91.8399Z" fill="#EFBCA3"></path>
                  <path d="M96.589 91.8355L96.515 93.8705C96.486 94.7545 96.663 95.6332 97.033 96.4376C97.402 97.2421 97.953 97.9506 98.643 98.5075L99.835 99.4886C100.342 99.9016 100.747 100.424 101.019 101.017C101.292 101.61 101.425 102.257 101.407 102.908L101.372 103.997C101.371 104.116 101.345 104.234 101.296 104.342C101.247 104.451 101.176 104.548 101.088 104.628C100.999 104.708 100.895 104.768 100.781 104.806C100.668 104.843 100.548 104.857 100.429 104.846C100.315 104.856 100.2 104.832 100.1 104.776L85.6977 98.5319C85.3092 98.3651 85.0028 98.0518 84.8457 97.6607C84.6885 97.2695 84.6933 96.8323 84.8591 96.4447C84.8817 96.3773 84.9186 96.3156 84.9675 96.2638L88.6956 89.9744L96.589 91.8355Z" fill="#384D7B"></path>
                  <path d="M72.0287 64.5508L94.321 52.3756C95.146 51.9252 96.088 51.7278 97.026 51.8083C97.964 51.8887 98.857 52.2434 99.593 52.8278C101.211 54.1114 101.522 56.2751 101.711 58.1953C101.962 60.7591 101.91 63.3333 102.022 65.904L102.486 76.719L102.892 86.0592L103.024 89.2108L88.1502 87.8194L91.686 66.1684L75.1768 77.5748L72.0287 64.5508Z" fill="#384D7B"></path>
                  <path d="M64.5273 119.523L58.3568 114.378L63.0668 108.148L69.398 112.903L64.5273 119.523Z" fill="#EFBCA3"></path>
                  <path d="M64.5267 119.523L63.4784 121.262C63.0222 122.023 62.7488 122.878 62.6797 123.76C62.6106 124.643 62.7477 125.53 63.0801 126.352L63.6462 127.781C63.8911 128.387 63.9929 129.04 63.9439 129.691C63.8948 130.342 63.6961 130.973 63.3631 131.535L62.8041 132.467C62.7454 132.571 62.6657 132.662 62.57 132.733C62.4744 132.805 62.3648 132.856 62.2482 132.884C62.1317 132.911 62.0107 132.914 61.8929 132.893C61.775 132.872 61.663 132.826 61.5637 132.759C61.4672 132.708 61.3872 132.631 61.3331 132.537L51.7594 120.139C51.6298 119.973 51.5343 119.784 51.4784 119.582C51.4225 119.38 51.4072 119.168 51.4335 118.96C51.4598 118.752 51.5272 118.551 51.6316 118.369C51.7361 118.187 51.8757 118.027 52.0425 117.899C52.096 117.851 52.1591 117.815 52.2276 117.794L58.5379 114.1L64.5267 119.523Z" fill="#384D7B"></path>
                  <path d="M83.5698 57.9482L87.7173 82.8552C88.1936 86.8099 87.124 90.7956 84.7299 93.9868L68.8704 115.144L57.5602 109.964L75.4217 88.7445C75.6701 88.4482 75.828 88.0874 75.877 87.7046C75.9259 87.3218 75.8637 86.933 75.6978 86.5843L72.2421 79.3383C70.4146 75.5058 70.1076 71.1277 71.3826 67.0796L72.5147 63.5209L83.5698 57.9482Z" fill="#48639E"></path>
                  <path d="M51.55 77.4491L51.1167 64.0251C51.0669 62.4894 51.4287 60.9682 52.1649 59.6177L57.8008 49.2931C58.7614 47.5348 60.0716 45.9896 61.6514 44.7516C63.2313 43.5136 65.0477 42.6088 66.9901 42.0924L73.5624 40.353L93.695 22.4138L99.01 26.6786L80.7532 45.9989C80.5956 46.1663 80.4892 46.375 80.4465 46.6005C80.4038 46.826 80.4266 47.059 80.5121 47.272L84.104 57.9653L71.0293 67.8238L67.8846 55.8608C67.8634 55.8069 67.829 55.7592 67.7846 55.7219C67.7402 55.6846 67.6872 55.6589 67.6303 55.6472C67.5734 55.6354 67.5144 55.638 67.4588 55.6546C67.4032 55.6713 67.3526 55.7015 67.3116 55.7425L59.8343 64.3417L57.4898 77.4491H51.55Z" fill="white"></path>
                  <path d="M73.0107 37.7781L74.272 43.4726L66.9695 42.0916L67.7032 39.8723L68.1679 37.6599L73.0107 37.7781Z" fill="#EFBCA3"></path>
                  <path d="M70.0897 38.8672C73.2853 38.8672 75.8759 36.2881 75.8759 33.1066C75.8759 29.9251 73.2853 27.3459 70.0897 27.3459C66.8941 27.3459 64.3036 29.925 64.3036 33.1066C64.3036 36.2881 66.8941 38.8672 70.0897 38.8672Z" fill="#EFBCA3"></path>
                  <path d="M71.8717 23.8156C71.9223 23.9271 71.9609 24.0437 71.987 24.1634C72.1378 25.0462 72.1095 25.9501 71.9037 26.8218C71.6978 27.6935 71.3186 28.5153 70.7885 29.2387L68.2658 32.4599C68.2658 32.4599 70.0652 36.5508 67.8081 39.7651L65.9038 38.8154C64.8675 38.2958 63.9732 37.5336 63.2977 36.5943C62.6223 35.655 62.1858 34.5666 62.0257 33.4224C61.8655 32.2782 61.9866 31.1124 62.3785 30.0251C62.7704 28.9377 63.4214 27.9612 64.2756 27.1794C65.6977 25.8819 67.0708 24.4521 68.5942 23.2277C69.639 22.3963 71.2742 22.4763 71.8717 23.8156Z" fill="#384D7B"></path>
                  <path d="M68.3984 34.7314C69.1568 34.7314 69.7716 34.1194 69.7716 33.3644C69.7716 32.6093 69.1568 31.9973 68.3984 31.9973C67.6401 31.9973 67.0253 32.6093 67.0253 33.3644C67.0253 34.1194 67.6401 34.7314 68.3984 34.7314Z" fill="#EFBCA3"></path>
                  <path d="M74.4674 29.6248L75.5899 29.7014C75.6448 29.7093 75.697 29.7301 75.7422 29.762C75.7874 29.794 75.8244 29.8362 75.85 29.8852C75.8756 29.9342 75.8892 29.9885 75.8896 30.0437C75.8899 30.0989 75.8771 30.1534 75.8521 30.2027L75.2052 31.275L74.4674 29.6248Z" fill="#EFBCA3"></path>
                  <path d="M0.5 133L165.5 48.5L165 133H0.5Z" fill="#FCEDDE"></path>
                  <path opacity="0.54" d="M165.5 133.5H-1L165.5 51.5V133.5Z" fill="#F7C296"></path>
                  <path opacity="0.54" d="M120.654 86L112.628 93.997C112.633 92.915 112.851 91.845 113.272 90.848L117.491 86.648C118.491 86.225 119.567 86.005 120.654 86Z" fill="#EE903C"></path>
                  <path opacity="0.54" d="M123.764 86.6331L113.254 97.0941C112.984 96.4721 112.802 95.8161 112.71 95.1451L121.807 86.0891C122.481 86.1811 123.14 86.3641 123.764 86.6331Z" fill="#EE903C"></path>
                  <path opacity="0.54" d="M126.059 88.0861L114.708 99.3881C114.306 98.9441 113.956 98.4561 113.665 97.9341L124.608 87.0391C125.125 87.3401 125.611 87.6911 126.059 88.0861Z" fill="#EE903C"></path>
                  <path opacity="0.54" d="M127.713 90.1791L116.819 101.025C116.291 100.736 115.796 100.393 115.34 100.002L126.67 88.7251C127.077 89.1641 127.428 89.6531 127.713 90.1791Z" fill="#EE903C"></path>
                  <path opacity="0.54" d="M128.627 93.0039L119.656 101.935C118.974 101.855 118.305 101.683 117.668 101.425L128.099 91.0249C128.362 91.6579 128.54 92.3239 128.627 93.0039Z" fill="#EE903C"></path>
                  <path opacity="0.54" d="M128.692 94.189C128.673 95.325 128.405 96.442 127.906 97.464L124.136 101.218C123.106 101.708 121.984 101.974 120.844 101.999L128.692 94.189Z" fill="#EE903C"></path>
                  <path opacity="0.54" d="M95.1065 108.554H81.5V121.542H95.1065V108.554Z" fill="#F5AA70"></path>
                  <path opacity="0.54" d="M95 133H85V117.015L90.0016 113L95 117.015V133Z" fill="#FBE3D2"></path>
                  <path opacity="0.54" d="M118.132 105H101.316V132.558H118.132V105Z" fill="#FBE3D2"></path>
                  <path opacity="0.54" d="M109.725 98.646H101.316V105.579H109.725V98.646Z" fill="#FBE3D2"></path>
                  <path opacity="0.54" d="M158.295 111H144.256V132.79H158.295V111Z" fill="#FBE3D2"></path>
                  <path opacity="0.54" d="M101.316 94H95.0575V128.49H101.316V94Z" fill="#FBE3D2"></path>
                  <path opacity="0.54" d="M95.0576 118.539H98.6042L93.3242 113.392H90.0691" fill="#F5AA70"></path>
                  <path opacity="0.54" d="M95.0576 118.539H98.6042L93.3242 113.392H90.0691" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M85 116.984V133H95V116.984L90.0016 113L85 116.984Z" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M91.8331 122.482H88.9922V127.913H91.8331V122.482Z" fill="#FBE3D2" stroke="#EE903C" stroke-width="0.47" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M112.613 108.982H111.376V113.185H112.613V108.982Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M112.613 114.477H111.376V118.679H112.613V114.477Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M112.613 119.957H111.376V124.159H112.613V119.957Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M112.613 125.451H111.376V129.654H112.613V125.451Z" fill="#FBE3D2" stroke="#EE903C" stroke-width="0.47" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M116.466 108.982H115.229V113.185H116.466V108.982Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M116.466 114.477H115.229V118.679H116.466V114.477Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M116.466 119.957H115.229V124.159H116.466V119.957Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M116.466 125.451H115.229V129.654H116.466V125.451Z" fill="#FBE3D2" stroke="#EE903C" stroke-width="0.47" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M118.132 105H101.316V132.558H118.132V105Z" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M95.0575 108.426V115.069" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M101.316 94V100.933" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M165.149 106.444H163.032V110.646H165.149V106.444Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M165.149 115.311H163.032V119.513H165.149V115.311Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M137.276 96H121.326V133.433H137.276V96Z" fill="#FBE3D2"></path>
                  <path opacity="0.54" d="M137.276 96H121.326V133.433H137.276V96Z" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M158.295 111H144.256V132.79H158.295V111Z" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path opacity="0.54" d="M95.0575 118.539H98.6041V123.683H97.064H95.0575V118.539Z" fill="#FBE3D2"></path>
                  <path opacity="0.54" d="M95.0575 118.539H98.6041V123.683H97.064H95.0575V118.539Z" fill="#F5AA70" stroke="#EE903C" stroke-width="0.5" stroke-miterlimit="10"></path>
                  <path d="M165.5 49L0 132.5" stroke="#FF7900"></path>
                  </g>
                  <defs>
                  <clipPath id="clip0">
                  <rect width="166" height="133" fill="white"></rect>
                  </clipPath>
                  </defs>
                  </svg>
        <div class="ads-bottom-border"></div>
      </a></div></div></div>
								</div>
								<!-- <div class="col-md-12">
									<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"crossorigin="anonymous"></script>
           
						            <ins class="adsbygoogle"
						                style="display:block"
						                data-ad-client="ca-pub-9545373166119354"
						                data-ad-slot="1976315786"
						                data-ad-format="auto"
						                data-full-width-responsive="true"></ins>
						            <script>
						                (adsbygoogle = window.adsbygoogle || []).push({});
						            </script>
								</div> -->
							</div>




							<div class="row">
								
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Ads Cost (If free then leave it as it is)</label>
										<input type="number" name="ads_cost" id="ads_cost" class="form-control" min="0" value="<?php echo (!empty($listing_data))?$listing_data['listing_name']:'0';?>" disabled="true">
									</div>
								</div>

								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Generate Embed Code</label>
										<select class="form-control" name="ads_embed_code_generate" id="ads_embed_code_generate">
											<option value="1">Yes</option>
											<option value="2">No</option>	
										</select>
									</div>
								</div>
							
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Ads Banner Width</label>
										<select  class="form-control" name="ads_height_width" id="ads_height_width" >
											<option value="" selected="selected">Auto</option>
											<option value="120x90">120 x 90</option>
											<option value="120x240">120 x 240</option>
											<option value="120x600">120 x 600</option>
											<option value="125x125">125 x 125</option>
											<option value="160x90">160 x 90</option>
											<option value="160x600">160 x 600</option>
											<option value="180x90">180 x 90</option>
											<option value="180x150">180 x 150</option>
											<option value="200x90">200 x 90</option>
											<option value="200x200">200 x 200</option>
											<option value="234x60">234 x 60</option>
											<option value="250x250">250 x 250</option>
											<option value="320x100">320 x 100</option>
											<option value="300x250">300 x 250</option>
											<option value="300x600">300 x 600</option>
											<option value="300x1050">300 x 1050</option>
											<option value="320x50">320 x 50</option>
											<option value="336x280">336 x 280</option>
											<option value="360x300">360 x 300</option>
											<option value="435x300">435 x 300</option>
											<option value="468x15">468 x 15</option>
											<option value="468x60">468 x 60</option>
											<option value="640x165">640 x 165</option>
											<option value="640x190">640 x 190</option>
											<option value="640x300">640 x 300</option>
											<option value="728x15">728 x 15</option>
											<option value="728x90">728 x 90</option>
											<option value="970x90">970 x 90</option>
											<option value="970x250">970 x 250</option>
											<option value="240x400">240 x 400 - Regional ad sizes</option>
											<option value="250x360">250 x 360 - Regional ad sizes</option>
											<option value="580x400">580 x 400 - Regional ad sizes</option>
											<option value="750x100">750 x 100 - Regional ad sizes</option>
											<option value="750x200">750 x 200 - Regional ad sizes</option>
											<option value="750x300">750 x 300 - Regional ad sizes</option>
											<option value="980x120">980 x 120 - Regional ad sizes</option>
											<option value="930x180">930 x 180 - Regional ad sizes</option>
										</select>
									</div>
								</div>

								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">published</label>
										<select class="form-control" name="ads_published" id="ads_published">
											<option value="1">Yes</option>
											<option value="2">No</option>
										</select>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12" id="ads_stream_div" style="display:none;">
									<div class="form-group">
										<label class="control-label">Ads Filter Streams (If required select streams)</label>
										<select class="form-control" multiple="true" name="ads_package_streams[]" id="ads_package_streams">
											<option value="0">Select Stream(s)</option>
											<?php
											if(!empty($ads_streams)){
												foreach ($ads_streams as $key => $v) {
													?>
													<option value="<?php echo $v['stream_id'];?>" <?php echo $v['selected'];?>><?php echo $v['stream_name'];?></option>
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
										<label class="control-label">Ads Title</label>
										<input type="text" name="ads_name" id="ads_name" class="form-control" value="<?php echo (!empty($listing_data))?$listing_data['listing_name']:'';?>">
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Ads Short Title (If required)</label>
										<input type="text" name="ads_short_name" id="ads_name" class="form-control" value="<?php echo (!empty($listing_data))?$listing_data['listing_name']:'';?>">
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Ads Short Description (If required)</label>
										<textarea class="form-control" rows="3" name="ads_short_desc"></textarea>
									</div>
								</div>
							</div>
							<div class="row" id="client_type_div" style="display:none;">
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Client Type</label>
										<select class="form-control" name="ads_package_client_type" id="ads_package_client_type">
											<option value="0">Select Type</option>
											<option value="1" selected>Existing College</option>
											<option value="2">New College</option>
											<!-- <option value="3">Existing University</option>
											<option value="4">New University</option> -->
											<option value="5">External</option>
											<option value="6">Wayto</option>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Start Date</label>
										<input class="form-control mb-4 mb-md-0" name="ads_start_date" data-inputmask="'alias': 'datetime'" data-inputmask-inputformat="dd-mm-yyyy" placeholder="dd-mm-yyyy" inputmode="numeric">
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">End Date</label>
										<input class="form-control mb-4 mb-md-0" name="ads_end_date" data-inputmask="'alias': 'datetime'" data-inputmask-inputformat="dd-mm-yyyy" placeholder="dd-mm-yyyy" inputmode="numeric">
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Ads Paid</label>
										<select class="form-control" name="ads_paid" id="ads_paid">
											<option value="3">Not Applicable</option>
											<option value="2">Not Paid</option>
											<option value="1">Paid</option>
										</select>
									</div>
								</div>
							</div>

							<div id="other_div" style="display:none;">
								<h5>Ads Client</h5><hr>
								<div class="row" style="display: block;">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label">College Country</label>
											<select class="form-control" name="ads_package_client_country" id="ads_package_client_country">
												<option value="0">Select Country</option>
												<?php
												if(!empty($ads_countries)){
													foreach ($ads_countries as $key => $v) {
														?>
														<option value="<?php echo $v['country_id'];?>" <?php echo $v['selected'];?>><?php echo $v['country_name'];?></option>
														<?php
													}
												}
												?>
											</select>
										</div>
									</div>
								</div>
								<div class="row" style="display: block;">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label">College State</label>
											<select class="form-control" name="ads_package_client_states" id="ads_package_client_states">
												<option value="0">Select State</option>
											</select>
										</div>
									</div>
								</div>
								<div class="row" style="display: block;">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label">College City</label>
											<select class="form-control" name="ads_package_client_cities" id="ads_package_client_cities">
												<option value="0">Select City</option>
											</select>
										</div>
									</div>
								</div>
								<div class="row" id="ads_colleges_div_1" style="display: block;">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label">College Name</label>
											<select class="form-control" name="ads_package_client" id="ads_package_client">
												<option value="0">Select Client</option>
												
											</select>
										</div>
									</div>
								</div>
								<div id="ads_colleges_div_2" style="display: none;">
									<div class="row">
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">College Name</label>
												<input type="text" class="form-control" placeholder="Enter name" name="ads_college_name" id="ads_college_name" value="<?php echo (!empty($college_data))?$college_data['college_name']:'';?>">
											</div>
										</div>							
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">College Email</label>
												<input type="text" class="form-control" placeholder="Enter official email" name="ads_college_email" id="ads_college_email" value="<?php echo (!empty($college_data))?$college_data['college_email']:'';?>">
											</div>
										</div>
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">College Phone No.</label>
												<input type="text" class="form-control" placeholder="Enter official phone no." name="ads_college_phone" id="ads_college_phone" value="<?php echo (!empty($college_data))?$college_data['college_phone_no']:'';?>">
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">College Contact Person Name</label>
												<input type="text" class="form-control" placeholder="Enter contact person name" name="ads_college_contact_person_name" id="ads_college_contact_person_name" value="<?php echo (!empty($college_data))?$college_data['college_name']:'';?>">
											</div>
										</div>							
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">College Contact Person Email</label>
												<input type="text" class="form-control" placeholder="Enter contact person official email" name="ads_college_contact_person_email" id="ads_college_contact_person_email" value="<?php echo (!empty($college_data))?$college_data['college_email']:'';?>">
											</div>
										</div>
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">College Contact Person Phone No.</label>
												<input type="text" class="form-control" placeholder="Enter contact person official phone no." name="ads_college_contact_person_phone" id="ads_college_contact_person_phone" value="<?php echo (!empty($college_data))?$college_data['college_phone_no']:'';?>">
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-sm-3">
											<div class="form-group">
												<label class="control-label">User Type</label>
												<select class="form-control" name="ads_ext_user_type" id="ads_ext_user_type">
													<option value="university">University</option>
													<option value="college">College</option>
													<option value="school">School</option>
													<option value="institute">Institute</option>
												</select>
											</div>
										</div>
									</div>
								</div>

								<div id="ads_colleges_div_3" style="display: none;">
									<div class="row">
										<div class="col-sm-12">
											<div class="form-group">
												<label class="control-label">Ads External Link</label>
												<input type="text" class="form-control" placeholder="Enter Link" name="ads_external_link" id="ads_external_link" value="">
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Ads Image</label>
											<input type="file" name="ads_image" class="file-upload-default">
											<div class="input-group col-xs-12">
												<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
												<span class="input-group-append">
													<button class="file-upload-browse btn btn-primary" type="button">Browse Image</button>
												</span>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<?php
									if(!empty($listing_data)){
										?>
										<div class="col-sm-12">
											<div class="form-group">
												<img src="<?php echo $listing_data['listing_imgae'];?>">
											</div>
										</div>
										<?php
									}
									?>
										
								</div>
								


								<h5>Ads Visibility</h5><hr>
								<div class="row">
									<div class="col-sm-3">
										<div class="form-group">
											<label class="control-label">Ads Visibility (Type)</label>
											<select class="form-control" name="ads_visibility" id="ads_visibility">
												<option value="0">Select Ads Visibility</option>
												<option value="1">Global (By Country)</option>
												<option value="2">Country & States Specific (By Country)</option>
											</select>
										</div>
									</div>
									<div class="col-sm-3" id="ads_country_div" style="display: none;">
										<div class="form-group">
											<label class="control-label">Ads Visibility (Country)</label>
											<select class="form-control" name="ads_country" id="ads_country">
												<option value="0">Select Country</option>
												<?php
												if(!empty($ads_countries)){
													foreach ($ads_countries as $key => $v) {
														?>
														<option value="<?php echo $v['country_id'];?>" <?php echo $v['selected'];?>><?php echo $v['country_name'];?></option>
														<?php
													}
												}

												?>
											</select>
										</div>
									</div>
								</div>

								<div id="ads_state"></div>

							</div>


							<div class="row" id="adsense_div" style="display:none;">
								<div class="form-group">
									<label class="control-label">Google Adsense/Amazon Code</label>
									<textarea class="form-control" rows="15" name="ads_custom_codes" id="ads_custom_code"></textarea>
								</div>
							</div>
							
							<div class="row">
								<div class="col-sm-3">
									<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_ads">Save</button>
								</div>
							</div>
						</form>
					</div>	
				</div>
			</div>
		</div>
	</div>
</div>

<style type="text/css">
	.select2-container{
		width: 100% !important;
	}
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