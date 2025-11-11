<?php

if(!empty($slug_urls)){
	$i=1;
	foreach ($slug_urls as $key => $value) {
		?>
		<tr>
			<td><?php echo $i;?></td>
			<td><a href="<?php echo $value['url_value'];?>" target="_blank"><?php echo $value['url_value'];?></a></td>
			<td><button type="button" class="btn btn-sm btn-dark">Regenerate</button></td>
		</tr>
		<?php

		$i++;
	}
}