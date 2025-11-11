<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Courses's List</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Courses</h6>
					<div class="table-responsive">
						<table id="seo_courses_list_table2" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Courses Name</th>
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


<div class="modal fade bd-example-modal-xl" id="editCourseMetaModal" tabindex="-1" role="dialog" aria-labelledby="editCourseMetaModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCourseMetaModalTitle">Edit Course Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_course_meta">
	            <div class="modal-body">	            	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<input type="hidden" name="_course" id="_course" value="">
						<div class="row">
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Course Page URL (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter page heading" name="course_page_url" id="course_page_url">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Course Page Heading (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter page heading" name="course_page_heading" id="course_page_heading">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Course Meta Title (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter meta title" name="course_meta_title" id="course_meta_title">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Course Meta Keywords (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter meta keys" name="course_meta_keywords" id="course_meta_keywords" rows="3"></textarea>
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Course Meta Desc (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter meta desc" name="course_meta_desc" id="course_meta_desc" rows="5"></textarea>
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Course OG Title (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter og title" name="course_og_title" id="course_og_title">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Course OG Desc (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter og description" name="course_og_desc" id="course_og_desc" rows="5"></textarea>
								</div>
							</div>
						</div>
	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_course_meta">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl modal-fullscreen" id="editCourseMenuMetaModal" tabindex="-1" role="dialog" aria-labelledby="editCourseMenuMetaModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCourseMenuMetaModalTitle">Edit Course Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body">
            	<div class="row" id="div_course_meta_body"></div>
            </div>
        </div>
    </div>
</div>



<div class="modal fade bd-example-modal-xl modal-fullscreen" id="editCourseMenuMetaStructuredDataModal2" tabindex="-1" role="dialog" aria-labelledby="editCourseMenuMetaStructuredDataModal2" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCourseMenuMetaStructuredDataModalTitle">Edit Course Structure Data</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body">
            	<div class="row" id="div_course_meta_strcture_data_body"></div>
            </div>
        </div>
    </div>
</div>



<script type="text/javascript">
	var p_row='';

</script>