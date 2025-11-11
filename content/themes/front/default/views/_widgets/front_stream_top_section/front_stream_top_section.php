<?php
	if(!empty($streams)){
		?>
		<div class="card mb-4">
		    <div class="card-header bg-white">
		      <h5 class="m-0 text-uppercase">TOP Streams</h5>
		    </div>
		    <ul class="list-group list-group-flush">
		      <?php
		      foreach ($streams as $key => $value) {
		        ?>
		        <li class="list-group-item">
		          <a href="<?php echo $value['stream_url'];?>" class="media">
		            <div class="media-body">
		              <h6 class="mb-0 color2"><?php echo $value['stream_name'];?></h6>
		            </div>
		          </a>
		        </li>
		        <?php
		      }
		      ?>            
		    </ul>
		</div>
		<?php
	}
?>

<style type="text/css">
  .text-uppercase {
        text-transform: uppercase;
    }
 </style>