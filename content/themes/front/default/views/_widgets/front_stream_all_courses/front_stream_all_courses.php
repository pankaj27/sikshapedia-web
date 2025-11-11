
<?php
if(!empty($courses)){
	foreach ($courses as $key => $value) {

		if($value['courses_data_type']=='course'){
			?>
			<div class="card mb-3">
			    <div class="card-body">
			        <div class="row">
			          <div class="col-md-9">
			              <h5 class="text-uppercase"><?php echo $value['courses_data_type_value'];?></h5>

			              <?php
			              if($value['course_duration_type']!=null && $value['course_duration']!=''){
			              	?>
			              	<div><span class="color1"> <?php echo $value['course_duration'];?> </span> | <span class="color2"> <?php echo $value['course_duration_type'];?> </span></div>
			              	<?php
			              }else if($value['course_duration_type']==null && $value['course_duration']!=''){
			              	?>
			              	<div><span class="color1"> <?php echo $value['course_duration'];?> </span> </div>
			              	<?php
			              }else if($value['course_duration_type']!=null && $value['course_duration']==''){
			              	?>
			              	<div><span class="color2"> <?php echo $value['course_duration_type'];?> </span></div>
			              	<?php
			              }

			              ?>

			              
			          </div>
			          <?php
			          if(!empty($value['cpourse_offerd_total_colleges'])){
			          	?>
		          		<div class="col-md-3 text-right">
			              <h2 class="color2"><?php echo $value['cpourse_offerd_total_colleges'];?></h2>
			              <p>College offering this course</p>
			          	</div>
			          	<?php
			          }
			          ?>
			          
			          <div class="col-md-12">
			            <!-- <a href="#" class="btn btn-primary btn-outline-primary btn-sm btn-round text-uppercase border">Courses Overview</a>
						<a href="#" class="btn btn-primary btn-outline-primary btn-sm btn-round text-uppercase border">Career Option & Jobs</a> -->
			            <button type="button" class="btn btn-primary btn-sm btn-round text-uppercase border" data-target="#reg4ApplyModal" data-toggle="modal">Apply Now</button>
			          </div>
			      </div>
			    </div>
			</div>
			<?php
		}else{
			?>
			<div class="mb-1" style="margin-top: -5px;margin-bottom: -25px;">
				<?php echo $value['courses_data_type_value'];?>
			</div>
			<?php
			
		}
	}
}
?>






<style>
	.btn-round{
		border-radius: 20px;
	}

	.btn-outline-primary{
	    border: 1px solid #fff;
	    border-radius: 50px;
	    padding: 6px 12px;
	    font-size: 12.352 !important;
	}

	 .text-uppercase {
        text-transform: uppercase;
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

