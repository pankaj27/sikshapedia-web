<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="profile-content py-4">
	<div class="wrapper">
		<div class="row">
			<div class="col-lg-12 mb-4 mb-lg-0" id="general_tabs">
				<div class="card userCard">
					<div class="card-header bg-white">
		        	  <h5 class="m-0 d-inline">Hostels [For Men]</h5>
		        	</div>
		        	<div class="card-body">
	        			<form id="form_hostel_settings_men">
	        				<input type="hidden" name="data_type" value="hostel_settings_men">
	        				<table class="table" id="form_hostel_settings_men">
	        					<thead>
	        						<th>Rooms</th>
	        						<th>Non AC Rooms Charges(Per Annum)</th>
	        						<th>AC Rooms Charges(Per Annum)</th>
	        						<th></th>
	        					</thead>
	        					<tbody>
	        						<?php
	        						if(!empty($men_hostel_data)){
	        							$i=0;
	        							foreach ($men_hostel_data as $key => $value) {
	        								?>
	        								<tr id="tr<?php echo $i;?>">
				        						<td>
				        							<input type="number" min="0" class="form-control" name="hostel[<?php echo $i;?>][rooms]" name="hostel_rooms" aria-describedby="hostel_rooms" placeholder="Rooms" value="<?php echo $value->hostel_rooms;?>">
				        						</td>
				        						<td>
				        							<input type="number" min="0" class="form-control" name="hostel[<?php echo $i;?>][rooms_non_ac_charges]" name="hostel_rooms_non_ac_charges" aria-describedby="hostel_rooms_non_ac_charges" placeholder="0" value="<?php echo $value->hostel_non_ac_charge;?>">
				        						</td>
				        						<td>
				        							<input type="number" min="0" class="form-control" name="hostel[<?php echo $i;?>][rooms_ac_charges]" name="hostel_rooms_ac_charges" aria-describedby="hostel_rooms_ac_charges" placeholder="0" value="<?php echo $value->hostel_ac_charge;?>">
				        						</td>
				        						<?php
				        						if($i==0){
				        							?>
				        							<td><button type="button" class="btn btn-sm btn-primary" id="btn_add_hostel_row"><i class="fa fa-plus"></i></button></td>
				        							<?php
				        						}else{
				        							?>
				        							<td><button type="button" class="btn btn-sm btn-danger" onclick="$('#tr<?php echo $i;?>').remove()"><i class="fa fa-minus"></i></button></td>
				        							<?php
				        						}
				        						?>
				        						
				        					</tr>
	        								<?php
	        								$i++;
	        							}
	        						}else{
	        							?>
										<tr>
			        						<td>
			        							<input type="number" min="0" class="form-control" name="hostel[0][rooms]" name="hostel_rooms" aria-describedby="hostel_rooms" placeholder="Rooms" value="">
			        						</td>
			        						<td>
			        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_non_ac_charges]" name="hostel_rooms_non_ac_charges" aria-describedby="hostel_rooms_non_ac_charges" placeholder="0" value="">
			        						</td>
			        						<td>
			        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_ac_charges]" name="hostel_rooms_ac_charges" aria-describedby="hostel_rooms_ac_charges" placeholder="0" value="">
			        						</td>

			        						<td><button type="button" class="btn btn-sm btn-primary" id="btn_add_hostel_row"><i class="fa fa-plus"></i></button></td>
			        					</tr>
	        							<?php
	        						}
	        						?>	        						
	        					</tbody>
	        				</table>
	        				<div class="row">
	        					<div class="col-sm-12">
	        						<textarea class="form-control" name="hostel_extra_notes" rows="2"><?php echo (!empty($men_hostel_notes_data))?$men_hostel_notes_data->hostel_notes:'';?></textarea>
	        					</div>
	        				
	        					<div class="col-sm-12">
					               <button type="submit" class="btn btn-primary" id="btn_update_hostel_info">Update</button>
					            </div>
	        				</div>
	        			</form>
		        	</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-12 mb-4 mb-lg-0" id="general_tabs">
				<div class="card userCard">
					<div class="card-header bg-white">
		        	  <h5 class="m-0 d-inline">Hostels [For Women]</h5>
		        	</div>
		        	<div class="card-body">
	        			<form id="form_hostel_settings_women">
	        				<input type="hidden" name="data_type" value="hostel_settings_women">
                            <div class="table-responsive">
		        				<table class="table" id="form_hostel_settings_women">
		        					<thead>
		        						<th>Rooms</th>
		        						<th>Non AC Rooms Charges(Per Annum)</th>
		        						<th>AC Rooms Charges(Per Annum)</th>
		        						<th></th>
		        					</thead>
		        					<tbody>
		        						<?php
		        						if(!empty($women_hostel_data)){
		        							$j=0;
		        							foreach ($women_hostel_data as $key => $value) {
		        								?>
		        								<tr id="trw<?php echo $j;?>">
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[<?php echo $j;?>][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="<?php echo $value->hostel_rooms;?>">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[<?php echo $j;?>][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="0" value="<?php echo $value->hostel_non_ac_charge;?>">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[<?php echo $j;?>][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="0" value="<?php echo $value->hostel_ac_charge;?>">
					        						</td>
					        						<?php
					        						if($j==0){
					        							?>
					        							<td><button type="button" class="btn btn-sm btn-primary" id="btn_add_hostel_row_women"><i class="fa fa-plus"></i></button></td>
					        							<?php
					        						}else{
					        							?>
					        							<td><button type="button" class="btn btn-sm btn-danger" onclick="$('#trw<?php echo $j;?>').remove()"><i class="fa fa-minus"></i></button></td>
					        							<?php
					        						}
					        						?>
					        					</tr>
		        								<?php
		        								$j++;
		        							}
		        						}else{
		        							?>
		        							<tr>
				        						<td>
				        							<input type="number" min="0" class="form-control" name="hostel[0][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="">
				        						</td>
				        						<td>
				        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="0" value="">
				        						</td>
				        						<td>
				        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="0" value="">
				        						</td>
				        						<td><button type="button" class="btn btn-sm btn-primary" id="btn_add_hostel_row_women"><i class="fa fa-plus"></i></button></td>
				        					</tr>
		        							<?php
		        						}
		        						?>
		        						
		        					</tbody>
		        				</table>
	                            </div>
	        				<div class="row">
	        					<div class="col-sm-12">
	        						<textarea class="form-control" name="hostel_extra_notes_women" rows="2"><?php echo (!empty($women_hostel_notes_data))?$women_hostel_notes_data->hostel_notes:'';?></textarea>
	        					</div>
	        				
	        					<div class="col-sm-12">
					               <button type="submit" class="btn btn-primary" id="btn_update_hostel_women_info">Update</button>
					            </div>
	        				</div>
	        			</form>
		        	</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">let page='hostel_edit';let m_row='<?php echo isset($i)?$i:'0';?>';let wm_row='<?php echo isset($j)?$j:'0';?>';</script>