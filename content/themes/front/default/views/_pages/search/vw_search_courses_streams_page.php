<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<section class="bradcumSec bg-white py-2">
    <div class="wrapper">
        <div class="row">
             <div class="col-md-8 mb-2 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">
                 <h4 class="m-0 text-center text-md-left text-uppercase"><?php echo $stream_category_data['category_name'];?></h4>
             </div>
             <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-end">
                 <nav aria-label="breadcrumb">
                     <ol class="breadcrumb bg-white m-0">
                     	<?php
                     	if(!empty($stream_category_data['bread_crumb'])){
                     		foreach ($stream_category_data['bread_crumb'] as $key => $value) {
                     			?>
                     			<li class="breadcrumb-item <?php echo ($value!='')?$value:'';?>" <?php echo ($value!='')?'aria-current="page"':'';?>>
                     				<?php
                     				if($value!=''){
                     					?>
                     					<a href="<?php echo $value;?>"><?php echo $key;?></a>
                     					<?php
                     				}else{
                     					echo $key;
                     				}

                     				?>

                     				</li>
                     			<?php
                     		}
                     	}
                     	?>
                     </ol>
                 </nav>
             </div>
        </div>
        <p><?php echo $stream_category_data['category_long_desc'];?></p>
    </div>
</section>

<section class="searchSesultSec pt-3 pb-4">
    <div class="wrapper">
    	<?php
    	if(!empty($ads_data)){
    		?>
    		<div class="row">
    			<div class="col-md-12">
    				<div class="adBlock ">
		                 <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" wfd-id="7973"><div data-ads-id="55107" data-ads-type="banner" data-page-type="global" class="ads_body_banner_container clearfix" wfd-id="7974"><a href="<?php echo $ads_data['ads_link'];?>" target="_blank" rel="nofollow" id="ads_viewport_55107" data-id="55107"><img src="<?php echo $ads_data['ads_image'];?>"></a></div>
		                 </div>
		            </div>
    			</div>
    		</div>
    		<?php
    	}

    	?>
    	<div class="row">
    	<?php
    	if(!empty($streams)){
    		foreach ($streams as $key => $value) {
    			?>
    			<div class="col-md-6">
	    			<div class="card listItemsCard  mb-4">
			            <div class="card-header bg-white d-flex justify-content-between align-items-center">
			              <h4 class=" text-uppercase d-flex align-items-center"> <span class="icon"> <?php echo $value['strteam_icon'];?> </span>  <span class="title"><?php echo $value['stream_name'];?></span> </h4>
			              <a href="<?php echo $value['stream_access_link'];?>" class="btn btn-primary btn-sm" target="_self">View all courses</a>
			            </div>
			            <?php
			            if(!empty($value['stream_courses'])){

			            	?>
			            	<ul class="list-group list-group-flush">
			            		<?php
			            		foreach ($value['stream_courses'] as $k => $v) {
			            			?>
			            			<li class="list-group-item">
					                  <div class="row">
					                      <h5 class="text-uppercase col-sm-9"><a href="<?php echo $v['access_link'];?>"><?php echo $v['course_name'];?></a></h5>
					                      <div class="col-sm-3 text-right"><i class="far fa-clock"></i> 3 Month ago </div>
					                  </div>
					                  <div>
					                      <a href="#" class="btn btn-link btn-sm">Course Revier</a>
					                      <a href="#" class="btn btn-primary btn-sm">Apply Now</a>
					                  </div>
					              	</li>
			            			<?php
			            		}
			            		?>
			            	</ul>
			            	<?php
			            }
			            ?>
			            <!-- <ul class="list-group list-group-flush">
			              <li class="list-group-item">
			                  <div class="row">
			                      <h5 class="text-uppercase col-sm-9">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
			                      <div class="col-sm-3 text-right"><i class="far fa-clock"></i> 3 Month ago </div>
			                  </div>
			                  <div>
			                      <a href="#" class="btn btn-link btn-sm">Course Revier</a>
			                      <a href="#" class="btn btn-primary btn-sm">Apply Now</a>
			                  </div>
			              </li>
			              <li class="list-group-item">
			                <div class="row">
			                    <h5 class="text-uppercase col-sm-9">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
			                    <div class="col-sm-3 text-right"><i class="far fa-clock"></i> 3 Month ago </div>
			                </div>
			                <div>
			                    <a href="#" class="btn btn-link btn-sm">Course Revier</a>
			                    <a href="#" class="btn btn-primary btn-sm">Apply Now</a>
			                </div>
			            </li>
			            <li class="list-group-item">
			                <div class="row">
			                    <h5 class="text-uppercase col-sm-9">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
			                    <div class="col-sm-3 text-right"><i class="far fa-clock"></i> 3 Month ago </div>
			                </div>
			                <div>
			                    <a href="#" class="btn btn-link btn-sm">Course Revier</a>
			                    <a href="#" class="btn btn-primary btn-sm">Apply Now</a>
			                </div>
			            </li>
			            <li class="list-group-item">
			                <div class="row">
			                    <h5 class="text-uppercase col-sm-9">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5>
			                    <div class="col-sm-3 text-right"><i class="far fa-clock"></i> 3 Month ago </div>
			                </div>
			                <div>
			                    <a href="#" class="btn btn-link btn-sm">Course Revier</a>
			                    <a href="#" class="btn btn-primary btn-sm">Apply Now</a>
			                </div>
			            </li>
			            </ul> -->
			        </div>
			    </div>
    			<?php
    		}
    	}
    	?>       
    	</div>
     </div> 
</section>

<?php $this->widget->run('front_subscription_section',TRUE);?>