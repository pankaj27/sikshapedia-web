<?php
if(!empty($streams)){
	foreach ($streams as $key => $value) {
		?>
		<tr>
			<td><?php echo $value['stream_name'];?></td>
			<td><?php echo $value['stream_access_url'];?></td>
			<td><?php echo $value['action'];?></td>
		</tr>
		<?php
	}
}

?>