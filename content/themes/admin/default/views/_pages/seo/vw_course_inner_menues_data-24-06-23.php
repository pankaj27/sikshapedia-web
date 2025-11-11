<div class="col-lg-2">
  <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
    <?php
    if(!empty($course_menu_data)){
      $i=0;
      foreach ($course_menu_data as $key => $value) {
        ?>
        <a class="nav-link <?php echo ($i==0)?'active':'';?>" id="v-pills-<?php echo $value['menu_slug'];?><?php echo $value['menu_id'];?>-tab" data-toggle="pill" href="#v-pills-<?php echo $value['menu_slug'];?><?php echo $value['menu_id'];?>" role="tab" aria-controls="v-pills-<?php echo $value['menu_slug'];?><?php echo $value['menu_id'];?>" aria-selected="true"><?php echo $value['menu_name'];?></a>
        <?php
        $i++;
      }
    }

    ?>
  </div>
</div>

<div class="col-lg-10">
  <div class="tab-content" id="v-pills-tabContent">
    <?php
    $z=0;
    foreach ($course_menu_data as $key => $value){
      ?>
      <div class="tab-pane fade <?php echo ($z==0)?'show active':'';?>" id="v-pills-<?php echo $value['menu_slug'];?><?php echo $value['menu_id'];?>" role="tabpanel" aria-labelledby="v-pills-<?php echo $value['menu_slug'];?><?php echo $value['menu_id'];?>-tab">
        <div class="panel-heading" style="border-bottom: 1px solid #000;margin-bottom: 20px;">
          <h3><?php echo $value['menu_name'];?> <button type="button" class="btn btn-xs btn-primary btn_course_menu_structure_data" style="float:right;" data-course_id="<?php echo $value['menu_course_id'];?>" data-course_menu_id="<?php echo $value['menu_id'];?>">Structured Data</button></h3>
        </div>
        <div class="panel-body mt-30">
          <form id="form_course_meta_data_<?php echo str_replace('-','_',$value['menu_slug']);?>">
            <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            
            <div class="row mt-10">
              <div class="col-md-6">
                <div class="form-group">
                  <label>
                    <strong>Page Heading</strong>
                  </label>
                  <input type="text" class="form-control valid" placeholder="Enter meta heading" name="page_heading" id="page_heading" aria-invalid="false" value="<?php echo (!empty($value['menu_meta_data']))?$value['menu_meta_data']->url_page_heading:'';?>">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>
                    <strong>Page Meta Title</strong>
                  </label>
                  <input type="text" class="form-control" placeholder="Enter meta title" name="page_meta_title" id="page_meta_title" value="<?php echo (!empty($value['menu_meta_data']))?$value['menu_meta_data']->url_meta_title:'';?>">
                </div>
              </div>
            </div>
            <div class="row mt-10">
              <div class="col-md-6">
                <div class="form-group">
                  <label>
                    <strong>Page Meta Keywords</strong>
                  </label>
                  <input type="text" class="form-control page_keywords" placeholder="Enter meta keys" name="page_meta_keywords" id="page_meta_keywords" value="<?php echo (!empty($value['menu_meta_data']))?$value['menu_meta_data']->url_meta_key_words:'';?>">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>
                    <strong>Page Meta Desc</strong>
                  </label>
                  <textarea class="form-control" placeholder="Enter meta desc" name="page_meta_desc" id="page_meta_desc" rows="10"><?php echo (!empty($value['menu_meta_data']))?$value['menu_meta_data']->url_meta_desc:'';?></textarea>
                </div>
              </div>
            </div>
            <div class="row mt-10">
              <div class="col-md-6">
                <div class="form-group">
                  <label>
                    <strong>Page OG Title</strong>
                  </label>
                  <input type="text" class="form-control" placeholder="Enter og title" name="page_og_title" id="page_og_title" value="<?php echo (!empty($value['menu_meta_data']))?$value['menu_meta_data']->url_og_title:'';?>">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>
                    <strong>Page OG Desc</strong>
                  </label>
                  <textarea class="form-control" placeholder="Enter og description" name="page_og_desc" id="page_og_desc" rows="10"><?php echo (!empty($value['menu_meta_data']))?$value['menu_meta_data']->url_og_desc:'';?></textarea>
                </div>
              </div>
            </div>

            <div class="row mt-10">
              <div class="col-md-12">
                <div class="form-group">
                  <button class="btn btn-primary" type="submit" id="btn_<?php echo str_replace('-','_',$value['menu_slug']);?>">Save <?php echo $value['menu_name'];?> Meta</button>
                </div>
              </div>
            </div>

          </form>
            
        </div>
      </div>
      <?php
      $z++;
    }
    ?>
  </div>
</div>


<script type="text/javascript">
  $(document).ready(function(){

   

    <?php

    foreach ($course_menu_data as $key => $value){
      ?>
          $('#form_course_meta_data_<?php echo str_replace('-','_',$value['menu_slug']);?>').validate({
            rules:{

            },
            messages:{

            },
            submitHandler:function(){
              Swal.fire({   
              title: "Are you sure?",   
              text: "You will be able to edit <?php echo $value['menu_name'];?> data later",   
              icon: 'warning',  
              showCancelButton: true,   
              confirmButtonColor: '#3085d6', 
              cancelButtonColor: '#d33', 
              confirmButtonText: "Yes, Update",   
              cancelButtonText: "No, cancel",
              allowOutsideClick: false
          }).then((isConfirm)=>{

            //console.log(isConfirm);

            if (isConfirm){

              var formData=new FormData($('#form_course_meta_data_<?php echo str_replace('-','_',$value['menu_slug']);?>')[0]);

              formData.append('course_id','<?php echo $value['menu_course_id'];?>');
              formData.append('menu_id','<?php echo $value['menu_id'];?>');
              formData.append('menu_url','<?php echo $value['menu_url'];?>');



              $.ajax({
                type:'POST',
                url:base_url+'/seo/courses/add_meta',
                data:formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000000,
                beforeSend:function(){
                  $('#<?php echo str_replace('-','_',$value['menu_slug']);?>').html('<span class="fa fa-circle-o-notch fa-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
                },
                success:function(d){
                  if(d.success){
                    Swal.fire({
                      icon: 'success',
                      title: d.success,
                      timer: 2000,
                      showConfirmButton: false,
                      allowOutsideClick: false,
                    });


                  }else if(d.error){
                    Swal.fire({
                      icon: 'error',
                      title: d.error,
                      timer: 2000,
                      showConfirmButton: false,
                      allowOutsideClick: false,
                    });
                  }
                },
                complete:function(status,xhr){
                }
              });

            }


          });
        }
      });
      <?php
    }

    ?>
  });
</script>