

<?php
	if(!empty($data_preview)){
		?>
		<div class="row">
			<div class="col-md-12 grid-margin stretch-card">
				<div class="table-responsive" style="max-height: 300px;">							    
								<table class="table">
									<thead>
				                      <tr>
				                        <th>S.No.</th>
				                        <th>Name</th>
				                        <th>Email</th>
				                        <th>Phone No</th>
				                        <th>Estd. Date</th>
				                        <th>District</th>
				                        <th>City</th>
				                        <th>Address</th>
				                        <th>Pincode</th>
				                      </tr>
				                    </thead>
				                    <tbody>
				                    <?php
				                    $i=1;
				                    foreach ($data_preview as $key => $value) {
				                    	$college_name_data=char_separated_to_array($value['college_name'],'#');

				                    	if($college_name_data[0]=='1'){
				                    		$name_back_color='bgcolor="#f70b20" color="#ffffff"';
				                    	}else{
				                    		$name_back_color='bgcolor="#ffffff" color="#000000"';
				                    	}


				                    	$college_email_data=char_separated_to_array($value['college_email'],'#');

				                    	if($college_email_data[0]=='1'){
				                    		$email_back_color='bgcolor="#f70b20" color="#ffffff"';
				                    	}else{
				                    		$email_back_color='bgcolor="#ffffff" color="#000000"';
				                    	}

				                    	$college_phone_data=char_separated_to_array($value['college_phone'],'#');

				                    	if($college_phone_data[0]=='1'){
				                    		$phone_back_color='bgcolor="#f70b20" color="#ffffff"';
				                    	}else{
				                    		$phone_back_color='bgcolor="#ffffff" color="#000000"';
				                    	}
				                    	?>
				                    	<tr>
				                    		<td><?php echo $i;?></td>
				                    		<td <?php echo $name_back_color;?>><?php echo $college_name_data[1];?></td>
				                    		<td <?php echo $email_back_color;?>><?php echo $college_email_data[1];?></td>
				                    		<td <?php echo $phone_back_color;?>><?php echo $college_phone_data[1];?></td>
				                    		<td><?php echo $value['college_estd'];?></td>
				                    		<td><?php echo $value['college_district'];?></td>
				                    		<td><?php echo $value['college_city'];?></td>
				                    		<td><?php echo $value['college_address'];?></td>
				                    		<td><?php echo $value['college_pincode'];?></td>
				                    	</tr>
				                    	<?php
				                    	$i++;
				                    }
				                    ?>	                    	
				                    </tbody>
								</table>
							</div>
			</div>
		</div>
		<?php
	}


?>