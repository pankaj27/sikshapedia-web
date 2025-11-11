<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

if(!empty($news_details_data)){
	?>
	<div class="card infoCard mb-4">
		<div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
		    <div class="media">
		      <!-- <a href="#" class="mr-3 "><img class="img-circle" src="assets/img/avatar.jpg" width="60" alt=""></a> -->
		      <div class="media-body">
		        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> By <?php echo $news_details_data['news_data']->created_by_name;?>  </a> </h5>
		        <p class="m-0">Content Curator 
		          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
		          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
		          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
		        </p>
		      </div>
		    </div>
		    <div class="updateDate"></div>
		</div>
		<div class="card-body">
			<?php
			if(!empty($news_details_data['news_data']->news_image_banner_url)){
				?>
				<img class="img-thumbnail" src="<?php echo $news_details_data['news_data']->news_image_banner_url;?>" alt="<?php echo $news_details_data['news_data']->news_title;?>" loading="lazy" style="width: 100%;">
				<?php
			}
			?>

			<h4><span><?php echo $news_details_data['news_data']->news_title;?></span></h4>

			<?php

				if(!empty($news_details_data['news_details'])){
					foreach ($news_details_data['news_details'] as $key => $value) {

						if($value->news_data_type=='general'){
							echo $value->news_content;
						}else if($value->news_data_type=='image'){
							?>
							<img class="img-thumbnail" src="<?php echo $value->news_content;?>" alt="<?php echo $news_details_data['news_data']->news_title;?>" loading="lazy" style="width: 100%;">
							<?php
						}
						
					}
				}
			?>
		</div>
	</div>
	<?php
}