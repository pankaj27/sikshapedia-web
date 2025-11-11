<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($system_folders)){
	?>
	<ul class="list-unstyled chat-list px-1">
		<?php
		foreach ($system_folders as $key => $value) {
			?>
			<li class="chat-item pr-1 li_folder">
			    <a href="javascript:;" class="d-flex align-items-center">
			      <figure class="mb-0 mr-2">
	                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
	              </figure>
			      <div class="d-flex justify-content-between flex-grow border-bottom folder_ellipsed_name" data-fname="<?php echo $value['media_org_name'];?>" data-pfoldder="<?php echo $value['storage_parent_id'];?>" data-pfoldder_disk_name="<?php echo $value['parent_folder_disk_name'];?>" data-spfoldder_disk_name="<?php echo $value['super_parent_folder_disk_name'];?>" data-folder="<?php echo $value['storage_id'];?>" data-disk_name="<?php echo $value['media_disk_name'];?>" data-cdate="Created date:<?php echo $value['created_date'];?>">
			        <div>
			          <p class="text-body font-weight-bold folder_ellipsed_name" data-fname="<?php echo $value['media_org_name'];?>" data-pfoldder="<?php echo $value['storage_parent_id'];?>" data-pfoldder_disk_name="<?php echo $value['parent_folder_disk_name'];?>"  data-spfoldder_disk_name="<?php echo $value['super_parent_folder_disk_name'];?>" data-disk_name="<?php echo $value['media_disk_name'];?>" data-folder="<?php echo $value['storage_id'];?>" data-cdate="Created date:<?php echo $value['created_date'];?>"><?php echo $value['media_org_name'];?></p>
			          <p class="text-muted tx-13">Created date:<?php echo $value['created_date'];?></p>
			        </div>
			        <div class="d-flex flex-column align-items-end">
			          <p class="text-muted tx-13 mb-1">
			          	<svg data-folder="<?php echo $value['media_disk_name'];?>" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 del_folder"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
			          </p>
			        </div>
			      </div>
			    </a>
			</li>
			<?php
		}
		?>
	</ul>
	<?php	
}else{
	?>
	
	<?php
}
?>