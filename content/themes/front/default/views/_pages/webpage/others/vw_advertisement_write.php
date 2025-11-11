<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<style>
  .pricingTable{
    color: #fff;
    background: #fff;
    font-family: 'Open Sans', sans-serif;
    text-align: center;
    border-radius: 50px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    overflow: hidden;
    position: relative;
}
.pricingTable .pricingTable-header{
    background: linear-gradient(to right,#82E19A,#30B662);
    padding: 15px 0 16px;
    margin: 0 0 30px;
    border-radius: 0 0 40% 40%;
}
.pricingTable .title{
    font-size: 35px;
    font-weight: 700;
    line-height: 35px;
    text-transform: uppercase;
    margin: 0;
}
.pricingTable .price-value{
    color: #444;
    background-color: #fff;
    height: 140px;
    width: 140px;
    padding: 43px 0;
    margin: 0 auto 10px;
    border-radius: 50%;
    box-shadow: 0 5px 0 15px #82E19A;
    position: relative;
}
.pricingTable .price-value .amount{
    font-size: 48px;
    font-weight: 600;
    line-height: 40px;
    letter-spacing: -0.5px;
    display: inline-block;
}
.pricingTable .price-value .amount-sm{
    font-size: 22px;
    font-weight: 400;
    line-height: 25px;
    vertical-align: top;
    display: inline-block;
}
.pricingTable .price-value .duration{
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    display: inline-block;
}
.pricingTable .pricing-content{
    background: linear-gradient(to bottom,#82E19A,#30B662);
    padding: 70px 20px 40px;
    margin: -30px 0 0;
}
.pricingTable .pricing-content ul{
    padding: 0;
    margin: 0 0 40px;
    list-style: none;
    display: inline-block;
}
.pricingTable .pricing-content ul li{
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    line-height: 30px;
    text-align: left;
    letter-spacing: 0.5px;
    text-transform: capitalize;
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
    padding: 0 20px 0 30px;
    margin: 0 0 7px;
    position: relative;
}
.pricingTable .pricing-content ul li:nth-child(even){ background: transparent; }
.pricingTable .pricing-content ul li:before{
    content: "\f00c";
    color: #fff;
    font-family: "Font Awesome 5 free";
    font-size: 18px;
    font-weight: 900;
    position: absolute;
    top: 1px;
    left: 0;
}
.pricingTable .pricing-content li.disable:before{ content: "\f00d"; }
.pricingTable .pricingTable-signup a{
    color: #30B662;
    background: #fff;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 9px 26px;
    border: none;
    border-radius: 20px;
    transition: all 0.3s ease 0s;
}
.pricingTable .pricingTable-signup a:hover{ box-shadow: 0 0 15px rgba(0,0,0,0.5); }
.pricingTable.orange .pricingTable-header{ background: linear-gradient(to right,#FE9C3C,#FF773A); }
.pricingTable.orange .price-value{ box-shadow: 0 5px 0 15px #FE9C3C; }
.pricingTable.orange .pricing-content{ background: linear-gradient(to bottom,#FE9C3C,#FF773A); }
.pricingTable.orange .pricingTable-signup a{ color: #FF773A; }
.pricingTable.blue .pricingTable-header{ background: linear-gradient(to right,#43B5B5,#31939B); }
.pricingTable.blue .price-value{ box-shadow: 0 5px 0 15px #43B5B5; }
.pricingTable.blue .pricing-content{ background: linear-gradient(to bottom,#43B5B5,#31939B); }
.pricingTable.blue .pricingTable-signup a{ color: #31939B; }
@media only screen and (max-width: 990px){
    .pricingTable{ margin: 0 0 40px; }
	
	}
</style>



<section class="reviewBanner bg-orange-gradient">
    <div class="wrapper">
      <div class="row">
        <div class="col-lg-8 offset-lg-2">
          <div class="row">
            <div class="col-sm-6 col-md-6 order-sm-2">
              <img src="assets/img/imggh.png" width="500"  alt="">
              <div>
                  <a href="#" class="card featureReviewCard">
                      <div class="card-body d-flex align-items-center">
                        
                        <div class="cardContent">
                         <p>
                             <h4>Offer for Educational institutes</h4><br>
                              With the evolvement of the internet era, the dependency of users has shown a drastic change. To fulfill this, the portal welcomes all the educational institutes, colleges, universities to feel the real growth with us. Waytoadmissions provide the best facilities and services that you had experience never been before. Some of the major fields where we focused at:
                          </p>
                          <ul>
                              <li>Generation of an individual microsite for the colleges/universities.</li>
                                <li>Provide referral link for fast disposal</li>
                                <li>Creative and attractive images for an instant look</li>
                                <li>Attach your API for instant notification about information seekers</li>
                                <li>The assured rise in the number of user interface</li>
                                <li>Ample space for special banners</li>
                                <li>User-friendly access</li>
                          </ul>
                        </div>
                      </div>
                    </a>
                    
              </div>
            </div>
            <div class="col-sm-6 col-md-6  order-sm-1 d-flex align-items-center">
              <div class="">
                <h1>Advertise with us</h1>
                <p>
                    Waytoadmissions.com is one of the most affirmative, creative, and correlative education portal designed with a user-friendly interface to ensure optimum conversion of results. The composition of the portal is developed after analysis of the need of students, parents, and educators. The learners who are looking to have information on higher education can rely on the website as some numerous top-rated colleges and universities collaborated with us to dispense the best quality service.
                </p>
                <p>
                    Waytoadmissions invites all the colleges and universities pan India to register with us and grow wildly. The portal bridges the gap between the students and educational institutes so that they can meet under one roof to display their needs and get satisfactory results accordingly. Special offers are being provided by the portal to their privileged subscribers from time to time so that they can expand their reach and help them to promote their educational institution in a wider space.
                </p>
                <br>
               <h4> Advertisers:</h4>
                <ul>
                    <li>Ample space for third party banners</li>
                    <li>Algorithm to adjust the placement of banners only on relevant pages</li>
                    <li>Ad Rotation Policy to ensure the sustainable advert reach and frequency of visitors seeing the ad</li>
                </ul>
                <button type="submit" class="btn btn-primary" id="btn_update_account" disabled="true" >For further information and query, you can write us at : advertising@waytoadmissions.com</button>
                </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
</section>

<section class="commonSec bg-white">
  <div class="wrapper">
    <div class="section-title">
      <h3>Our Pricing Plan</h3>
    </div>
    <div class="row">
          <div class="col-md-3 col-sm-6">
               <img src="assets/img/itt.png" width="300"  alt="">
           </div>
           <div class="col-md-3 col-sm-6">
                <div class="pricingTable">
                    <div class="pricingTable-header">
                        <h3 class="title">Standard</h3>
                    </div>
                    <div class="price-value">
                        <span class="amount">$10</span>
                        <span class="amount-sm">99</span>
                        <span class="duration">per month</span>
                    </div>
                    <div class="pricing-content">
                        <ul>
                            <li>Lorium Ipsum Dollar</li>
                            <li>Lorium Ipsum Dollar</li>
                            <li>Lorium Ipsum Dollar</li>
                            <li class="disable">Lorium Ipsum Dollar</li>
                            <li class="disable">Lorium Ipsum Dollar</li>
                        </ul>
                        <div class="pricingTable-signup">
                            <a href="#">Sign Up</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="pricingTable orange">
                    <div class="pricingTable-header">
                        <h3 class="title">Business</h3>
                    </div>
                    <div class="price-value">
                        <span class="amount">$20</span>
                        <span class="amount-sm">99</span>
                        <span class="duration">per month</span>
                    </div>
                    <div class="pricing-content">
                        <ul>
                            <li>Lorium Ipsum Dollar</li>
                            <li>Lorium Ipsum Dollar</li>
                            <li>Lorium Ipsum Dollar</li>
                            <li>Lorium Ipsum Dollar</li>
                            <li class="disable">Lorium Ipsum Dollar</li>
                        </ul>
                        <div class="pricingTable-signup">
                            <a href="#">Sign Up</a>
                        </div>
                    </div>
                </div>
            </div>
             <div class="col-md-3 col-sm-6">
                    <div class="pricingTable blue">
                        <div class="pricingTable-header">
                            <h3 class="title">Premium</h3>
                        </div>
                        <div class="price-value">
                            <span class="amount">$30</span>
                            <span class="amount-sm">99</span>
                            <span class="duration">per month</span>
                        </div>
                        <div class="pricing-content">
                            <ul>
                                <li>Lorium Ipsum Dollar</li>
                                <li>Lorium Ipsum Dollar</li>
                                <li>Lorium Ipsum Dollar</li>
                                <li>Lorium Ipsum Dollar</li>
                                <li>Lorium Ipsum Dollar</li>
                            </ul>
                            <div class="pricingTable-signup">
                                <a href="#">Sign Up</a>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
  </div>
</section>
<br><br><br>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.theme.min.css">

<style>
    .testimonial{
    margin: 0 20px 40px;
}
.testimonial .testimonial-content{
    padding: 35px 25px 35px 50px;
    margin-bottom: 35px;
    background: #fff;
    border: 1px solid #f0f0f0;
    position: relative;
}
.testimonial .testimonial-content:after{
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    background: #fff;
    position: absolute;
    bottom: -10px;
    left: 22px;
    transform: rotate(45deg);
}
.testimonial-content .testimonial-icon{
    width: 50px;
    height: 45px;
    background: #ff4242;
    text-align: center;
    font-size: 22px;
    color: #fff;
    line-height: 42px;
    position: absolute;
    top: 37px;
    left: -19px;
}
.testimonial-content .testimonial-icon:before{
    content: "";
    border-bottom: 16px solid #e41212;
    border-left: 18px solid transparent;
    position: absolute;
    top: -16px;
    left: 1px;
}
.testimonial .description{
    font-size: 15px;
    font-style: italic;
    color: #8a8a8a;
    line-height: 23px;
    margin: 0;
}
.testimonial .title{
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #525252;
    text-transform: capitalize;
    letter-spacing: 1px;
    margin: 0 0 5px 0;
}
.testimonial .post{
    display: block;
    font-size: 14px;
    color: #ff4242;
}
.owl-theme .owl-controls{
    margin-top: 20px;
}
.owl-theme .owl-controls .owl-page span{
    background: #ccc;
    opacity: 1;
    transition: all 0.4s ease 0s;
}
.owl-theme .owl-controls .owl-page.active span,
.owl-theme .owl-controls.clickable .owl-page:hover span{
    background: #ff4242;
}
</style>
<section class="commonSec bg-white">
  <div class="wrapper">
    <div class="section-title">
      <h3>Our Awasome Clients Say About Us</h3>
    </div>
    <div class="row">
        
        <div class="col-md-8">
                <div id="testimonial-slider" class="owl-carousel">
                    <div class="testimonial">
                        <div class="testimonial-content">
                            <div class="testimonial-icon">
                                <i class="fa fa-quote-left"></i>
                            </div>
                            <p class="description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum dolor sit amet eros imperdiet, sit amet hendrerit nisi vehicula.
                            </p>
                        </div>
                        <h3 class="title">williamson</h3>
                        <span class="post">Web Developer</span>
                    </div>
 
                </div>
            </div>
            <div class="col-md-4">
                
            </div>
      
    </div>
</section>
<br><br>
<section class="commonSec bg-white">
  <div class="wrapper">
    <div class="section-title">
      <h3>This week Featured Review </h3>
    </div>
    <div class="row">
      <div class="col-sm-6 col-md-4 col-lg-3">
        <a href="#" class="card featureReviewCard">
          <div class="card-body d-flex align-items-center">
            <div class="cardIcon"><div class="ico bg-blue-gradient">S</div></div>
            <div class="cardContent">
              <b> Suhani Singh, </b> <span>  Master of Business Administrat..., Batch 2020  </span><br>
              <small> BHU Varanasi, Uttar Pradesh </small>
              <h6 class="color-orange">See Review</h6>
            </div>
          </div>
        </a>
      </div>
      <div class="col-sm-6 col-md-4 col-lg-3">
        <a href="#" class="card featureReviewCard">
          <div class="card-body d-flex align-items-center">
            <div class="cardIcon"><div class="ico bg-indigo-gradient">S</div></div>
            <div class="cardContent">
              <b> Suhani Singh, </b> <span>  Master of Business Administrat..., Batch 2020  </span><br>
              <small> BHU Varanasi, Uttar Pradesh </small>
              <h6 class="color-orange">See Review</h6>
            </div>
          </div>
        </a>
      </div>
      <div class="col-sm-6 col-md-4 col-lg-3">
        <a href="#" class="card featureReviewCard">
          <div class="card-body d-flex align-items-center">
            <div class="cardIcon"><div class="ico bg-pink-gradient">S</div></div>
            <div class="cardContent">
              <b> Suhani Singh, </b> <span>  Master of Business Administrat..., Batch 2020  </span><br>
              <small> BHU Varanasi, Uttar Pradesh </small>
              <h6 class="color-orange">See Review</h6>
            </div>
          </div>
        </a>
      </div>
      <div class="col-sm-6 col-md-4 col-lg-3">
        <a href="#" class="card featureReviewCard">
          <div class="card-body d-flex align-items-center">
            <div class="cardIcon"><div class="ico bg-green-gradient">S</div></div>
            <div class="cardContent">
              <b> Suhani Singh, </b> <span>  Master of Business Administrat..., Batch 2020  </span> <br>
              <small> BHU Varanasi, Uttar Pradesh </small>
              <h6 class="color-orange">See Review</h6>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>
<br>


<?php $this->widget->run('front_subscription_section',TRUE);?>


<div class="modal fade reviewCollegeSearckModal" id="reviewCollegeSearckModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered  modal-lg">
    <div class="modal-content">
      <div class="modal-header align-items-center">
        <div class="f-flex justify-content-between">
          <button type="button" class="btn btn-outline-danger btn-sm"><i class="fas fa-angle-left"></i> Previous</button>
          <button type="button" class="btn btn-outline-primary btn-sm">Select College/Institute</button>
          <i class="fas fa-chevron-right"></i>
          <button type="button" class="btn btn-outline-secondary btn-sm">Select Course</button>
        </div>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body h-350p">
         <div class="searchPanel">
          <button type="button" data-dismiss="modal" data-toggle="modal" data-target="#enterCollegeCourse" class="btn btn-link"><i class="far fa-question-circle"></i> Can't Find my Course, Enter Manually</button>              
          <div class="searchBox mt-2"><input type="text" class="keyword" placeholder="Search " id="search_review_college"><span class="searchIcon"></span></div>
          <ul class="suggestList nicescroll">
            
          </ul>
          
         </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade enterCollegeCourse" id="enterCollegeCourse" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered  modal-lg">
    <div class="modal-content">
      <div class="modal-header align-items-center justify-content-start">
        <button type="button" class="btn btn-outline-primary" data-dismiss="modal" aria-label="Close" ><i class="fas fa-arrow-left"></i></button>
        <h5 class="m-0 ml-3">Enter Your College & Course</h5>
      </div>
      <div class="modal-body">
        <form>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Enter college name">
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Enter college name">
              </div>
            </div>
            <div class="col-sm-12">
              <button type="button" class="btn btn-primary btn-lg">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.js"></script>
 <script>
$(document).ready(function(){
    $("#testimonial-slider").owlCarousel({
        items:3,
        itemsDesktop:[1000,3],
        itemsDesktopSmall:[980,2],
        itemsTablet:[768,2],
        itemsMobile:[650,1],
        pagination:true,
        navigation:false,
        slideSpeed:1000,
        autoPlay:true
    });
});

</script>

<script type="text/javascript">var review_course_populate=false;</script>