<?php defined('BASEPATH') OR exit('No direct script access allowed');?>


<?php
if(is_controller('Accounts') && is_method('index')){
	
}else{
	echo @$partial_superadmin_sidebar;
    echo @$partial_header;
    echo @$partial_change_pass_modal;
    echo @$partial_tiny_file_browser;
    echo @$partial_tiny_file_browser_1;
    echo @$partial_tiny_file_browser_2;
    echo @$partial_tiny_file_browser_3;
    echo @$partial_ads_modal;
    echo @$partial_file_upload_modal;
    echo @$partial_menu_widgets_modal;
    echo @$partial_cmenu_widgets_modal;
    echo @$partial_file_upload_big_modal;
    echo @$partial_college_inner_menues_modal;
    echo @$partial_college_inner_menues_edit_modal;
    echo @$partial_stream_inner_menues_edit_modal;
    echo @$partial_college_exams_modal;
    echo @$partial_college_course_page_meta_modal;
}
?>

<div class="<?php echo Events::trigger('body_class', '', 'string'); ?>">
	<?php echo @$content;?>
</div>

<div class="modal fade" id="editorVersionModal" tabindex="-1" role="dialog" aria-labelledby="editorVersionModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editorVersionModalTitle">Change Editor Version</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_update_data">
	            <div class="modal-body">		            		
            		<div class="row">
		            	<div class="col-md-6">
		            		<div class="form-group">
								<select class="form-control" name="editor_version" id="editor_version">
									<option value="0">Select Version</option>
                                    <?php
                                    if(!empty($tinymce_keys)){
                                        foreach($tinymce_keys as $k=>$v){
                                            ?>
                                            <option value="<?php echo $v['key'];?>" <?php echo $v['selected'];?>><?php echo $v['v'];?></option>
                                            <?php
                                        }
                                    }
                                    ?>
								</select>
							</div>
						</div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <button type="button" class="btn btn-success" id="btn_update_editor_version">Update Version</button>
                            </div>
                        </div>
					</div>
					            	
	            </div>
            </form>
        </div>
    </div>
</div>


