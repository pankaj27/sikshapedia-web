<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Colleges List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Colleges</h6>
					<div class="table-responsive">
						<table id="collegedata_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>College</th>
		                        <th>Status</th>
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


<script type="text/javascript">
	$(document).ready(function(){

		$('#collegedata_list_table').DataTable({ 
	        'bJQueryUI': false,
	        'stateSave': true,
	        'iDisplayLength':50,
	        'responsive': true,
	        "pagingType": "full_numbers",
	        'language': {
	          'paginate': {
	            'first': "<<", // This is the link to the first page
	            'previous': "<", // This is the link to the previous page
	            'next': ">", // This is the link to the next page
	            'last': ">>" // This is the link to the last page
	          }
	        },
	        "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
	        "processing": true, //Feature control the processing indicator.
	        "serverSide": true, //Feature control DataTables' server-side processing mode.
	        "order": [], //Initial no order.
	        // Load data for the table's content from an Ajax source
	        "ajax": {
	            "url": base_url+'/institutions/colleges/searchdata',
	            "type": "POST",
	            "data":{csrf_test_name:csrf_hash}
	        },
	        //Set column definition initialisation properties.
	        "columnDefs": [
	        { 
	            "targets": [ 0 ], //first column / numbering column
	            "orderable": false, //set not orderable
	        },
	        ],
	    });


	    $('body').on('click','.del_college',function(){

	    	var college_id=$(this).data('college_id');

	    	$.ajax({
	    		type:'POST',
	    		url:base_url+'/institutions/colleges/delete_college_data',
	    		data:{college_id:college_id,csrf_test_name:csrf_hash,delete_type:'college'},
	    		success:function(){

	    		},
	    		complete:function(xhr,status){
	    			var table=$('#collegedata_list_table').DataTable();
           			table.ajax.reload( null, false );
	    		}
	    	});
	    });


	    $('body').on('click','.del_college_user',function(){

	    	var college_id=$(this).data('college_id');

	    	$.ajax({
	    		type:'POST',
	    		url:base_url+'/institutions/colleges/delete_college_data',
	    		data:{college_id:college_id,csrf_test_name:csrf_hash,delete_type:'college_user'},
	    		success:function(){

	    		},
	    		complete:function(xhr,status){
	    			var table=$('#collegedata_list_table').DataTable();
           			table.ajax.reload( null, false );
	    		}
	    	});
	    });


	    $('body').on('click','.del_college_slug',function(){

	    	var college_id=$(this).data('college_id');

	    	$.ajax({
	    		type:'POST',
	    		url:base_url+'/institutions/colleges/delete_college_data',
	    		data:{college_id:college_id,csrf_test_name:csrf_hash,delete_type:'college_slug'},
	    		success:function(){

	    		},
	    		complete:function(xhr,status){
	    			var table=$('#collegedata_list_table').DataTable();
           			table.ajax.reload( null, false );
	    		}
	    	});
	    });


	});
</script>