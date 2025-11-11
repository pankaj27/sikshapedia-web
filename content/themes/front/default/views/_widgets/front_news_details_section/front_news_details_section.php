<?php defined('BASEPATH') OR exit('No direct script access allowed');

	
	if(!empty($news_details_data)){
		?>
		<div class="card infoCard mb-4">
			<div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
			    <div class="media">
			      <a class="mr-3 "><img class="img-circle" src="<?php echo $news_details_data['news_curator_image'];?>" width="60" alt=""></a>
			      <div class="media-body">
			        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> By <?php echo $news_details_data['news_curator'];?></a> </h5>
			        <p class="m-0">Content Curator 
			        <!--   <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
			          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
			          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>-->
			        </p>
			      </div>
			    </div>
			    <div class="updateDate">Updated on <?php echo $news_details_data['news_updated_at'];?></div>
			</div>
			<div class="card-body">
				<?php
				if(!empty($news_details_data['news_details'])){
					foreach ($news_details_data['news_details'] as $key => $value) {

						if($value->news_data_type=='general'){
							echo $value->news_content;
						}else if($value->news_data_type=='image'){
							?>
							<div class="text-align:center;">
								<img class="img" src="<?php echo $value->news_content;?>?tr=w-800,h-500,c-force?tr=w-650,h-400,c-force" alt="<?php echo $news_details_data['news_data']->news_title;?>" loading="lazy" style="max-width: 800px;width:617px;height: 486px; margin: 0;justify-content: center;">
							</div>
							<?php
						}
						
					}
				}
				?>
			</div>
		</div>
		<?php
	}


?>