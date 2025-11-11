<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Colleges List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Colleges
						<?php
                    	if($userdata->user_role=='1'){
                    		?>
                    		 <button type="button" class="btn btn-xs btn-primary" id="_btn_gen_url" style="float:right;">Generate URLs</button>
                    		 <button type="button" class="btn btn-xs btn-primary" id="_btn_gen_searchdata" style="float:right;">Generate Search Data</button>
                    		<?php
                    	}
                    	?>
					</h6>
					<div class="col-md-12">
						<div class="table-responsive">
							<table id="seo_college_list_table" class="table">
								<thead>
			                      <tr>
			                        <th>
			                        	<?php
			                        	if($userdata->user_role=='1'){
			                        		?>
			                        		<input type="checkbox" class="checkbox" id="check_seo_college">
			                        		<?php
			                        	}else{
			                        		?>
			                        		#
			                        		<?php
			                        	}
			                        	?>
			                        </th>
			                        <th>Name</th>
			                       	<th>Country</th>
			                        <th>State</th>
			                        <th>City</th>
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


<div class="modal fade bd-example-modal-xl" id="editCollegeMetaModal" tabindex="-1" role="dialog" aria-labelledby="editCollegeMetaModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCollegeMetaModalTitle">Edit Colleges</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body" id="meta_div">	            	
            		
            	
            </div>
            <div class="modal-footer">	            	
               <!--  <button type="submit" class="btn btn-primary" id="btn_update_college_meta">Update</button> -->
            </div>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl" id="editCollegeMetaModal1" tabindex="-1" role="dialog" aria-labelledby="editCollegeMetaModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCollegeMetaModalTitle">Edit Colleges</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_college_meta">
	            <div class="modal-body">	            	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<input type="hidden" name="_college" id="_college" value="">
						<div class="row">
							<div class="col-md-12">
			            		<div class="form-group">
									<label>College Meta Heading/Title</label>
									<input type="text" class="form-control" placeholder="Enter meta heading" name="college_meta_heading" id="college_meta_heading">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>College Meta Title</label>
									<input type="text" class="form-control" placeholder="Enter meta title" name="college_meta_title" id="college_meta_title">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>College Meta Keywords</label>
									<textarea class="form-control" placeholder="Enter meta keys" name="college_meta_keywords" id="college_meta_keywords" rows="3"></textarea>
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>College Meta Desc</label>
									<textarea class="form-control" placeholder="Enter meta desc" name="college_meta_desc" id="college_meta_desc" rows="5"></textarea>
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>College OG Title</label>
									<input type="text" class="form-control" placeholder="Enter og title" name="college_og_title" id="college_og_title">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>College OG Desc</label>
									<textarea class="form-control" placeholder="Enter og description" name="college_og_desc" id="college_og_desc" rows="5"></textarea>
								</div>
							</div>
						</div>
	            	
	            </div>
	            <!-- <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_college_meta">Update</button>
	            </div> -->
            </form>
        </div>
    </div>
</div>

<script type="text/javascript">var p_row='';</script>