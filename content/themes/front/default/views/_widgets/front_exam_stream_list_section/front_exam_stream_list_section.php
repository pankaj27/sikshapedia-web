<?php
if(!empty($streams)){
	?>
	<h5 class="mb-3">SEARCH BY STREAM</h5>
    <div class="btnGroup">
    	<?php
    	foreach ($streams as $key => $value) {
    		?>
    		<a href="<?php echo $value['stream_url'];?>" class="btn btn-light btn-sm "> <?php echo $value['stream_name'];?> <span class="badge badge-primary"><?php echo $value['stream_exams_count'];?></span> </a>
    		<?php
    	}
    	?>
    </div>
	<?php
}

?>