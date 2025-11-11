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

					<?php 
					if(!empty($course_inner_menues)){
						?>
						<h6 class="card-title">Course</h6>
						<?php
					}else{
						?>
						<div class="row">
							<span class="text-center"><button class="btn btn-primary" data-target="#createMenuModal" data-toggle="modal" type="button">Crteate Inner Menues</button></span>
						</div>
						<?php
					}
					?>
				</div>
			</div>
		</div>
	</div>
</div>


<div class="modal fade bd-example-modal-xl" id="createMenuModal" tabindex="-1" role="dialog" aria-labelledby="createMenuModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCourseMetaModalTitle">Edit Course Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            
            <div class="modal-body">
	            <form id="form_course_menue">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<input type="hidden" name="_course" id="_course" value="<?php echo ;?>course_id">
            		<input type="hidden" name="_menu" id="_menu" value="">
					<div class="row">
						<div class="col-md-12">
		            		<div class="form-group">
								<label>Course Menu Name</label>
								<input type="text" class="form-control" placeholder="Enter Menu Name" id="course_menu_name">
							</div>
						</div>
						<div class="col-md-12">
							<div class="form-group">            	
				                <button type="submit" class="btn btn-primary" id="btn_add_course_menue">Add</button>
				            </div>
			            </div>
					</div>
					
	            </form>
            </div>
            <div class="modal-footer">
            	<div class="row">
	            	<div class="col-md-12 table-responsive">
	            		<table class="table">
	            			<tr>
	            				<td>Menu</td>
	            				<td>Link</td>
	            				<td></td>
	            			</tr>
	            		</table>
	            	</div>
	            </div>
            </div>	            
        </div>
    </div>
</div>