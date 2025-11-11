<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php $this->widget->run('front_college_page_header_section',$show_college_header_widget);?>




<section class="pageDetailsSec py-4">
      <div class="wrapper">
        <div class="row">
          
          <div class="col-lg-12 mb-4 mb-lg-0">
            <div class="card userCard">
              <div class="card-header bg-white">
                <h5 class="m-0 d-inline">All Enquireies</h5> <small id="user_type" class="form-text text-muted">You can update your branding details.It will be visible to the site visitor as college profile.</small>
              </div>
				<div class="card-body">
					<div class="row">
						<div class="col-md-12">
							<div class="table-responsive">
								<table id="application_list_table" class="table">
									<thead>
				                      <tr>
				                        <th>#</th>
				                        <th>Applicant</th>
				                        <th>Course</th>
				                        <th>Country</th>
				                        <th>State</th>
				                        <th>City</th>
				                        <th>Date</th>
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
    </div> 
  </section>




<style type="text/css">
	#application_list_table_paginate .pagination {
    float:right !important;
}


 .dataTables_filter {
    float:right !important;
}
</style>

<?php $this->widget->run('front_subscription_section',true);?>


<script type="text/javascript">var wbpage='';</script>