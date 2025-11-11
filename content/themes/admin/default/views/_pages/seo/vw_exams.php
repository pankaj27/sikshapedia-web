<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Exam's List</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Exams</h6>
					<div class="table-responsive">
						<table id="seo_exam_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Exam Name</th>
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

<!-- <div class="modal fade bd-example-modal-xl" id="editExamMetaModal" tabindex="-1" role="dialog" aria-labelledby="editExamMetaModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editExamMetaModalTitle">Edit Exam Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_exam_meta">
	            <div class="modal-body">	            	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<input type="hidden" name="_exam" id="_exam" value="">
	            		<input type="hidden" name="_exam_stream" id="_exam_stream">
						<div class="row">
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Page URL (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter page heading" id="exam_page_url" readonly="true">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Page Heading (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter page heading" name="exam_page_heading" id="exam_page_heading">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Meta Title (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter meta title" name="exam_meta_title" id="exam_meta_title">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Meta Keywords (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter meta keys" name="exam_meta_keywords" id="exam_meta_keywords" rows="3"></textarea>
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Meta Desc (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter meta desc" name="exam_meta_desc" id="exam_meta_desc" rows="5"></textarea>
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam OG Title (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter og title" name="exam_og_title" id="exam_og_title">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam OG Desc (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter og description" name="exam_og_desc" id="exam_og_desc" rows="5"></textarea>
								</div>
							</div>
						</div>
	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_exam_meta">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div> -->


<div class="modal fade bd-example-modal-xl modal-fullscreen" id="editExamMetaModal2" tabindex="-1" role="dialog" aria-labelledby="editExamMetaModal2" aria-hidden="true" style="z-index:99999;">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editExamMetaModal2Title">Edit Exam Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            
            <div class="modal-body">
            
            </div>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl" id="examUrls" tabindex="-1" role="dialog" aria-labelledby="examUrls" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editExamMetaModalTitle">Edit Exam Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>

            <div class="modal-body">
            	<div class="row" id="exam_slugs_urls_div">
            		<div class="col-lg-12">
			            <div class="table-responsive">
			            	<table class="table table-bordered" id="exam_slugs_urls" style="width:100%;">
			            		<thead>
			            			<tr>
			            				<td class="menu_order">Menu Order</td>
			            				<td>Menu Nmae/Slug</td>
			            				<td>Action</td>
			            			</tr>
			            		</thead>
			            	</table>
			            </div>
			        </div>
		        </div>
		       
	        </div>
        </div>
    </div>
</div>

<style type="text/css">
	.swal2-container{
		z-index:99999;
	}
</style>

<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/rapid-automated-keyword-extraction@1.0.1/dist/index.min.js"></script>
<script type="text/javascript">var p_row ='';</script>