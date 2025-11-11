<div class="page-content">

	<?php
	if($userdata->user_role=='5'){
		if(!empty($quota)){
			?>
			<div class="row">
		        <div class="col-12 col-xl-12 stretch-card">
		            <div class="row flex-grow">
		              <div class="col-md-3 grid-margin stretch-card">
		                <div class="card">
		                  <div class="card-body">
		                    <div class="d-flex justify-content-between align-items-baseline">
		                      <h6 class="card-title mb-0">Total Upload</h6>
		                    </div>
		                    <div class="row">
		                      <div class="col-md-12">
		                        <h3 class="mb-2"><?php echo $quota['completed'];?></h3>
		                        <div class="d-flex align-items-baseline">
		                          <p class="text-success">
		                            <span>Year-<?php echo $quota['year'];?></span>
		                          </p>
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		              <div class="col-md-3 grid-margin stretch-card">
		                <div class="card">
		                  <div class="card-body">
		                    <div class="d-flex justify-content-between align-items-baseline">
		                      <h6 class="card-title mb-0">Admin Approved</h6>
		                    </div>
		                    <div class="row">
		                      <div class="col-md-12">
		                        <h3 class="mb-2"><?php echo $quota['approved'];?></h3>
		                        <div class="d-flex align-items-baseline">
		                          <p class="text-success">
		                            <span>Year-<?php echo $quota['year'];?></span>
		                          </p>
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		              <div class="col-md-3 grid-margin stretch-card">
		                <div class="card">
		                  <div class="card-body">
		                    <div class="d-flex justify-content-between align-items-baseline">
		                      <h6 class="card-title mb-0">Admin Not Approved</h6>
		                    </div>
		                    <div class="row">
		                      <div class=" col-md-12">
		                        <h3 class="mb-2"><?php echo $quota['not_approved'];?></h3>
		                        <div class="d-flex align-items-baseline">
		                          <p class="text-danger">
		                            <span>Year-<?php echo $quota['year'];?></span>
		                          </p>
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		              <div class="col-md-3 grid-margin stretch-card">
		                <div class="card">
		                  <div class="card-body">
		                    <div class="d-flex justify-content-between align-items-baseline">
		                      <h6 class="card-title mb-0">Earning  [ <?php echo $quota['month'];?>-<?php echo $quota['year'];?> ]</h6>
		                    </div>
		                    <div class="row">
		                      <div class="col-md-12">
		                        <h3 class="mb-2">₹<?php echo $quota['total_earned'];?></h3>
		                        <div class="d-flex align-items-baseline">
		                          <p class="text-success">
		                            <span>Year-<?php echo $quota['year'];?></span>
		                          </p>
		                        </div>
		                      </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		            </div>
		        </div>
		    </div>
			<?php
		}
	}else{
		if(!empty($quota)){
			?>
			<div class="row">
			    <div class="col-12 col-xl-12 stretch-card">
			        <div class="row flex-grow">
			            <div class="col-md-3 grid-margin stretch-card">
			                <div class="card">
			                  <div class="card-body">
			                    <div class="d-flex justify-content-between align-items-baseline">
			                      <h6 class="card-title mb-0">Total Upload</h6>
			                    </div>
			                    <div class="row">
			                      <div class="col-md-12">
			                        <h3 class="mb-2"><?php echo $quota['total_uploaded_prev_month'];?></h3>
			                        <div class="d-flex align-items-baseline">
			                          <p class="text-success">
			                            <span><?php echo $quota['prev_month'];?>-<?php echo $quota['year'];?></span>
			                          </p>
			                        </div>
			                      </div>
			                    </div>
			                  </div>
			                </div>
			            </div>
			            <div class="col-md-3 grid-margin stretch-card">
			                <div class="card">
			                  <div class="card-body">
			                    <div class="d-flex justify-content-between align-items-baseline">
			                      <h6 class="card-title mb-0">Till Upload</h6>
			                    </div>
			                    <div class="row">
			                      <div class="col-md-12">
			                        <h3 class="mb-2"><?php echo $quota['total_uploaded_current_month'];?></h3>
			                        <div class="d-flex align-items-baseline">
			                          <p class="text-success">
			                            <span><?php echo $quota['month'];?>-<?php echo $quota['year'];?></span>
			                          </p>
			                        </div>
			                      </div>
			                    </div>
			                  </div>
			                </div>
			            </div>
			        </div>
			    </div>
			</div>
			<?php
		}			
	}		
	?>

	<!-- <h1 id="log">hello</h1> -->


</div>


<script type="text/javascript">var p_row='';</script>