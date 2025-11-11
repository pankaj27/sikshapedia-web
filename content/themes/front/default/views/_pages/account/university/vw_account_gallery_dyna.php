<?php defined('BASEPATH') OR exit('No direct script access allowed');?>


<?php 

if(!empty($gallery_data)){
	?>
	<div class="row">
		<?php
		$i=1;
		foreach ($gallery_data as $key => $value) {
			?>
			<div class="column">
			  <img src="<?php echo $value->media_disk_path_relative;?>" style="width:100%" onclick="openModal();currentSlide(<?php echo $i;?>)" class="hover-shadow cursor">
			</div>
			<?php
			$i++;
		}

		?>
	</div>

	<div id="myModal" class="modal">
		<span class="close cursor" onclick="closeModal()">&times;</span>
		<div class="modal-content">

			<?php
			$j=1;
			foreach ($gallery_data as $key => $value){
				?>
				<div class="mySlides">
				    <div class="numbertext"><?php echo $j;?> / <?php echo count($gallery_data);?></div>
				    <img src="<?php echo $value->media_disk_path_relative;?>" style="width:100%">
				</div>
				<?php
				$j++;
			}
			?>
		  
		  <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
		  <a class="next" onclick="plusSlides(1)">&#10095;</a>

		  <div class="caption-container">
		    <p id="caption"></p>
		  </div>

		  <?php
		  $x=1;
		  foreach ($gallery_data as $key => $value){
		  	?>
		  	<div class="column">
			    <img class="demo cursor" src="<?php echo $value->media_disk_path_relative;?>" style="width:100%" onclick="currentSlide(<?php echo $x;?>)" alt="Nature and sunrise">
			</div>
		  	<?php
		  	$x++;
		  }
		  ?>
		</div>
	</div>
	<?php
}

?>

