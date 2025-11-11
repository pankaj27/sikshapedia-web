<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Email Campaign's List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">All Campaigns

						<!-- <button type="button" class="btn btn-primary" id="btn_send_mail" style="float:right;">Send Builk Email</button> -->

						<a href="<?php echo $admin_base_url;?>/emailcampaigns/add" class="btn btn-primary" id="btn_send_mail" style="float:right;">Create Campaign</a>
					</h6>
					<div class="table-responsive">
						<table id="campaign_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Campaign Name</th>
		                        <th>Template</th>
		                        <th>Dates</th>
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


<div class="modal fade bd-example-modal-xl" id="contactModal" tabindex="-1" role="dialog" aria-labelledby="contactModal" aria-hidden="true" style="width:100%;">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="contactModalTitle">Add/Edit Contact</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body" id="campaign_contact_div">
            	<form id="form_campaign_contact_data">
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<div class="row mt-10">
		              <div class="col-md-6">
		                <div class="form-group">
		                  <label>
		                    <strong>Firstname</strong>
		                  </label>
		                  <input type="text" class="form-control valid" placeholder="Enter firstname" name="contact_firstname" id="contact_firstname" aria-invalid="false" value="">
		                </div>
		              </div>
		              <div class="col-md-6">
		                <div class="form-group">
		                  <label>
		                    <strong>Lastname</strong>
		                  </label>
		                  <input type="text" class="form-control valid" placeholder="Enter lastname" name="contact_lastname" id="contact_lastname" aria-invalid="false" value="">
		                </div>
		              </div>
		            </div>
		            <div class="row mt-10">
			            <div class="col-md-6">
			                <div class="form-group">
			                  <label>
			                    <strong>Country</strong>
			                  </label>
			                  <select class="form-control" name="contact_country" id="contact_country">
			                  	<option value="0">Select Country Code</option>
			                  	<option value="+91">+91 - (India)</option>
			                  </select>
			                </div>
			            </div>
			            <div class="col-md-6">
			                <div class="form-group">
			                  <label>
			                    <strong>Phone No</strong>
			                  </label>
			                  <input type="text" class="form-control valid" placeholder="Enter firstname" name="contact_phone" id="contact_phone" aria-invalid="false" value="">
			                </div>
			            </div>		              
		            </div>

		            <div class="row mt-10">
		              <div class="col-md-12">
		                <div class="form-group">
		                  <button class="btn btn-primary" type="submit" id="btn_create_campaign_contact">Create</button>
		                </div>
		              </div>
		            </div>
            	</form>
            </div>
        </div>
    </div>
</div>