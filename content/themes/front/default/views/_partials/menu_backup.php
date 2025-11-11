<div class="mobile_signin_menu">
  <div class="row">

    <div class="col-3" style="padding-top:20px !important;">
      <span class="profile-svg mr-2"> <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="20" stroke-width="2" d="M38 19.5C38 29.717 29.717 38 19.5 38S1 29.717 1 19.5 9.283 1 19.5 1 38 9.283 38 19.5z"></path><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="20" stroke-width="2" d="M27.09 28.038v0-1.897a3.795 3.795 0 0 0-3.795-3.795h-7.59a3.795 3.795 0 0 0-3.795 3.795v1.897M23.295 13.333a3.795 3.795 0 1 1-7.59 0 3.795 3.795 0 0 1 7.59 0z"></path></svg></span>
    </div>

    <div class="col-9" style="padding-top:20px !important;">
      <div style="height:10px;text-align:left;"><p class="m-0"> <span class="font-weight-semi text-white h6 text-capitalize" style="font-size:2rem;">Sign in / Signup</span></p><p class="m-0 text-gray-300" style="font-size:1rem;"> For Better Search &amp; Experience</p></div>
    </div>

    <!-- <a class="jsx-1199801128 bg-secondary profile-container " href="/login">
      

      </a> -->
  </div>
</div>


<li>
  <div class="">
    <div class="row">
      <div class="col-3">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
         width="50.000000pt" height="50.000000pt" viewBox="0 0 50.000000 50.000000"
         preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
        fill="#000000" stroke="none">
        </g>
        </svg>
      </div>
      <div class="col-9"></div>
    </div>
  </div>
</li>


 <?php echo $this->widget->run('front_menu_top_mobile',TRUE);?>


 <li aria-haspopup="true" class="wsshopmyaccount">
  <span class="isaMenu-click">
    <i class="isaMenu-arrow"></i>
  </span>
  <a href="#"> SIGN UP</a>
  <ul class="sub-menu">
    <li>
      <a href="https://www.waytoadmissions.com/signup/college">
        <i class="fas fa-user-plus"></i> As College </a>
    </li>
    <li>
      <a href="https://www.waytoadmissions.com/signup/student">
        <i class="fas fa-user-plus"></i> As Student </a>
    </li>
    <li>
      <a href="https://www.waytoadmissions.com/signin">
        <i class="fas fa-user-plus"></i> Sign In </a>
    </li>
  </ul>
</li>



 <?php
            if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
                ?>
                <li aria-haspopup="true" class="wsshopmyaccount">
                  <a href="#"><i class="fas fa-user"></i> <?php echo $user_fullname;?></a>
                  <ul class="sub-menu">
                    <!-- <li><a href="#logModal" data-toggle="modal"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                    <li><a href="#regModal" data-toggle="modal"><i class="fas fa-user-plus"></i> Register</a></li> -->
                    <li><a href="<?php echo $account_url;?>"><i class="fas fa-user-tie"></i> My Account</a></li>
                    <li><a href="#passModal" data-toggle="modal"><i class="fas fa-lock"></i>Change Password</a></li>
                    <!-- <li><a href="#"><i class="fas fa-heart"></i>My Wishlist</a></li>
                    <li><a href="#"><i class="fas fa-bell"></i> Notification</a></li>
                    <li><a href="#"><i class="fas fa-question-circle"></i> Help Center</a></li> -->
                    <li><a href="<?php echo base_url();?>logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                  </ul>
                </li>
                <?php
            }else{
              ?>
              <!-- <li aria-haspopup="true" class="wsshopmyaccount"><a href="<?php echo base_url();?>signin" data-toggle="modal">SIGN IN</a></li> -->
              <li aria-haspopup="true" class="wsshopmyaccount">
                  <a href="#"> SIGN UP</a>
                  <ul class="sub-menu">
                    <li><a href="<?php echo base_url();?>signup/college"><i class="fas fa-user-plus"></i> As College</a></li>
                    <!-- <li><a href="<?php echo base_url();?>signup/university"><i class="fas fa-user-plus"></i> As University</a></li> -->
                    
                    <li><a href="<?php echo base_url();?>signup/student"><i class="fas fa-user-plus"></i> As Student</a></li>
                    <li><a href="<?php echo base_url();?>signin"><i class="fas fa-user-plus"></i> Sign In</a></li>
                  </ul>
                </li>             
              <?php
            }
          ?>