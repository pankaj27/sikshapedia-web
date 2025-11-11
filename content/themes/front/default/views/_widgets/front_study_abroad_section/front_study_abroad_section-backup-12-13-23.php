<section class="commonSec studyAbroadSection">
    <div class="wrapper">
      <div class="section-title">
        <h2>STUDY ABROAD</h2>
        <p>Interested in studying abroad? Choose a country:</p>
      </div>

      <div class="row">
        <?php
        foreach ($top_countries as $key => $value) {
          ?>
          <div class="col-md-3 col-sm-6">
            <div class="serviceBox">
                <div class="service-icon" style="background-image:url(<?php echo $value['country_flag'];?>);background-size:cover;background-position:center;background-repeat:no-repeat;">
                </div>
                <h3 class="title"><?php echo $value['country_name'];?></h3>

            </div>
        </div>
          <?php
        }
        ?>        
      </div>

    </div>
  </section>