<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash']; ?>">
<input type="hidden" name="_course_id" id="_course_id" value="<?php echo $course_data->course_id; ?>">
<input type="hidden" name="_course_stream_id" id="_course_stream_id" value="<?php echo $course_data->course_stream; ?>">
<input type="hidden" name="_course_sub_stream_id" id="_course_sub_stream_id" value="<?php echo $course_data->course_sub_stream; ?>">

<div class="row">
    <div class="col-md-6">
        <div class="form-group">
            <label>Course Name</label>
            <input type="text" class="form-control" placeholder="Enter page heading" value="<?php echo $course_data->course_name; ?>" disabled="true">
        </div>
    </div>
    <div class="col-sm-6">
        <div class="form-group">
            <label class="control-label">Course Short Name</label>
            <input type="text" class="form-control" placeholder="Enter course name" id="course_short_name" value="<?php echo (isset($course_data))?$course_data->course_short_name:'' ;?>" disabled="true">
        </div>
    </div>
</div>


<div class="row">
    <div class="col-sm-6">
        <div class="form-group">
            <label class="control-label">Parent Course</label>
            <select class="form-control" name="_parent_course" id="_parent_course">
                <option value="0">Select Course</option>
                <?php
                if(!empty($parent_courses)){
                    foreach ($parent_courses as $key => $value) {
                        ?>
                        <option value="<?php echo encode_data($value->course_id);?>"><?php echo $value->course_name;?></option>
                        <?php
                    }
                }
                ?>
            </select>
        </div>
    </div>
    <div class="col-sm-6">
        <div class="form-group">
            <label class="control-label">Course Category</label>
            <select class="form-control" name="course_streams_category" id="course_streams_category">
                <option value="">Select Stream Ctaegory</option>
                <?php
                if(!empty($course_stream_categories)){
                    foreach ($course_stream_categories as $key => $value) {
                        ?>
                        <option value="<?php echo encode_data($value->stream_category_id);?>" <?php echo ($value->stream_category_id==$course_data->course_category)?'selected':'' ;?>><?php echo $value->stream_category;?></option>
                        <?php
                    }
                }
                ?>
            </select>
        </div>
    </div>
</div>

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
    <div class="col-sm-4">
        <div class="form-group">
            <label class="control-label">Course Sub Stream</label>
            <select class="form-control" name="course_sub_streams" id="course_sub_streams">
                <option value="0">Select Stream</option>
                
            </select>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="form-group">
            <label class="control-label">Course Degree Type</label>
            <select class="form-control" name="course_degree_type" id="course_degree_type">
                <option value="">Select Type</option>
                <option value="Doctorate" <?php echo ($course_data->course_type=='Doctorate')?'selected':'' ;?>>Doctorate</option>
                <option value="Degreee" <?php echo ($course_data->course_type=='Degreee')?'selected':'' ;?>>Degreee</option>
                <option value="Diploma" <?php echo ($course_data->course_type=='Diploma')?'selected':'' ;?>>Diploma</option>
                <option value="Certificate" <?php echo ($course_data->course_type=='Certificate')?'selected':'' ;?>>Certificate</option>
            </select>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="form-group">
            <label class="control-label">Course Pass Type</label>
            <select class="form-control" name="course_pass_type" id="course_pass_type">
                <option value="">Select Type</option>
                <option value="Phd" <?php echo ($course_data->course_passed_type=='Phd')?'selected':'' ;?>>Phd</option>
                <option value="Graduation" <?php echo ($course_data->course_passed_type=='Graduation')?'selected':'' ;?>>Graduation</option>
                <option value="Post Graduation" <?php echo ($course_data->course_passed_type=='Post Graduation')?'selected':'' ;?>>Post Graduation</option>
                <option value="Diploma" <?php echo ($course_data->course_passed_type=='Diploma')?'selected':'' ;?>>Diploma</option>
                <option value="Certificate" <?php echo ($course_data->course_passed_type=='Certificate')?'selected':'' ;?>>Certificate</option>
            </select>
        </div>
    </div>
</div>

<div class="row">

    <div class="col-sm-6">
        <div class="form-group">
            <label class="control-label">Course Duration(Year)</label>
            <select class="form-control" name="course_duration" id="course_duration">
                <option value="">Select Duration</option>
                <?php
                for ($i=1; $i <=10; $i++) { 
                    ?>
                    <option value="<?php echo $i;?>" <?php echo ($course_data->course_duration==$i)?'selected':'' ;?>><?php echo $i;?></option>
                    <?php
                }
                ?>
            </select>
        </div>
    </div>

    <div class="col-sm-6">
        <div class="form-group">
            <label class="control-label">Course Duration(Month)</label>
            <select class="form-control" name="course_duration_month" id="course_duration_month">
                <option value="">Select Duration</option>
                <?php
                for ($i=1; $i <=11; $i++) { 
                    ?>
                    <option value="<?php echo $i;?>" <?php echo ($course_data->course_duration_month==$i)?'selected':'' ;?>><?php echo $i;?></option>
                    <?php
                }
                ?>
            </select>
        </div>
    </div>
    </div>
    <div class="row">
    <div class="col-sm-6">
        <div class="form-group">
            <label class="control-label">Course Duration Type</label>
            <select class="form-control" name="course_duration_type" id="course_duration_type">
                <option value="">Select Type</option>
                <option value="full_time">Full Time</option>
            </select>
        </div>
    </div>

    <div class="col-sm-6">
        <div class="form-group">
            <label class="control-label">Status</label>
            <select class="form-control" name="course_status">
                <option value="1" <?php echo (isset($course_data) && $course_data->course_status==1)?'selected':'' ;?>>Active</option>
                <option value="2" <?php echo (isset($course_data) && $course_data->course_status==2)?'selected':'' ;?>>Deactive</option>
            </select>
        </div>
    </div>
    </div>

<div class="row">
    
    <div class="col-md-12" id="course_colleges">
        <?php if (!empty($colleges)) { ?>
            <table class="table table-condensed">
                <thead>
                    <tr>
                        <th>#</th>
                        <th style="float:left !important;">College Name</th>
                    </tr>
                </thead>
            </table>
            <!-- Scrollable container for the table -->
            <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;"> <!-- Adjust max-height as needed -->
                <table class="table table-condensed">
                    <tbody>
                        <?php foreach ($colleges as $key => $value) { ?>
                            <tr>
                                <td><?php echo ($key+1); ?></td>
                                <td><?php echo $value->college_name; ?></td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        <?php } else { ?>
            <div class="alert alert-info">No college has been tagged</div>
        <?php } ?>
    </div>
</div>