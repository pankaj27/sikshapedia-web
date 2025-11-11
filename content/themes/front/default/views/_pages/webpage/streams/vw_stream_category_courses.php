<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<section class="bradcumSec bg-white py-2">
    <div class="wrapper">
         <div class="row">
             <div class="col-md-8 mb-2 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">
                 <h1 class="m-0 text-center text-md-left text-uppercase"><?php echo $page_heading;?></h1>
             </div>
             <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-end">
                 <nav aria-label="breadcrumb">
                     <ol class="breadcrumb bg-white m-0 breadcrumb-stream-category-course">
                      <?php
                      foreach ($bread_crumb as $key => $value) {
                        ?>
                        <li class="breadcrumb-item <?php echo (empty($value))?'active':'';?>">
                          <?php
                          if(!empty($value)){
                            ?>
                            <a href="<?php echo $value;?>"><?php echo $key;?></a>
                            <?php
                          }else{
                            echo $key;
                          }
                          ?>

                          

                        </li>
                        <?php
                      }
                      ?>
                     </ol>
                 </nav>
             </div>
         </div>

         <div class="row">
             <div class="col-lg-12 align-items-center justify-content-center justify-content-md-start">
                 <p><?php echo $slug_url_data->url_page_sub_heading;?></p>
             </div>
         </div>
         <?php
         

         if(!empty($slug_url_data)){
            echo $slug_url_data->url_page_description;
         }
         ?>
     </div>
</section>

<section class="bg-white border-top">
    <div class="wrapper">
        <div class="row align-items-center">
            <div class="col-12">
            <div class="isa-tab-filter">
                <ul class="text-left nav nav-tabs">
                    <li class="placeholder"> <a href="javscript:void(0);">Sort By</a></li>
                    <?php
                    $i=0;
                    foreach ($categories as $key => $value) {

                    	if($value['tab_active']=='1'){
							?>
	                    	<li ><a class="nav-item nav-link <?php echo ($i==0)?'selected':'';?>" id="nav-<?php echo $value['category_name'];?>-tab" data-toggle="tab" href="#nav-<?php echo $value['category_name'];?>" role="tab" aria-controls="nav-<?php echo $value['category_name'];?>" aria-selected="true" data-type="<?php echo $value['category_name'];?>"><?php echo $value['category_name'];?></a></li>
	                    	<?php
                    	}else{
                    		if($i=='0'){
                    			?>
		                    	<li ><a class="nav-item nav-link <?php echo ($i==0)?'selected':'';?>" id="nav-<?php echo $value['category_name'];?>-tab" data-toggle="tab" href="#nav-<?php echo $value['category_name'];?>" role="tab" aria-controls="nav-<?php echo $value['category_name'];?>" aria-selected="true" data-type="<?php echo $value['category_name'];?>"><?php echo $value['category_name'];?></a></li>
		                    	<?php
                    		}else{
                    			?>
		                    	<li ><a class="nav-item nav-link"><?php echo $value['category_name'];?></a></li>
		                    	<?php	
                    		}
	                    		
                    	}
                    	
                    	$i++;
                    }
                    ?>
                    
                </ul>
                <!-- <nav>
                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link filter active" id="nav-basic_details-tab" data-toggle="tab" href="#nav-basic_details" role="tab" aria-controls="nav-basic_details" aria-selected="true">Basic Details</a>
                        <a class="nav-item nav-link filter" id="nav-high_school-tab" data-toggle="tab" href="#nav-high_school" role="tab" aria-controls="nav-high_school" aria-selected="false">High School</a>
                        <a class="nav-item nav-link filter" id="nav-higher_education-tab" data-toggle="tab" href="#nav-higher_education" role="tab" aria-controls="nav-higher_education" aria-selected="false">Higher Education</a>
                        <a class="nav-item nav-link filter" id="nav-prof_exp-tab" data-toggle="tab" href="#nav-prof_exp" role="tab" aria-controls="nav-prof_exp" aria-selected="false">Professional Experience</a>
                    </div>
                </nav> -->
            </div>
            </div>
            <!-- <div class="col-3">
            	<div class="m-0 text-right isa-tab-filter">
            		<ul class="text-left">
	                    <li class="placeholder"> <a href="javscript:void(0);">Sort By</a></li> 
	                    <li class="filter"><small> Course type</small> <br> <span class="color1"> Full time</span></li>
	                    <li class="filter"><small> Course type</small> <br> <span class="color1"> Part time</span></li>
	                </ul>
            	</div>
            	<div class="isa-tab-filter">
	                <ul class="text-right">
	                    <li class="placeholder"> <a href="javscript:void(0);">Sort By Course type</a></li> 
	                    <li class="filter"><small> Course type</small> <a class="filter_course selected" href="javscript:void(0);" data-type="all">Full Time</a></li>
	                    <li class="filter"><a class="filter_course" href="javscript:void(0);" data-type="diploma">Part Time</a></li>
	                </ul>
	            </div>
            </div> -->
       </div>
    </div>
</section>

<section class="pageDetailsSec py-4">
  <div class="wrapper">
    <div class="row">
      <div class="col-lg-9 mb-4 mb-lg-0">

        <?php $this->widget->run('front_stream_category_courses',TRUE);?>
        <?php $this->widget->run('front_college_comment_section',TRUE);?>

       
        
      </div>
      <div class="col-lg-3 mb-4 mb-lg-0">
        <?php $this->widget->run('front_stream_colleges_top_section',TRUE,$stream_id);?>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 mb-4 mb-lg-0">
        <?php $this->widget->run('front_stream_colleges_section',TRUE);?>
        
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 mb-4 mb-lg-0">
        
        <?php $this->widget->run('front_stream_colleges_section',TRUE,$stream_id);?>
      </div>
    </div>
  </div>
</section>


<?php $this->widget->run('front_subscription_section',TRUE);?>
<script type="text/javascript">var wbpage='stream_course';var page='stream_course';var _vtype='';</script>

<style type="text/css">
  .isa-tab-filter{
    display: none;
  }
  .project-tab {
    padding: 0%;
    margin-top: 1%;
}
.project-tab #tabs{
    background: #007b5e;
    color: #eee;
}
.project-tab #tabs h6.section-title{
    color: #eee;
}
.project-tab #tabs .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    color: #0062cc;
    background-color: transparent;
    border-color: transparent transparent #f3f3f3;
    border-bottom: 3px solid !important;
    font-size: 16px;
    font-weight: bold;
}
.project-tab .nav-link {
    border: 1px solid transparent;
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
    color: #0062cc;
    font-size: 16px;
    font-weight: 600;
}
.project-tab .nav-link:hover {
    border: none;
}
.project-tab thead{
    background: #f3f3f3;
    color: #333;
}
.project-tab a{
    text-decoration: none;
    color: #333;
    font-weight: 600;
}
</style>