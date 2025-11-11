ac<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Courses Category List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Course Categories</h6>
					<div class="table-responsive">
						<table id="courses_category_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Category</th>
		                        <th>Streams</th>
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

	<div class="modal fade bd-example-modal-xl" id="coursecategoryStreamModal" tabindex="-1" role="dialog" aria-labelledby="coursecategoryStreamModal" aria-hidden="true">
	    <div class="modal-dialog modal-xl" role="document">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="coursecategoryStreamModal">Streams</h5>
	                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	            </div>
	            <div class="modal-body">
	            	<div class="table-responsive">
						<table id="courses_category_stream_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>Stream</th>
		                        <th>Url</th>
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

	<div class="modal fade bd-example-modal-xl" id="courseStreamSlugsModal" tabindex="-1" role="dialog" aria-labelledby="courseStreamSlugsModal" aria-hidden="true">
	    <div class="modal-dialog modal-xl" role="document">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="courseStreamSlugsModal">Streams</h5>
	                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	            </div>	            
            	<form id="form_courses_category_stream_slugs">
	            	<input type="hidden" name="course_stream_category" id="course_stream_category" value="">
	            	<input type="hidden" name="course_category_stream" id="course_category_stream" value="">
	            	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            <div class="modal-body">
	            		<div class="row">
	            			<div class="col-md-12">
		            			<input type="text" class="form-control" id="course_stream_url_meta_heading" name="course_stream_url_meta_heading" placeholder="Meta Heading" style="border-color: #000000;">
		            		</div>
	            		</div>
	            		<div class="row">
	            			<div class="col-md-12">
		            			<input type="text" class="form-control" id="course_stream_url_meta_title" name="course_stream_url_meta_title" placeholder="Meta Title" style="border-color: #000000;">
		            		</div>
	            		</div>
	            		<div class="row">
	            			<div class="col-md-12">
		            			<input type="text" class="form-control" id="course_stream_url_meta_keywords" name="course_stream_url_meta_keywords" placeholder="Meta Keywords" style="border-color: #000000;">
		            		</div>
	            		</div>
	            		<div class="row">
	            			<div class="col-md-12">
		            			<input type="text" class="form-control" id="course_stream_url_meta_desc" name="course_stream_url_meta_desc" placeholder="Meta Description" style="border-color: #000000;">
		            		</div>
	            		</div>
	            		<div class="row">
	            			<div class="col-md-12">
		            			<input type="text" class="form-control" id="course_stream_url_og_title" name="course_stream_url_og_title" placeholder="OG Title" style="border-color: #000000;">
		            		</div>
	            		</div>
	            		<div class="row">
	            			<div class="col-md-12">
		            			<input type="text" class="form-control" id="course_stream_url_og_desc" name="course_stream_url_og_desc" placeholder="OG Description" style="border-color: #000000;">
		            		</div>
	            		</div>
	            		<div class="row">
	            			<div class="col-md-12">
		            			<input type="text" class="form-control" id="course_stream_url_page_heading" name="course_stream_url_page_heading" placeholder="Page Heading" style="border-color: #000000;">
		            		</div>
	            		</div>
	            		<div class="row">
	            			<div class="col-md-12">
		            			<input type="text" class="form-control" id="course_stream_url_page_sub_heading" name="course_stream_url_page_sub_heading" placeholder="Page Sub Heading" style="border-color: #000000;">
		            		</div>
	            		</div>        	
		            </div>
		            <div class="modal-footer">
		                <button type="submit" class="btn btn-primary" id="btn_add_course_stream_url">Update</button>
		            </div>
	            </form>
	        </div>
	    </div>
	</div>


<script type="text/javascript">var course_parent='';</script>