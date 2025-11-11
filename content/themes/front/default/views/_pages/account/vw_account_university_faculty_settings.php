<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="profile-content py-4">
	<div class="wrapper">
		<div class="row">
			<div class="col-lg-12 mb-4 mb-lg-0">
				<div class="card userCard">
					<div class="card-header bg-white">
					  <h5 class="m-0 d-inline">Faculties <a href="<?php echo base_url();?>account/faculties/add" class="btn btn-sm btn-primary pull-right">Add</a></h5>
					</div>
					<div class="card-body">

							<div class="table-responsive">
				                <table class="table display table-striped no-wrap" id="faculty_list_table">
				                    <thead>
				                    <tr>
				                        <th>#</th>
				                        <th>Name</th>
				                        <th>Email</th>
				                        <th>Phone No.</th>
				                        <th>Status</th>
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
		</div>
	</div>
</div>

