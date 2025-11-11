<?php defined('BASEPATH') or exit('No direct script access allowed'); ?>


<?php
if (!empty($page_data)) {
?>
<div class="card infoCard mb-4 res-flexi-width" style="margin-top:0px;">
    <div class="card-body readall card-body-readall-top-college">
        <?php
      foreach ($page_data as $key => $value) {
        if ($value->page_data_type == 'image') {

      ?>
        <div class="row">
            <div class="col-lg-12 text-center">
                <img src="<?php echo $value->page_data_value; ?>" alt="ads" style="height:auto;width:50%;">
            </div>
        </div>
        <?php

        } else if ($value->page_data_type != 'faqs') {
          echo $value->page_data_value;
        }
      }

      if (!empty($page_faq_data)) {
        ?>
        <div id="accordionExample1" class="accordion">
            <?php
          $i = 0;
          foreach ($page_faq_data as $key => $value) {
          ?>
            <div class="card br-0">
                <a href="#" data-toggle="collapse" data-target="#collapse<?php echo $i; ?>" aria-expanded="true"
                    aria-controls="collapse<?php echo $i; ?>"
                    class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong></strong><?php echo $value->page_data_heading; ?></a>
                <div id="collapse<?php echo $i; ?>" data-parent="#accordionExample1"
                    class="collapse <?php echo ($i == 0) ? 'show' : ''; ?>">
                    <div class="card-body">
                        <p class="font-weight-light m-0"><strong></strong><?php echo $value->page_data_value; ?></p>
                    </div>
                </div>
            </div>
            <?php
            $i++;
          }

          ?>
        </div>
        <?php
      }
      ?>
    </div>
</div>
<?php
}
?>