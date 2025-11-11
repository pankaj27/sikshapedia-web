<div class="col-12 col-lg-12 col-md-12 ">
  <div class="footer-links pt-3 pt-lg-5 pb-3">
    <div class="section-title text-white">
      <h4>TOP COLLEGES</h4>
    </div>

    <div class="btnGroup text-center text-center list-unstyled d-flex justify-content-center align-items-center flex-wrap footer_menu_mobile">
      <a href="https://www.sikshapedia.com/in/colleges/management/master-of-business-administration" class="btn btn-outline-primary">M.B.A</a>
      <a href="https://www.sikshapedia.com/in/colleges/engineering/bachelor-of-technology" class="btn btn-outline-primary">B.TECH</a>
      <a href="https://www.sikshapedia.com/in/colleges/computer-applications/master-of-computer-applications" class="btn btn-outline-primary">MCA</a>
      <a href="https://www.sikshapedia.com/in/colleges/computer-applications/bachelor-of-computer-applications" class="btn btn-outline-primary">BCA</a>
      <a href="https://www.sikshapedia.com/in/colleges/engineering/master-of-technology" class="btn btn-outline-primary">M.TECH</a>
      <a href="https://www.sikshapedia.com/in/colleges/arts/master-of-arts" class="btn btn-outline-primary">MA</a>
      <a href="https://www.sikshapedia.com/in/colleges/arts/bachelor-of-arts" class="btn btn-outline-primary">BA</a>
    </div>
  </div>
</div>
<div class="col-12 col-lg-12 col-md-12 ">
  <div class="footer-links pt-3 pt-lg-5 pb-3">
    <div class="section-title text-white">
      <h4>TOP EXAMS</h4>
    </div>
    <div class="btnGroup text-center text-center list-unstyled d-flex justify-content-center align-items-center flex-wrap footer_menu_mobile">
      <a href="https://www.sikshapedia.com/exams/cat" class="btn btn-outline-primary">CAT</a>
      <a href="https://www.sikshapedia.com/exams/engineering/gate" class="btn btn-outline-primary">GATE</a>
      <a href="https://www.sikshapedia.com/exams/jee-main" class="btn btn-outline-primary">JEE-MAIN</a>
      <a href="https://www.sikshapedia.com/exams/neet" class="btn btn-outline-primary">NEET</a>
      <a href="https://www.sikshapedia.com/exams/xat" class="btn btn-outline-primary">XAT</a>
      <a href="https://www.sikshapedia.com/exams/clat" class="btn btn-outline-primary">CLAT</a>
      <a href="https://www.sikshapedia.com/exams/mat" class="btn btn-outline-primary">MAT</a>
    </div>
  </div>
</div>
<!-- <div class="col-12 col-lg-12 col-md-12 ">
  <div class="footer-links pt-3 pt-lg-5 pb-3">
    <div class="section-title text-white">
      <h4>STUDY ABROAD</h4>
    </div>
    <div class="btnGroup text-center text-center list-unstyled d-flex justify-content-center align-items-center flex-wrap">
      <a href="#">CANADA</a>
      <a href="#">USA</a>
      <a href="#">UK</a>
      <a href="#">AUSTRALIA</a>
      <a href="#">GERMANY</a>
      <a href="#">IRELAND</a>
    </div>
  </div>
</div> -->
<div class="col-12 col-lg-12 col-md-12 ">
  <div class="footer-links pt-3 pt-lg-5 pb-3">
    <div class="section-title text-white">
      <h4>OTHER LINKS</h4>
    </div>
    <div class="btnGroup text-center text-center list-unstyled d-flex justify-content-center align-items-center flex-wrap footer_menu_mobile">
      <a href="https://www.sikshapedia.com/signup/college" class="btn btn-outline-primary">BUSINESS SIGNUP</a>
      <a href="https://www.sikshapedia.com/about-us" class="btn btn-outline-primary">ABOUT SIKSHAPEDIA</a>
      <a href="https://www.sikshapedia.com/contact-us" class="btn btn-outline-primary">CONTACT US</a>
      <a href="https://www.sikshapedia.com/advertise-with-us" class="btn btn-outline-primary">ADVERTISING</a>
      <a href="https://www.sikshapedia.com/terms-conditions" class="btn btn-outline-primary">TERMS &amp; CONDITIONS</a>
    </div>
  </div>
</div>

<div class="col-12 col-lg-12 col-md-12">
  <div class="footer-links pt-3 pt-lg-5 pb-3">
  <?php
          if(isset($system_facebook_link) && !empty($system_facebook_link))
          {
            ?>
        <a class="facebookicon" title="Facebook" href="<?php echo $system_facebook_link;?>"><i class="fab fa-facebook-f"></i> <span class="mobiletext02">Facebook</span></a>
            <?php
          }

          if(isset($system_instagram_link) && !empty($system_instagram_link))
          {
            ?>
            <a class="twittericon" title="Instagram" href="<?php echo $system_instagram_link;?>"><i class="fab fa-instagram"></i> <span class="mobiletext02">Instagram</span></a>
            <?php
          }

          if(isset($system_twitter_link) && !empty($system_twitter_link))
          {
            ?>
            <a class="twittericon" title="Twitter" href="<?php echo $system_twitter_link;?>"><i class="fab fa-twitter"></i> <span class="mobiletext02">Twitter</span></a>
            <?php
          }
          
          if(isset($system_linkedin_link) && !empty($system_linkedin_link))
          {
            ?>
            <a class="linkedinicon" title="Linkedin" href="<?php echo $system_linkedin_link;?>"><i class="fab fa-linkedin-in"></i> <span class="mobiletext02">Linkedin</span></a>
            <?php
          }

          if(isset($system_youtube_link) && !empty($system_youtube_link))
          {
            ?>
            <a class="googleicon" title="Google" href="<?php echo $system_youtube_link;?>"><i class="fab fa-youtube"></i> <span class="mobiletext02">Youtube</span></a>
            <?php
          }


          ?>
        </div>
</div>