<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="card infoCard mb-4">
  <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
    <div class="media">
      <a href="#" class="mr-3 "><img class="img-circle curator_img" src="<?php echo $college_intro_data['info_curator_image'];?>" width="60" alt="<?php echo $college_intro_data['info_curator'];?>" draggable="false"></a>
      <div class="media-body">
        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> By <?php echo $college_intro_data['info_curator'];?>  </a> </h5>
        <p class="m-0">Content Curator 
          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
        </p>
      </div>
    </div>
    <div class="updateDate color2"><?php echo $college_intro_data['info_updated'];?></div>
  </div>
  <div class="card-body readall">
    <?php echo $college_intro_data['info_college_intro'];?>
    <?php
    if(!empty($college_intro_data['info_college_highlights'])){
      ?>
      <h5><span class="font-weight-bolder"><?php echo $college_intro_data['info_college_highlights_heading'];?></span></h5>
      <div class="table-responsive">
        <table class="table table-striped table-bordered table-sm">
          <tbody>
          <?php
          foreach ($college_intro_data['info_college_highlights'] as $key => $value) {
            ?>
            
              <?php
              if($value!=null){
                ?>
                <tr>
                  <td><strong><?php echo $key;?></strong></td>
                  <td><?php echo $value;?></td>
                </tr>
                <?php
              }

              ?>

            <?php
          }
          ?>
          </tbody>
        </table>
      </div>
      <?php
    }
    ?>

    <?php echo $college_intro_data['info_college_ranking_intro'];?>

    <?php
    if(!empty($college_intro_data['intro_college_ranking_data'])){

      //print_obj($college_intro_data['intro_college_ranking_data']);

      ?>
      <div class="table-responsive">
        <table class="table table-striped table-bordered table-sm">
           <thead style="background: #1b1f4c;border-color: #1b1f4c;color: #ffffff;">
              <tr>
                <th>Ranking Body / Magazine</th>
                <th>Year</th>
                <?php
                if($college_intro_data['intro_college_ranking_data'][0]->rank_category!='Not Applicable'){
                  ?>
                  <th>Category</th>
                  <?php
                }

                ?>
                
                <th>Rank</th>
              </tr>
           </thead>
           <tbody>
             <?php
             foreach ($college_intro_data['intro_college_ranking_data'] as $key => $value) {
               ?>
               <tr>
                 <td><?php echo $value->rank_body;?></td>
                 <td><?php echo $value->ranking_year;?></td>
                 <?php
                 if($value->rank_category!='Not Applicable'){
                  ?>
                  <td><?php echo $value->rank_category;?></td>
                  <?php
                 }
                 ?>
                 
                 <td><?php echo $value->ranking_value;?></td>
               </tr>
               <?php
             }
             ?>
           </tbody>
         </table>
      </div>
      <?php
    }

    ?>

    <?php echo $college_intro_data['info_college_course_intro'];?>

    <?php echo $college_intro_data['info_college_about'];?>

    <?php
    if(!empty($college_intro_data['intro_college_faqs'])){
      ?>
      <h2><span class="font-weight-bolder"><?php echo $college_intro_data['info_college']->college_name;?> FAQ's</span></h2>
      <div id="accordionExample1" class="accordion">
        <?php
        $i=0;
        foreach ($college_intro_data['intro_college_faqs'] as $key => $value) {
          ?>
          <div class="card br-0">
            <a href="#" data-toggle="collapse" data-target="#collapse<?php echo $i;?>" aria-expanded="true" aria-controls="collapse<?php echo $i;?>" class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong></strong><?php echo $key;?></a>
            <div id="collapse<?php echo $i;?>" data-parent="#accordionExample1" class="collapse <?php echo ($i==0)?'show':'';?>">
              <div class="card-body">
                <p class="font-weight-light m-0"><strong></strong><?php echo $value;?></p>
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