<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($top_menues['menues'])){
  
  foreach ($top_menues['menues'] as $key => $value) {
    ?>
    <li aria-haspopup="true">
      <a href="<?php echo $value['menu_link'];?>" class="navtext"><span>Filter By</span> <span><?php echo $value['menu_name'];?></span></a>
      <?php
      if(isset($value['sub_menues']) && !empty($value['sub_menues'])){
        ?>
        <div class="isaShopTabing isaDepartmentMenu clearfix">
          <div class="isaShopwp clearfix">
            <ul class="isaTabItem clearfix">
              <?php
              $i=0;
              foreach ($value['sub_menues'] as $k => $v) {
                ?>
                <li <?php echo ($i==0)?'class="isaShopLink-active"':'';?> id="menu<?php echo $i;?>">
                  <a href="#"> <?php echo $v['menu_name'];?></a>
                  <?php
                  if(!empty($v['sub_menues'])){
                    ?>
                    <div class="isaTitemRight clearfix">
                      <div class="container-fluid">

                        <div class="row">
                          <?php
                          foreach ($v['sub_menues'] as $_k => $_v){
                            ?>
                            <div class="col-lg-<?php echo $_v['menu_column_width'];?> col-md-12 <?php echo ($_v['menu_column_has_image']=='2')?'clearfix':'';?>">
                              <ul class="<?php echo ($_v['menu_column_has_link']=='1')?'isaTliststy04':'isaTliststy02';?> clearfix">
                                <?php
                                if($_v['menu_column_has_image']=='1'){
                                  ?>
                                  <li class="text-center"><img src="<?php echo $_v['menu_column_image'];?>" alt="<?php echo $_v['menu_column'];?>" loading="lazy" <?php echo ($_v['menu_column_has_link']=='1')?'style="height:'.$_v['menu_column_image_height'].'px;width:'.$_v['menu_column_image_width'].'px"':'style="height:50px;"';?> draggable="false"></li>
                                  <?php
                                }
                                ?>
                                <li class="isaHeading clearfix">

                                  <?php

                                  if($_v['menu_column_has_link']=='1'){
                                    ?>
                                    <a href="<?php echo $_v['menu_column_link'];?>"><?php echo $_v['menu_column'];?></a>
                                    <?php

                                  }else{
                                    echo $_v['menu_column'];
                                  }

                                  ?>                                       
                                </li>
                                <?php

                                if(!empty($_v['sub_menues'])){
                                   foreach ($_v['sub_menues'] as $_k => $_v) {
                                    ?>
                                    <li>

                                      <?php
                                      if($_v['menu_link_type']=='4'){
                                        ?>
                                        <div class="mb-1 d-flex navMedia">
                                          <div class=" mr-2">
                                            <img width="40" height="40" src="<?php echo $_v['menu_image'];?>" loading="lazy" alt="<?php echo $_v['menu_name'];?>" draggable="false">
                                          </div>
                                          <div>
                                             <a class="cd-nav-dropdown-sub-heads" href="<?php echo $_v['menu_link'];?>">
                                                <?php echo $_v['menu_name'];?> > 
                                             </a>
                                              <!-- <div>  
                                                <a href="#" class="d-inline mr-1">Registration</a>  
                                                <a href="" class="d-inline mr-1">Syllabus</a>  
                                                <a href="" class="d-inline mr-1">Exam Pattern</a>  
                                              </div> -->
                                          </div>
                                       </div>
                                        <?php
                                      }else{
                                        ?>
                                        <a href="<?php echo $_v['menu_link'];?>"><?php echo $_v['menu_name'];?></a>
                                        <?php
                                      }
                                      ?>
                                    </li>
                                    <?php
                                  }
                                }

                                 
                                ?>
                              </ul>
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
                </li>
                <?php

                $i++;
                
              }
              ?>
            </ul>
          </div>


          <?php

          if(!empty($top_menu_footer_ads[$value['menu_id']])){
            ?>
            <div class="navFooter">
              <h4 class="title"><strong><?php echo $top_menu_footer_ads_heading[$value['menu_id']]['heading'];?></strong></h4>
              <div class="row form-row">
                <?php
                foreach ($top_menu_footer_ads[$value['menu_id']] as $k => $v) {
                    ?>
                    <div class="col-sm-4">
                      <div class="media navMedia">
                        <img src="<?php echo $v['college_logo'];?>" class="mr-3" loading="lazy" alt="<?php echo $v['college_name'].' '.$value['menu_id'];?>" draggable="false">
                        <div class="media-body">
                          <h5 ><a href="<?php echo $v['college_link'];?>"><?php echo $v['college_name'];?></a></h5>
                          <p><?php echo $v['college_address'];?></p>
                        </div>
                      </div>
                    </div>
                    <?php
                }
                ?>
              </div>
            </div>
            <?php
          }
          ?>                
        </div>
        <?php
      }
      ?>
    </li>
    <?php
  }
}
?>