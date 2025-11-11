<div class="modal fade bd-example-modal-xl" id="coursemenuWidgetAddModal" tabindex="-1" role="dialog" aria-labelledby="coursemenuWidgetAddModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="coursemenuWidgetAddModalTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            
            <div class="modal-body">
            	
        		<div class="row">
        			<div class="col-md-10">
        				<div class="form-group">
        					<label>Menu Widgets</label>
        					<select class="form-control" id="menu_widget">
                            	<option value="0">Select Widget</option>
                            	<option value="front_exam_practice_papers_section#Exam Practice Papers">Exam Practice Papers</option>
                            </select>
        				</div>
        			</div>
        			<div class="col-md-2">
        				<div class="form-group">
        					<label>Visible</label>
        					<select class="form-control" id="menu_widget_visible" name="menu_widget_visible">
                            	<option value="TRUE">Yes</option>
                            	<option value="FALSE">No</option>
                            </select>
        				</div>
        			</div>
                </div>
            </div>
            <div class="modal-footer">
            	<?php $widget_row=0;?>
                <div class="table-responsive" style="width:100%;">
                	<form id="form_update_menu_widget" enctype="multipart/form-data">
                		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<input type="hidden" name="widget_menu_id" id="widget_menu_id" value="">
						<table id="menu_widgets_table" class="table" style="width: 100%;">
							<thead>
		                      <tr>
		                        <th>Widget</th>
		                        <th>Visible</th>
		                        <th>Action</th>
		                      </tr>
		                    </thead>
		                    <tbody>
		                    	<tr><td colspan="3" style="text-align:center;">No Widgets Found</td></tr>                  	
		                    </tbody>
						</table>
						<tfoot style="text-align:rifght;">							
							<button type="submit" class="btn btn-primary" id="update_menu_widget">Update</button>
						</tfoot>
						<script type="text/javascript">var widget_row=<?php echo $widget_row;?>;</script>
					</form>
				</div>
            </div>
            
        </div>
    </div>
</div>


<script type="text/javascript">
	$(document).ready(function(){

		$('body').on('click','.del_menu_widget_row',function(){
			var wdid=$(this).data('rowid');
			$.ajax({
	  			type:'POST',
	  			url:base_url+'/delete_menu_widget',
	  			data:{[csrf_name]:csrf_hash,widget_menu_id:wdid},
	  			success:function(d){
	  				if(d.success){

				  		$('#trMenuWidget'+wdid).remove();

				  		var rowCount = $("#menu_widgets_table tbody tr").length;

				  		if(rowCount===0){
				  			$('#update_menu_widget').css('display','none');
				  		}else if(rowCount>0){
				  			$('#update_menu_widget').css('display','block');
				  		}
	  				}
	  			}
	  		});
	  	});

		$('body').on('change','#menu_widget',function(){

			var html='';

			var selected_val=$('#menu_widget :selected').val();

			var visible=$('#menu_widget_visible :selected').val();

			var vx='';

			if(visible==='TRUE'){
				vx='<button class="btn btn-sm btn-success">Yes</span>';
			}else if(visible==='FALSE'){
				vx='<button class="btn btn-sm btn-danger">No</span>';
			}

			if(selected_val!='0'){
				var vs=selected_val.split('#');
				var widget_id=vs[0];

				var widget_name=vs[1];

				html+='<tr class="sortable-item" data-id="'+widget_row+'" id="trMenuWidget'+widget_row+'">';
					html+='<td>Exam Practice Papers<input type="hidden" name="widget_name[]" value="'+widget_id+'"></td>';
					html+='<td>'+vx+'</td>';
					html+='<td><button type="button" class="btn btn-sm btn-danger del_menu_widget_row" data-rowid="'+widget_row+'">Delete</td>';
				html+='</tr>';

				$('#menu_widgets_table tbody').append(html);
				$('#update_menu_widget').css('display','block');
			}

		});


		$('#form_update_menu_widget').validate({
			submitHandler:function(){
				$.ajax({
	              type:'POST',
	              url:base_url+'/update_menu_widget',
	              data:$('#form_update_menu_widget').serialize(),
	              success:function(f){
	                if(f.success){
	                    Swal.fire({
	                    icon: 'success',
	                    title: f.success,
	                    confirmButtonText:'Close',
	                    confirmButtonColor:'#69da68',
	                    allowOutsideClick: false,
	                  });
	                }else if(f.error){
	                    Swal.fire({
	                    icon: 'error',
	                    title: f.error,
	                    confirmButtonText:'Close',
	                    confirmButtonColor:'#69da68',
	                    allowOutsideClick: false,
	                  });
	                }else if(f.redirect){
	                  window.location.href=f.redirect;
	                }
	              }
	            });
			}
		});

	  	$('#menu_widgets_table tbody').sortable({
	      opacity: 0.6, 
	      cursor: 'move', 
	      tolerance: 'pointer', 
	      revert: true,
	      items : "[data-id]",
	      placeholder: 'state', 
	      forcePlaceholderSize: true,
	      handle: 'td',
	      animation:150,
	      ghosting:true,
	      start: function( event, ui ) {
	        console.log('start: ' + ui.item.index())
	      },
	      stop: function( event, ui ) {
	      },
	      update: function( event, ui ) {
	        // var postData = $(this).sortable('serialize', {
	        //         attribute: 'data-id',
	        //         key: 'order',
	        //         expression: /(.+)/
	                
	        //     });
	            //alert(postData);
	            var postData2 = $(this).sortable('toArray', {
	                attribute: 'data-id'
	            });

	            // $.ajax({
	            //   type:'POST',
	            //   url:base_url+'/update_menu_serial',
	            //   data:{[csrf_name]:csrf_hash,menu_type:'12',menu_data_type:'exam',menu_data_type_id:exam_id,menu_serialize_ids:postData2},
	            //   success:function(f){
	            //     if(f.success){
	            //         Swal.fire({
	            //         icon: 'success',
	            //         title: f.success,
	            //         confirmButtonText:'Close',
	            //         confirmButtonColor:'#69da68',
	            //         allowOutsideClick: false,
	            //       });
	            //       window.location.reload();
	            //     }else if(f.error){
	            //         Swal.fire({
	            //         icon: 'error',
	            //         title: f.error,
	            //         confirmButtonText:'Close',
	            //         confirmButtonColor:'#69da68',
	            //         allowOutsideClick: false,
	            //       });
	            //     }else if(f.redirect){
	            //       window.location.href=f.redirect;
	            //     }
	            //   }
	            // });


	      }
	  	});


	   	$('#menuWidgetAddModal').on('hidden.bs.modal', function () {
	    	$('#menu_widgets_table tbody').html('');
	    	$('#update_menu_widget').css('display','none');
	  	});

	  	$('#menuWidgetAddModal').on('shown.bs.modal', function (e) {
	  		load_widgets_data();
	  	});


	  	$('body').on('click','.btn_change_widget_visiblity',function(){
	  		var wdid=$(this).data('data_id');
	  		var wdfield=$(this).data('data_field');
	  		var wdstatus=$(this).data('data_status');

	  		$.ajax({
	  			type:'POST',
	  			url:base_url+'/update_menu_widget_specific_data',
	  			data:{[csrf_name]:csrf_hash,widget_menu_id:wdid,wdfield:wdfield,wdstatus:wdstatus},
	  			success:function(){
	  				load_widgets_data();
	  			}
	  		});

	  	});

	  	function load_widgets_data(){
	  		var whtml='';
	  		var vx2='';
	  		$.ajax({
	          type:'POST',
	          url:base_url+'/load_menu_widget',
	          data:{[csrf_name]:csrf_hash,widget_menu_id:$('#menuWidgetAddModal').find('#widget_menu_id').val()},
	          success:function(d){
	            if(d.widget_data!=''){

	            	$.each(d.widget_data,function(i,v){
	            		if(v.widget_show==='TRUE'){
							vx2='<button class="btn btn-sm btn-success btn_change_widget_visiblity" data-data_field="widget_show" data-data_status="FALSE" data-data_id="'+v.menu_widgets_id+'">Yes</span>';
						}else if(v.widget_show==='FALSE'){
							vx2='<button class="btn btn-sm btn-danger btn_change_widget_visiblity" data-data_field="widget_show" data-data_status="TRUE" data-data_id="">No</span>';
						}
						whtml+='<tr class="sortable-item" data-id="'+v.widget_serial+'" id="trMenuWidget'+v.menu_widgets_id+'">';
						whtml+='<td>Exam Practice Papers<input type="hidden" name="widget_name[]" value="'+v.widget_name+'"></td>';
						whtml+='<td>'+vx2+'</td>';
						whtml+='<td><button type="button" class="btn btn-sm btn-danger del_menu_widget_row" data-rowid="'+v.menu_widgets_id+'">Delete</td>';
						whtml+='</tr>';
	            	});
	            	$('#update_menu_widget').css('display','block');	
	            }else{
	            	whtml+='<tr><td colspan="3" style="text-align:center;">No Widgets Found</td></tr>';
	            	$('#update_menu_widget').css('display','none');
	            }

	            $('#menu_widgets_table tbody').html(whtml);
	          }
	        });
	  	}


	});
</script>