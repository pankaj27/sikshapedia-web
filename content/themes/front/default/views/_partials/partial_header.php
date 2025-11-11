<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<header class="header">

  <div class="isaMobileHeader clearfix">
    <a id="isaNavToggle" class="isaAnimatedArrow"><span></span></a>
    <span class="smllogo">
      <img src="<?php echo $system_logo_small;?>" width="80" alt="<?php echo $system_title_name;?>" title="<?php echo $system_title_name;?> Logo"/>
    </span>
    <div class="isaSearch clearfix">
      <button class="isaSearchToggler"><i class="fas fa-search"></i></button>
    </div>
  </div>
 
  <div class="headtoppart clearfix" style="width:92%;display:inline-block;margin:0;padding:0px;height:40px;">
    <div class="headerwp clearfix" style="width:100%;display:inline-block">
       
      <?php echo $this->widget->run('front_menu_top',TRUE);?>
      <div class="headertopright clearfix">

      	<?php
      	if(isset($system_facebook_link) && !empty($system_facebook_link))
      	{
      		?>
			    <a class="facebookicon" title="<?php echo $system_title_name;?> Facebook Page" href="<?php echo $system_facebook_link;?>"><i class="fab fa-facebook-f"></i> <span class="mobiletext02">Facebook</span></a>
      		<?php
      	}

        if(isset($system_instagram_link) && !empty($system_instagram_link))
        {
          ?>
          <a class="twittericon" title="<?php echo $system_title_name;?> Instagram Page" href="<?php echo $system_instagram_link;?>"><i class="fab fa-instagram"></i> <span class="mobiletext02">Instagram</span></a>
          <?php
        }

      	if(isset($system_twitter_link) && !empty($system_twitter_link))
      	{
      		?>
			    <a class="twittericon" title="<?php echo $system_title_name;?> Twitter Page" href="<?php echo $system_twitter_link;?>"><i class="fab fa-twitter"></i> <span class="mobiletext02">Twitter</span></a>
      		<?php
      	}
      	
      	if(isset($system_linkedin_link) && !empty($system_linkedin_link))
      	{
      		?>
			    <a class="linkedinicon" title="<?php echo $system_title_name;?> Linkedin Page" href="<?php echo $system_linkedin_link;?>"><i class="fab fa-linkedin-in"></i> <span class="mobiletext02">Linkedin</span></a>
      		<?php
      	}

      	if(isset($system_youtube_link) && !empty($system_youtube_link))
      	{
      		?>
			    <a class="googleicon" title="<?php echo $system_title_name;?> Google Page" href="<?php echo $system_youtube_link;?>"><i class="fab fa-youtube"></i> <span class="mobiletext02">Youtube</span></a>
      		<?php
      	}


      	?>
        
      </div>
    </div>
    
  </div>
  
  <div style="position: absolute;display:inline-block;background: #fd572e; height: 40px;width:8%">
     <div style="text-align:center;">
       <div class="topNav clearfix" style="padding:10px 3px 0;">
        <?php
        if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
          ?>
          <a href="<?php echo $account_url;?>"  style="text-transform: uppercase;font-size: 15px;"><i class="fa fa-user" aria-hidden="true" style="color:#fff !important;"></i><?php echo $user_fullname;?></a>
          <?php
        }else{
          ?>
          <a id="signinnnnn" href="<?php echo base_url('signup/student');?>" style="text-transform: uppercase;font-size: 15px;"><i class="fa fa-user" aria-hidden="true" style="color:#fff !important;"></i>REGISTER</a>
          <?php
        }
        ?>
            
       </div>
      </div>
  </div>
  

  <div class="headerSearch">
    <div class="searchPanel">
      <form id="form_search">
        <div class="searchBox">
          <button type="submit" class="searchSubmit"> <i class="fas fa-search"></i> </button>
          <input class="searchInput" type="text" id="searchInput" placeholder="Search for Colleges,Exams and more"> 
          <span class="searchClose"><i class="fas fa-times"></i></span>
        </div>
      </form>
      <div class="trendingSearch nicescroll desktop-search-list jsx-2743981883">
          
        <div class="searchBody">
            <h5>TRENDING SEARCHES</h5>
            <ul class="">
              <li>Upcoming Exams
              <li> "IIT" in Colleges</li>
              <li>"CAT" in Exams</li>
              <li>"Cat Cutoff" in News</li>
              <li>"MBA Colleges" in Delhi/NCR</li>
              <li>"MCA Colleges" in Delhi/NCR</li>
            </ul>
        </div>
      </div>
    </div> 
    <div class="searchBackDropPanel"></div>
  </div>

  <div class="headerfull" style="top:-8px;">
    <div class="isaMain clearfix">
      <div class="smllogo"><a href="<?php echo base_url();?>"><img src="<?php echo $system_logo;?>" alt="<?php echo $system_title_name;?>"  title="<?php echo $system_title_name;?> Logo"/></a></div>
       <div class="logoExt"></div>
      <nav class="isaMenu clearfix">
        
        <ul class="isaMenu-list">
          <li class="li_mobile_signin_menu">
            <div class="mobile_signin_menu">
              <div class="row">

                <div class="col-3" style="padding-top:20px !important;">
                  <a href="https://www.sikshapedia.com/signin">
                    <span class="profile-svg mr-2"> <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="20" stroke-width="2" d="M38 19.5C38 29.717 29.717 38 19.5 38S1 29.717 1 19.5 9.283 1 19.5 1 38 9.283 38 19.5z"></path><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="20" stroke-width="2" d="M27.09 28.038v0-1.897a3.795 3.795 0 0 0-3.795-3.795h-7.59a3.795 3.795 0 0 0-3.795 3.795v1.897M23.295 13.333a3.795 3.795 0 1 1-7.59 0 3.795 3.795 0 0 1 7.59 0z"></path></svg></span>
                  </a>
                </div>

                <div class="col-9" style="padding-top:13px !important;">
                  <div style="height:10px;text-align:left;">
                    <p class="m-0">
                    <?php
                    if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
                      ?>
                      <a href="<?php echo base_url('account');?>" style="color:#fff;"> 
                        <span class="font-weight-semi text-white h6 text-capitalize" style="font-size:2rem;"><?php echo $user_fullname;?></span></p><p class="m-0 text-gray-300" style="font-size:1.5rem;"> Click to view your profile
                      </a>
                      <?php
                    }else{
                      ?>
                      <a href="<?php echo base_url('signup/student');?>" style="color:#fff;"> 
                        <span class="font-weight-semi text-white h6 text-capitalize" style="font-size:2rem;">REGISTER</span></p><p class="m-0 text-gray-300" style="font-size:1.5rem;"> For Better Experience
                      </a>
                      <?php
                    }
                    ?> 
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        <?php $this->widget->run('front_menu',TRUE);?>
          <li class="isaSearchBar">
            <button class="isaSearchToggler"><i class="fas fa-search"></i></button>
          </li>
       
        
        </ul>
      </nav>

    </div>
  </div>
</header>
<div class="heraderFixedSpace"></div>

<style>
  .heraderFixedSpace{
    margin-top:-40px !important;
  }
</style>