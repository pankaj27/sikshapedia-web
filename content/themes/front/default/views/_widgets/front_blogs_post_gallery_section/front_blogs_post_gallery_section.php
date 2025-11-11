<?php

if(!empty($blog_post_data)){
	?>
	<div class="post_gallery_slider">
		<?php
		$i=0;
		foreach ($blog_post_data as $key => $value) {
			?>
			 <div class="post_gallery_play">
                <div class="bg-image" style="background-image: url(<?php echo $value['post_cover_image'];?>);"></div>
                <div class="post__gallery_play_content">
                    <div class="post-meta">
                        <div class="meta-categories">
                            <a href="#"><?php echo $value['post_category'];?></a>
                        </div>
                        <div class="meta-date">
                            <span><?php echo $value['post_created_at'];?></span>
                        </div>
                    </div>
                    <h2 class="title"><a href="<?php echo $value['post_link'];?>"><?php echo $value['post_title'];?></a></h2>
                    <?php echo $value['post_intro'];?>
                </div>
                <?php
                if(!empty($value['post_video'])){
                	?>
                	<div class="post_play_btn">
	                    <a class="video-popup" href="https://www.youtube.com/watch?v=4mGyYNuG6us" a><i class="fas fa-play"></i></a>
	                </div>
                	<?php
                }
                ?>                
            </div>
			<?php
			$i++;
		}

		?>
	</div>
	<div class="post_gallery_inner_slider">
		<?php
		$d=0;
		foreach ($blog_post_data as $key => $value) {
			?>
			<div class="item">
                <img src="<?php echo $value['post_cover_image'];?>" alt="<?php echo $value['post_title'];?>" title="<?php echo $value['post_title'];?>" draggable="false" <?php echo ($d==0)?'loading="lazy"':'';?>>
            </div>
			<?php

			$d++;
		}
		?>
	</div>
	<?php
}