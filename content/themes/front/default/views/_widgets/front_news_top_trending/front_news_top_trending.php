<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($news_data)){
	?>
	<div class="card notificationCard mb-4">
		<div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  <h5 class="m-0">Top Treanding News</h5>
		</div>
		<ul class="list-group list-group-flush">
			<?php
			foreach ($news_data as $key => $value) {
				?>
				<li class="list-group-item">
				    <a href="#" class="media">
				      <img src="<?php echo $value['news_image'];?>" width="40" class="mr-2" alt="..."> 
				      <div class="media-body">
				        <h6 class="mb-0 color2"><?php echo $value['news_short_title'];?></h6>
				        <small> <?php echo $value['news_publish_date'];?> </small> 
				      </div>
				    </a>
				</li>
				<?php
			}
			?>
		</ul>
		<!-- <div class="card-header bg-white text-center">
		  <a class="#">View All News</a>
		</div> -->
	</div>
	<?php
}
?>	