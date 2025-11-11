<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Banner's List</li>
		</ol>
	</nav>


	<div class="row">
        <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Banners <button type="button" class="btn btn-xs btn-primary" data-toggle="modal" data-target="#bannerUploadModal">Add</a></h6>
                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table id="banner_list_table" class="table">
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Banner</th>
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


<div class="modal fade bd-example-modal-xl" id="bannerUploadModal" tabindex="-1" role="dialog" aria-labelledby="bannerUploadModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="bannerUploadModalTitle">Add Banner</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_banner_upload">
                <div class="modal-body">                    
                    <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
                    <input type="hidden" name="_banner" id="_banner" value="">

                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Banner Link Type</label>
                                <select class="form-control" name="banner_link_type" id="banner_link_type">
                                    <option value="1">Internal</option>
                                    <option value="2">External</option>
                                </select>
                            </div>
                        </div>
                    
                        <div class="col-md-9" id="banner_link_college_div" style="display:block;">
                            <div class="form-group">
                                <label>Colleges</label>
                                <select class="form-control js-example-basic-single" name="banner_link_college" id="banner_link_college">
                                   <?php
                                   foreach ($colleges as $key => $value) {
                                       ?>
                                       <option value="<?php echo $value->college_user_id;?>"><?php echo $value->college_name;?></option>
                                       <?php
                                   }

                                   ?>
                                </select>
                            </div>
                        </div>
                    </div>
                            
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>Banner Title</label>
                                <input type="text" class="form-control" placeholder="Banner Title" name="banner_title" id="banner_title">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>Banner Sub Title</label>
                                <input type="text" class="form-control" placeholder="Enter Banner Sub Title" name="banner_sub_title" id="banner_sub_title">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Banner Custom Link</label>
                                <input type="text" class="form-control" placeholder="Enter link" name="banner_link" id="banner_link">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Banner Visibility Order</label>
                                <input type="number" min="0" class="form-control" placeholder="Banner Visibility Order" name="banner_serial" id="banner_serial">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Status</label>
                                <select class="form-control" name="banner_status" id="banner_status">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Banner Image</label>
                                <input type="file" name="banner_image" class="file-upload-default">
                                <div class="input-group col-xs-12">
                                    <input type="text" class="form-control file-upload-info" disabled="" placeholder="Banner Image" value="">
                                    <span class="input-group-append">
                                        <button class="file-upload-browse btn btn-primary" type="button">Banner Image</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="col-xs-12">
                                <img class="img-fluid img-thumbnail" id="banner_img" src="">
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="modal-footer">                  
                    <button type="submit" class="btn btn-primary" id="btn_update_banner">Save</button>
                </div>
            </form>
        </div>
    </div>
</div>


<style type="text/css">
.select2-container {
    width: 100% !important;
}
</style>

<script type="text/javascript">var p_row='';</script>