<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<section class="commonSec ">
  <div class="wrapper">
    <div class="section-title">
      <h3>Write your review for <?php echo $inst_data['inst_name'];?> </h3>
    </div>
    <div class="row">
      <div class="col-lg-12" id="inst_courses">
        
      </div>
    </div>
  </div>
</section>

<?php $this->widget->run('front_subscription_section',TRUE);?>

<script type="text/javascript">let review_course_populate=true;let review_inst='<?php echo $inst_data['inst_id'];?>';let review_inst_type='<?php echo $inst_data['inst_type'];?>';let page='review_course_list';let _vtype='';</script>