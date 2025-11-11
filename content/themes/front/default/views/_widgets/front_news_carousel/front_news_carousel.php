<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($news_data)){
	?>
	<div id="newsCarousel" class="carousel slide" data-ride="carousel">
	                
	    <div class="carousel-inner">
	    	<?php
	    	$i=0;
	    	foreach ($news_data as $key => $value) {
	    		?>
		    	<div class="carousel-item tab-content <?php echo ($i==0)?'active':'';?>" id="c<?php echo $i;?>">
		            <img src="<?php echo $value['news_image'];?>" alt="<?php echo $value['news_title'];?>"  class="w-100">
		            <div class="carousel-caption">
		            <h4><a href="<?php echo $value['news_link'];?>" style="color:#ffffff;"><?php echo $value['news_title'];?> <a class="label label-primary color2" href="<?php echo $value['news_link'];?>" target="_blank">Read More</a></p>
		            </div>
		        </div>	
	    		<?php

	    		$i++;
	    	}

	    	?>    
	    </div>


	    <ul class="list-group col-sm-4 tab-titles">
	    	<?php
	    	$j=0;
	    	foreach ($news_data as $key => $value){
	    		?>
	    		<li data-target="#newsCarousel" data-slide-to="<?php echo $j;?>" class="list-group-item <?php echo ($j==0)?'active':'';?>">
		            <p class="text-truncate m-0"><?php echo $value['news_short_title'];?></p>
		            <small class="text-muted"><i class="far fa-clock"></i> <?php echo $value['news_publish_date'];?></small>
		        </li>
	    		<?php

	    		$j++;
	    	}
	    	?>
	       
	    </ul>
	</div>	
	<?php
}
?>

