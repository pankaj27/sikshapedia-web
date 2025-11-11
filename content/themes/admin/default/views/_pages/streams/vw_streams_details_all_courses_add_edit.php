<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Add news</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-6 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">[ <?php echo $stream_data->stream_name;?> ] Stream Menu [ <?php echo $stream_menu->menu_name;?> ] Details</h6>
					<hr>
					<div class="col-md-12">
						<form id="form_stream_details_data_add_edit" method="post" enctype="multipart/form-data">
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<input type="hidden" name="_stream" id="_stream" value="<?php echo $stream_id;?>">
							<input type="hidden" name="_stream_menu" id="_stream_menu" value="<?php echo $stream_menu_id;?>">
							<div class="row">
								<div class="col-sm-12">
									<button type="submit" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_save_stream_course_group">Update Data</button>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<ol class="list-group list-group-sortable-connected" id="sortable_connected">
										<?php
										$i=1;
										foreach ($courses as $key => $value) {
											if(isset($value->courses_data_type)){
												?>
												<li class="list-group-item <?php echo ($value->courses_data_type=='ads')?'list-group-item-success':'list-group-item-info';?>">
													<input type="hidden" name="course_list_group[]" value="<?php echo $value->courses_data_type_id;?>#<?php echo $value->courses_data_type;?>">
													<?php echo $value->courses_data_type_value;?>
												</li>
												<?php
											}else{
												?>
												<li class="list-group-item list-group-item-info">
													<input type="hidden" name="course_list_group[]" value="<?php echo $value->course_id;?>#course">
													<?php echo $value->course_name;?>
												</li>
												<?php
											}

											$i++;
										}
										?>
			                        </ol>
			                    </div>
		                    </div>
						</form>
						
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-6 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Ads to Include</h6>
					<hr>
					<div class="col-md-12" id="colnected_ads">

						<?php
						if(!empty($ads)){
							?>
							<ol class="list-group list-group-sortable-connected" id="connected_url">
							<?php
							foreach ($ads as $key => $value) {
								?>
								<li class="list-group-item list-group-item-success"> <span><button class="btn btn-xs btn-primary">View Ads</button></span> <?php echo $value->listing_code;?> - <?php echo$value->listing_name;?>
									<input type="hidden" name="course_list_group[]" value="<?php echo $value->listing_id;?>#ads">
								</li>
								<?php
							}
							?>
							</ol>
							<?php
						}
						?>
					</div>
				</div>
			</div>
		</div>
	</div>



</div>

<script type="text/javascript">var stream_faq_row='';var p_row='';</script>
<!-- <link rel="stylesheet" href="//code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/ui/1.13.0/jquery-ui.js"></script> -->
<script>
  $( function() {
    $('.list-group-sortable-connected').sortable({
        placeholderClass: 'list-group-item',
        connectWith: '.connected',

        onDrop: function ($item, container, _super, event) {
        	console.log($item)
            // $('.list-group-sortable-connected li').removeClass('dragged');
            // $('.list-group-sortable-connected li').removeAttr('style');
            // $("body").removeClass('dragging');
            // $('#sortable_connected li>span').each(function (i) {
            //     var humanNum = i + 1;

            //     alert('hi');

            //     console.log(humanNum);
            //     $(this).html(humanNum);
            // });
        }
    });


  });
  </script>