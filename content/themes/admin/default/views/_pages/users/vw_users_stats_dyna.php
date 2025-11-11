<?php


if(!empty($stat_data)){
	$i=1;
	foreach ($stat_data as $key => $value) {
		?>
		<tr>
			<td><?php echo $i;?></td>
			<td>
				<a href="<?php echo $value['inst_access_url'];?>" target="_blank"><?php echo $value['inst_name'];?></a><br>
				<strong>Logo:</strong> <span><img src="<?php echo $value['inst_logo'];?>" loading="lazy" style="<?php echo ($value['inst_logo_updated']=='Updated')?'border: 2px solid #1def11':'border: 2px solid #e60909';?>"></span>
				<strong>Banner:</strong> <span><img src="<?php echo $value['inst_banner'];?>" loading="lazy" style="<?php echo ($value['inst_banner_updated']=='Updated')?'border: 2px solid #1def11':'border: 2px solid #e60909';?>"></span>
			</td>
			<td><?php echo $value['inst_logo_updated_date'];?>/<?php echo $value['inst_banner_updated_date'];?></td>
		</tr>
		<?php
		$i++;
	}
}else{
	?>
	<tr>No data found</tr>
	<?php
}