<?php
if(!empty($file_data)){
	$n=1;
	foreach ($file_data as $key => $value) {
		?>
		<li class="jFiler-item">
			<div class="jFiler-item-container">
				<div class="jFiler-item-inner">
					<div class="jFiler-item-thumb">
						<div class="jFiler-item-status"></div>
						<div class="jFiler-item-thumb-overlay img-fluid" data-file_id="<?php echo $value['file_id'];?>" data-file="<?php echo $value['file_url'];?>" data-file_name="<?php echo $value['file_wname'];?>" data-file_extension="<?php echo $value['file_extension'];?>" data-file_type="<?php echo $value['file_type'];?>">
			              	<div class="jFiler-item-info">
				                <div style="display:table-cell;vertical-align: middle;">
				                  <span class="jFiler-item-title">
				                    <b title="<?php echo $value['file_identification_name'];?>"><?php echo $value['file_identification_name'];?></b>
				                  </span>
				                  <span class="jFiler-item-others"><?php echo $value['file_size'];?></span>
				                </div>
			              	</div>
			            </div>
			            <div class="jFiler-item-thumb-image img-fluid" data-file_id="<?php echo $value['file_id'];?>" data-file="<?php echo $value['file_url'];?>" data-file_name="<?php echo $value['file_wname'];?>" data-file_extension="<?php echo $value['file_extension'];?>" data-file_type="<?php echo $value['file_type'];?>">
			            	<?php
			            	if($value['file_type']=='image'){
			            		?>
								<img src="<?php echo $value['file_url'];?>" draggable="false">
			            		<?php
			            	}else if($value['file_type']=='youtube'){
			            		?>
			            		<iframe width="560" height="315" src="<?php echo $value['file_url'];?>" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			            		<?php
			            	}
			            	?>
			            	
			            </div>
					</div>
					<div class="jFiler-item-assets jFiler-row">
			            <ul class="list-inline pull-left">
			              <li>
			                <div class="jFiler-jProgressBar" style="display: none;">
			                  <div class="bar" style="width: 100%;"></div>
			                </div>
			                <div class="jFiler-item-others text-error" style="">
			                  <i class="icon-jfi-minus-circle"></i> <?php echo $value['file_size'];?>
			                </div>
			              </li>
			            </ul>
			            <ul class="list-inline pull-right">
			              <li>
			                <a class="icon-jfi-trash jFiler-item-trash-action btn_del_file" data-file_id="<?php echo $value['file_id'];?>"></a>
			              </li>
			            </ul>
			        </div>
				</div>
			</div>
		</li>
		<?php
		$n++;
	}
}

?>

<script type="text/javascript">
	var total_data=<?php echo $recordsTotal;?>;
</script>