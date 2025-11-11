<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="jsx-1429660247 header_section mx-auto mt-0 text-center jsx-1429660247-head">
  <h4 class="text-center text-uppercase">Don't know how to choose? <br> Choose by category</h4>
  <p class="text-center mb-4">Sikshapedia.com is an extensive search engine for the students, parents and education industry players who are seeking information</p>
</div>



<div class="row">



  <div class="jsx-1429660247 mx-0 row mobile-overflow-course">
    <?php
    if(!empty($course_categories)){
      foreach ($course_categories as $key => $value){
        if(isset($value['ads_link'])){
          ?>
          <!--ads block-->
          <?php
        }else{
          foreach ($value as $k => $v){
            ?>
            <div class="col-4 mb-5 interestcard">
              <div class="jsx-1947033027 card-course rounded text-center d-block position-relative bg-white card suggestCard">
                 <div class="jsx-1947033027 image-div position-relative">
                    <img data-src="<?php echo $v['category_image'];?>" src="<?php echo $v['category_image'];?>" alt="<?php echo $v['category_show_name'];?>" height="223px" class="jsx-129709487 course-card-img ls-is-cached lazyloaded">
                    <a class="jsx-1947033027 info position-absolute w-100 text-uppercase">
                       <h2 class="jsx-1947033027 m-0 font-weight-bolder hone text-white"><?php echo $v['category_show_name'];?></h2>
                       <p class="jsx-1947033027 text-md font-weight-medium"><?php echo $v['category_desc'];?></p>
                    </a>
                    <div class="jsx-1947033027 backdrop position-absolute w-100 h-100"></div>
                 </div>
                 <div class="jsx-1947033027 list-wrapper">
                    <ul class="jsx-1429660247 level-ul p-0 pt-3 mb-2 w-100">
                      <?php
                      if(!empty($category_streams)){
                        foreach ($category_streams as $_key => $_value){
                          if($_key==$v['category_id']){
                            foreach ($_value as $_k => $_v){
                              ?>
                              <a class="jsx-1429660247 level-tags d-inline-block my-1 bg-white position-relative text-heading text-right" href="<?php echo $_v['stream_access_url'];?>"><span class="jsx-1429660247 text-white font-weight-bolder text-center d-inline-block"><?php echo $_v['stream_course_count'];?></span><span class="jsx-1429660247 text-uppercase py-0 px-2"><?php echo $_v['stream_name'];?></span></a>
                              <?php
                            }
                          }
                        }
                      }
                      ?>
                    </ul>
                 </div>
              </div>
            </div>
            <?php
          }
        }
      }
    }
    ?>
  </div>


</div>