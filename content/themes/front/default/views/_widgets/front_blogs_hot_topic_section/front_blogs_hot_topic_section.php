<?php
if(!empty($blog_post_data)){
	?>
	<div class="widget widget_recent_post wow fadeInUp">
		<div class="blog_main_heading_div">
			<div class="blog_heading_div">
				<h3 class="blog_bg_orange">Most Visited</h3>
			</div>
		</div>
		<ul>
			<?php
			foreach ($blog_post_data as $key => $value) {
				?>
				<li>
					<div class="blog_recent_post">
						<div class="blog_recent_post_img">
							<img src="<?php echo $value['blog_cover_image'];?>" class="img-fluid" style="border-radius: 10% !important;" alt="<?php echo $value['blog_title'];?>" loading="lazy">
						</div>
						<div class="blog_recent_post_content">
							<h4 <?php echo $value['blog_selected_color_class'];?>><a href="<?php echo $value['blog_link'];?>"><?php echo $value['blog_title'];?></a></h4>
							<p><?php echo $value['blog_post_date'];?> <a href="#">- <?php echo $value['blog_category'];?></a></p>
						</div>
					</div>
				</li>
				<?php
			}
			?>
		</ul>
	</div>
	<?php
}
?>