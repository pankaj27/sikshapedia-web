<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php $this->widget->run('front_university_page_header_section',TRUE);?>





  <section class="pageDetailsSec py-4">
      <div class="wrapper">
        <div class="row">
          
          <div class="col-lg-9 mb-4 mb-lg-0">
            <?php $this->widget->run('front_university_basic_settings_edit_section',TRUE);?>
          </div>
          <div class="col-lg-3 mb-3 mb-lg-0">
            <?php $this->widget->run('front_college_settings_edit_section',$show_college_settings_edit_widget);?>
          </div>
        </div>
    </div> 
  </section>

   <?php $this->widget->run('front_subscription_section',true);?>


   <script type="text/javascript">var wbpage='';</script>