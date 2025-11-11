<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($faculties_data)){
	?>
	<div class="card infoCard mb-4">
      <div class="card-header bg-white">
        <h5 class="m-0 color2">FACULTY DETAILS</h5>
      </div>
      <div class="card-body">
        <div class="row">
      		<?php
      		foreach ($faculties_data as $key => $value){
                ?>
                <div class="col-lg-4">
                <?php
          		 if($value['faculty_designation']=='PRINCIPAL'){
                  ?>
                    <div class="card p-3 mb-3" style="min-height: 150px;">
                      <h5 class="text-capitalize color2"><?php echo $value['faculty_name'];?></h5>
                      <p class="text-muted color1"><?php echo $value['faculty_designation'];?></p>
                    </div>  
                    <!-- <h6 class="text-uppercase mb-4">Other faculty details </h6>  -->
             
                            
                    <?php
                     }else{
                    ?>
                    
                      <div class="card p-3 mb-3" style="min-height: 150px;">
                        <h5 class="text-capitalize color1"> <?php echo $value['faculty_name'];?> </h5>
                        <?php
                        if(!empty($value['faculty_designation_departments'])){
                            ?>
                            <p class="m-0 text-muted f12 color2"><?php echo $value['faculty_designation_departments'];?></p>
                            <?php
                        }
                        ?>
                        
                        <?php
                        if(!empty($value['faculty_qualifications'])){
                            ?>
                            <p class="m-0 text-muted"><b>Qualification - </b> <?php echo $value['faculty_qualifications'];?></p>
                            <?php
                        }
                        ?>
                        
                        <?php
                        if($value['faculty_experience']!=null){
                            ?>
                            <p class="m-0 text-muted"><b>Academic Experience - </b> <?php echo $value['faculty_experience'];?> </p>
                            <?php
                        }
                        ?>
                        
                      </div>
                   
                  <?php
                }
                ?>
                </div>
                <?php
      		}

      		?>
        </div>
      </div>
    </div>
	<?php
}

?>
<!-- 
<style type="text/css">
  .faculty.jsx-277079723 .name.jsx-277079723, .faculty.jsx-277079723 .total.jsx-277079723, .faculty.jsx-277079723 .ratio.jsx-277079723 {
    font-size: 20px;
}
.text-primary {
    color: #ff7900;
}

.p-4 {
    padding: 1rem;
}

.font-weight-bold, h1.font-weight-bold, h2.font-weight-bold, h3.font-weight-bold, h4.font-weight-bold, h5.font-weight-bold, h6.font-weight-bold, .h1.font-weight-bold, .h2.font-weight-bold, .h3.font-weight-bold, .h4.font-weight-bold, .h5.font-weight-bold, .h6.font-weight-bold {
    font-weight: 700;
}
.text-md {
    font-size: .75rem;
}

.mb-1, .my-1 {
    margin-bottom: .25rem;
}
.d-block {
    display: block;
}
.text-lg {
    font-size: 1rem;
}
</style> -->