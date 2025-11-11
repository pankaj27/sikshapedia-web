<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="profile-content py-4">
	<div class="wrapper">
		<div class="row">
			<div class="col-lg-12 mb-4 mb-lg-0" id="info_tabs">
				<div class="card userCard">
					<div class="card-header bg-white">
					  <h5 class="m-0 d-inline">Course & Fees Settings <a href="<?php echo base_url();?>account/course/add" class="btn btn-sm btn-primary pull-right">Add</a></h5>
					</div>
					<div class="card-body">

							<div class="table-responsive">
				                <table class="table display table-striped no-wrap" id="course_list_table">
				                    <thead>
				                    <tr>
				                        <th>#</th>
				                        <th>Course</th>
				                        <th>Duration</th>
				                        <th>Cost</th>
				                        <th>Action</th>
				                    </tr>
				                </thead>
				                <tbody>
				                </tbody>
				                </table>
				            </div>

					</div>
				</div>
			</div>
			<!-- <div class="col-lg-3 ">
				
			</div> -->
		</div>
	</div>
</div>
<script type="text/javascript">
	var user_currency_symbol_side='<?php echo $user_currency_symbol_side;?>';
	var currency='<?php echo $user_currency;?>';
	var page='course_edit';
</script>