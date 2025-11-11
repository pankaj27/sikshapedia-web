<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php $this->widget->run('front_college_page_header_section',$show_college_header_widget);?>




<section class="pageDetailsSec py-4">
  <div class="wrapper">
    <div class="row">
      <div class="col-lg-12 mb-4 mb-lg-0">
        <div class="card userCard">
          <div class="card-header bg-white">
            <h5 class="m-0 d-inline">All Leads</h5>
            <small id="user_type" class="form-text text-muted">Leads details</small>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                	<?php
                	if($college_has_leads_access=='yes'){
                		?>
                		<table id="college_leads_list_table" class="table">
	                    <thead>
	                      <tr>
	                        <th>#</th>
													<th>Name</th>
													<th>Phone/Email</th>
													<th>Course</th>
													<th>State</th>
													<th>City</th>
													<th>District</th>
                          <!-- <th>Date</th> -->
                          <th>Remarks</th>
	                      </tr>
	                    </thead>
	                    <tbody></tbody>
	                  </table>
                		<?php
                	}else{
                		?>

                		<?php
                	}

                	?>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<div class="modal" tabindex="-1" role="dialog" id="modalLeadRemarks">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal Title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-lg-3" style="height: 400px; overflow-y: auto;">
                <ul class="list-group">
                    <li class="list-group-item" style="padding: 0;border:none;">
                        <div class="col-lg-12" id="remarks_list">
                            <div class="card" style="border: 1px solid black">
                                <div class="card-body">
                                    <p class="card-text">No Remarks yet</p>
                                    
                                </div>
                            </div>
                        </div>
                    </li>
                    <!-- Other list items -->
                </ul>
            </div>
          <div class="col-lg-1 vertical-separator"></div>
          <div class="col-lg-8">
            <form id="formLeadsRemarks">
              
              <input type="hidden" name="cadid" id="cadid">
              <div class="form-group">
                <label for="reason_text">Remarks</label>
                <textarea class="form-control" id="reason_text" name="reason_text" rows="3" placeholder="Add remarks"></textarea>
              </div>

              <div class="form-group">
                <label for="lead_status">Status</label>
                <select class="form-control" id="lead_status" name="lead_status">
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div class="form-group">
                <button type="submit" class="btn btn-primary" id="btn_submit_remarks">Add Remarks</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



  <!-- Modal -->
  

<!-- custom model design end-->




<style type="text/css">
  #application_list_table_paginate .pagination {
     float:right !important;
  }


  .dataTables_filter {
     float:right !important;
  }

  .vertical-separator {
    border-left: 1px solid #ddd;
    height: 100%;
  }

  #remarks_list .card-body{
    width:200px;
  }
  #remarks_list .card{
    padding:10px;
    border: 1px solid black;
    height:200px
    margin-bottom:5px;
  }

  #remarks_list .card-text{
    margin-bottom: 0.5rem!important;
  }

</style>

<?php $this->widget->run('front_subscription_section',true);?>


<script type="text/javascript">var wbpage='';var leads_access='<?php echo $college_has_leads_access;?>';</script>