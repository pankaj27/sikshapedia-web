<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
    <nav class="page-breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Courses List</li>
        </ol>
    </nav>
    <div class="row">
        <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Course</h6>
                    <form id="form_course">
                        <input type="hidden" name="_course" id="_course" value='<?php echo (isset($course_id))?$course_id:'';?>'>
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label class="control-label">Course Stream</label>
                                    <select class="form-control" name="course_streams" id="course_streams">
                                        <option value="">Select Stream</option>
                                        <?php
                                        if(!empty($streams)){
                                            foreach ($streams as $key => $value) {
                                                ?>
                                                <option value="<?php echo encode_data($value->stream_id);?>" <?php echo (isset($course_data) && $course_data->course_sstream==$value->stream_id)?'selected':'' ;?>><?php echo $value->stream_name;?></option>
                                                <?php
                                            }
                                        }
                                        ?>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label class="control-label">Course Name</label>
                                    <input type="text" class="form-control" placeholder="Enter course name" name="course_name" id="course_name" value="<?php echo (isset($course_data))?$course_data->course_name:'' ;?>">
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label class="control-label">Status</label>
                                    <select class="form-control" name="course_status">
                                        <option value="1" <?php echo (isset($course_data) && $course_data->course_status==1)?'selected':'' ;?>>Active</option>
                                        <option value="2" <?php echo (isset($course_data) && $course_data->course_status==2)?'selected':'' ;?>>Deactive</option>
                                    </select>
                                </div>
                            </div>                      
                            <div class="col-sm-3">
                                <button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_course">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
        
    <div class="row">
        <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Courses</h6>
                    <div class="table-responsive">
                        <table id="courses_list_table" class="table">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Course</th>
                                <th>Stream</th>
                                <th>Sub Stream</th>
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


<div class="modal fade bd-example-modal-xl" id="editCourseStreamModal" tabindex="-1" role="dialog" aria-labelledby="editCourseStreamModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCourseStreamModalTitle">Edit Course</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_course_edit">
	            <div class="modal-body">	            	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<input type="hidden" name="_course_edit_id" id="_course_edit_id" value="">
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
						</div>
	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_course_stream">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>

<script type="text/javascript">var course_id='';var course_parent='';var stream='';var degree=''; var _parent_stream='';var hdr='';var parent_folder ='';</script>