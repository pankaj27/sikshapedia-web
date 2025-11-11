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
					<h6 class="card-title">Stream Categories Pages</h6>
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
		                    <?php
		                    if(!empty($stream_categories)){
		                    	$i=1;
		                    	foreach ($stream_categories as $key => $value) {
		                    		?>
		                    		<tr>
		                    			<td><?php echo $i;?></td>
		                    			<td><a href="<?php echo $value['category_url'];?>" target="_blank"><?php echo $value['category_display_name'];?></a></td>
		                    			<td><a href="<?php echo $value['category_edit_url'];?>" class="btn btn-xs btn-dark btn_edit_stream_category_page_meta">Edit Meta</a></td>
		                    		</tr>
		                    		<?php

		                    		$i++;
		                    	}
		                    }
		                    ?>                    	
		                    </tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>