<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="reviewBanner bg-orange-gradient">
    <div class="wrapper">
      <div class="row">
        <div class="col-lg-8 offset-lg-2">
          <div class="row">
            <div class="col-sm-7 col-md-8 order-sm-2">
              <img src="<?php echo base_url('public/data/app/app_data/img4.png');?>" width="500"  alt="">
            </div>
            <div class="col-sm-5 col-md-4  order-sm-1 d-flex align-items-center">
              <div class="">
                <h2>Submit your College <br> Review and win upto</h2> 
                <h1 class="color-black display-4 mb-4"><strong>Rs. 200.00</strong></h1>
                <a href="<?php echo $guideline_link;?>" class="btn btn-outline-light" target="_blank">See Guidelines <i class="fas fa-angle-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="reviewSearchBox">
          <div class="crBox">
            <input type="radio" id="india" name="r-check" checked>
            <label for="india" >India</label>
          </div>
          <!-- <div class="crBox">
            <input type="radio" id="abroad" name="r-check">
            <label for="abroad">Abroad</label>
          </div> -->
            <div class="searchPanel" data-toggle="modal" data-target="#reviewCollegeSearckModal">                
            <div class="searchBox"><input type="text" class="keyword" placeholder="Search "><span class="searchIcon"></span></div>
            </div>
      </div>
    </div>
</section>


<section class="commonSec bg-white">
  <div class="wrapper">
    <div class="section-title">
      <h3>How to win Awesome Rewards for Reviews</h3>
    </div>
    <div class="row">
      <div class="col-md-5">
        <!--<img src="assets/img/d-review-prize-section.png" class="img-fluid">-->
        <img src="<?php echo base_url('public/data/app/app_data/image2.jpg');?>" class="img-fluid">
        
      </div>
      <div class="col-md-7">
        <div class="media mb-3">
          <div class="icon mr-3">
            <svg class="w-80p" id="icon-rewards-published" viewBox="0 0 34 34"><path fill="#fff9f0" d="M0 17C0 7.611 7.611 0 17 0s17 7.611 17 17-7.611 17-17 17S0 26.389 0 17z"></path><path fill="#fea328" d="M25.744 21.034a.746.746 0 0 1-.746.746h-7.714a.536.536 0 0 0-.373.157l-3.71 3.71a.592.592 0 0 1-.648.137c-.078-.04-.373-.176-.373-.55V22.31a.507.507 0 0 0-.51-.51H9.923a.746.746 0 0 1-.746-.746V10.003c0-.412.334-.746.746-.746h15.075c.412 0 .746.334.746.746zm-.746-12.817H9.923c-.981 0-1.786.804-1.786 1.786v11.05c0 .982.805 1.787 1.786 1.787h1.237v2.414a1.6 1.6 0 0 0 1 1.492c.217.079.413.137.629.137.412 0 .824-.157 1.138-.47l3.553-3.553h7.498c.982 0 1.786-.805 1.786-1.787v-11.07a1.764 1.764 0 0 0-1.766-1.786z"></path><path fill="#fea328" d="M19.09 15.99a.704.704 0 0 0-.197.608l.256 1.531-1.414-.746a.622.622 0 0 0-.314-.078.576.576 0 0 0-.314.078l-1.374.726.275-1.57a.703.703 0 0 0-.196-.608l-1.12-1.08 1.571-.235a.715.715 0 0 0 .51-.373l.688-1.394.706 1.433c.098.196.295.353.51.373l1.532.216zm1.766-2.081-1.825-.255-.844-1.688a.807.807 0 0 0-.726-.452.807.807 0 0 0-.727.452l-.804 1.649-1.865.274a.808.808 0 0 0-.648.55.8.8 0 0 0 .196.824l1.335 1.296-.314 1.865a.811.811 0 0 0 .314.785.82.82 0 0 0 .844.059l1.63-.864 1.668.883a.88.88 0 0 0 .373.098.846.846 0 0 0 .47-.157.76.76 0 0 0 .315-.785l-.314-1.825 1.354-1.315a.8.8 0 0 0 .196-.825.73.73 0 0 0-.628-.569z"></path></svg>
          </div>
          <div class="media-body">
            <h5 class="mt-0 color-red">Submit Review</h5>
            <p>Give an amazing review of your institution detailed with facts & help others in deciding the right college. Remember You’re a part of critical decision making.</p>
          </div>
        </div>
        <div class="media mb-3">
          <div class="icon mr-3">
            <svg class="w-80p" id="icon-rewards-trophy" viewBox="0 0 34 34"><path fill="#fff4f2" d="M0 17C0 7.611 7.611 0 17 0s17 7.611 17 17-7.611 17-17 17S0 26.389 0 17z"></path><path fill="#f5654d" d="M24.454 16.415h-1.876v-4.472h1.876zm-2.905.257c0 2.519-2.03 4.55-4.549 4.55a4.541 4.541 0 0 1-4.55-4.55v-7.3h9.1zm-10.127-.257H9.546v-4.472h1.876zm11.156-5.5v-2.57H11.422v2.57H8.518v6.528h2.956a5.595 5.595 0 0 0 4.935 4.807v4.678h-2.134v1.028h5.372v-1.028h-2.21V22.25c2.622-.206 4.755-2.237 5.09-4.807h2.955v-6.528z"></path></svg>
          </div>
          <div class="media-body">
            <h5 class="mt-0 color-orange">Claim Reward</h5>
            <p>Every published review will be rewarded between Rs 20-200 (For India) / 2-5 USD (For Abroad) within 14 days. Write something extraordinary.</p>
          </div>
        </div>
        <div class="media mb-3">
          <div class="icon mr-3">
            <svg class="w-80p" id="icon-rewards-gift" viewBox="0 0 34 34"><path fill="#e8f9ff" d="M0 17C0 7.611 7.611 0 17 0s17 7.611 17 17-7.611 17-17 17S0 26.389 0 17z"></path><path fill="#49b6e0" d="M16.577 10.653v1.692h-1.693a1.674 1.674 0 0 1-1.692-1.692c0-.95.743-1.693 1.692-1.693.95 0 1.693.743 1.693 1.693zm4.655-.212a1.884 1.884 0 0 1-1.905 1.904h-1.904v-1.904c0-1.068.837-1.904 1.904-1.904 1.068 0 1.905.836 1.905 1.904zm-12.695 2.75h8.04v2.963h-8.04zm8.886 0h8.04v2.963h-8.04zM9.806 17h6.77v8.463h-6.77zm7.617 0h6.77v8.463h-6.77zm7.194 9.31c.213 0 .423-.21.423-.424V17h.846c.214 0 .423-.21.423-.423v-3.809a.452.452 0 0 0-.423-.423h-4.539l.234-.333a2.726 2.726 0 0 0 .497-1.571 2.754 2.754 0 0 0-2.75-2.75c-.907 0-1.757.45-2.272 1.203l-.149.217-.18-.19a2.55 2.55 0 0 0-1.843-.807 2.542 2.542 0 0 0-2.539 2.539c0 .485.14.958.403 1.366l.21.326H8.114a.452.452 0 0 0-.423.423v3.809c0 .213.21.423.423.423h.846v8.886c0 .214.21.423.423.423z"></path></svg>
          </div>
          <div class="media-body">
            <h5 class="mt-0 color-blue">Refer & Earn</h5>
            <p>Ask your friends to write a review and for every approved and published review you will get Rs. 10 - 100 (For India) / 1-2 USD (For Abroad). Get your referral code from your collegedunia account.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<br>
<section class="commonSec bg-white">
  <div class="wrapper">
    <div class="section-title">
      <h3>Rules and Guidelines</h3>
    </div>
    <div class="row">
      <div class="col-md-6">
         
        <div class="card featureReviewCard">
            <div class="card-body d-flex">
                <div class="cardContent">
                    <i class="fas fa-check-circle color-orange"></i> Add maximum details to your answer
                </div>
            </div>
        </div>
        <br>
        <div class="card featureReviewCard">
            <div class="card-body d-flex">
                <div class="cardContent">
                     <i class="fas fa-check-circle color-orange"></i> Add maximum details to your answer
                </div>
            </div>
        </div>
        <br>
        <div class="card featureReviewCard">
            <div class="card-body d-flex">
                <div class="cardContent">
                    <i class="fas fa-check-circle color-orange"></i> Add maximum details to your answer
                </div>
            </div>
        </div>
        <br>
        <div class="card featureReviewCard">
            <div class="card-body d-flex">
                <div class="cardContent">
                    <i class="fas fa-check-circle color-orange"></i> Add maximum details to your answer
                </div>
            </div>
        </div>
        <br>
        <div class="card featureReviewCard">
            <div class="card-body d-flex">
                <div class="cardContent">
                    <i class="fas fa-check-circle color-orange"></i> Add maximum details to your answer
                </div>
            </div>
        </div>
       
      </div>
      <div class="col-md-6">
        <!--<img src="<?php echo base_url('assets/img/d-review-prize-section.png');?>" class="img-fluid">-->
        <img src="<?php echo base_url('public/data/app/app_data/img3.jpg');?>" class="img-fluid"/>
      </div>
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
<section class="commonSec bg-white">
  <div class="wrapper">
    <div class="section-title">
      <h3>Prizes & Rewards</h3>
    </div>
    <div class="text-left">
       <h5>For every referral you get ₹10 (For India) / 1-2 USD (For Abroad)</h5>
       <p><b>Condition</b>- The rewards shall only be released for approved reviews. A review with detailed facts and personal experience shall be approved.

        Time Line- The release of reward may take between 3-15 working days depending upon volume of the reviews being submitted in a given period.</p>
    </div>
  </div>
</section>

<?php $this->widget->run('front_subscription_section',TRUE);?>
<style>
    .pb-6, .py-6 {
    padding-bottom: 1.5rem;
}
.pt-6, .py-6 {
    padding-top: 1.5rem;
}
.pl-4, .px-4 {
    padding-left: 1rem;
}
.pr-4, .px-4 {
    padding-right: 1rem;
}
.flex-wrap {
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.mb-6, .my-6 {
    margin-bottom: 1.5rem;
}
</style>
<div class="modal reviewCollegeSearckModal" id="reviewCollegeSearckModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered  modal-xl">
    <div class="modal-content">
      <div class="d-flex p-4 align-items-center">
        <div class="col-8 px-0 ">
          <div class="srchWrapper d-flex py-2 px-4 border align-items-center rounded">
            <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451 451" style="fill: rgb(51, 51, 51);"><path d="M447.05 428l-109.6-109.6c29.4-33.8 47.2-77.9 47.2-126.1C384.65 86.2 298.35 0 192.35 0 86.25 0 .05 86.3.05 192.3s86.3 192.3 192.3 192.3c48.2 0 92.3-17.8 126.1-47.2L428.05 447c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4c5.2-5.2 5.2-13.8 0-19zM26.95 192.3c0-91.2 74.2-165.3 165.3-165.3 91.2 0 165.3 74.2 165.3 165.3s-74.1 165.4-165.3 165.4c-91.1 0-165.3-74.2-165.3-165.4z"></path></svg></span>
            <input placeholder="Select College" class="jsx-1879175554 col px-0 pl-1 py-1 border-0" id="search_review_college" value="">
          </div>
        </div>
        <div class="col-4">
          <!-- <div class="text-primary d-flex align-items-center justify-content-end font-weight-semi">
            <span class="pointer text-lg">Can't Find my Institute, Enter Manually</span>
            <span class="icon pointer find-arrow icon-primary ml-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485 485"><path d="M413.974 71.026C368.171 25.225 307.274 0 242.5 0S116.829 25.225 71.026 71.026C25.225 116.829 0 177.726 0 242.5s25.225 125.671 71.026 171.474C116.829 459.775 177.726 485 242.5 485s125.671-25.225 171.474-71.026C459.775 368.171 485 307.274 485 242.5s-25.225-125.671-71.026-171.474zM242.5 455C125.327 455 30 359.673 30 242.5S125.327 30 242.5 30 455 125.327 455 242.5 359.673 455 242.5 455z"></path><path d="M193.228 135.589L299.791 242.5 193.228 349.411l21.248 21.178L342.148 242.5 214.476 114.411z"></path></svg>
            </span>
          </div> -->
        </div>
      </div>
      <hr class="jsx-1879175554 card-divider m-0">
      <div class="jsx-1879175554 bg-gray-light position-relative text-center text-lg font-weight-bold p-4 d-flex justify-content-center ">
        <div class="jsx-1879175554 position-absolute prev-step"></div>
        <div class="jsx-1879175554"><span class="jsx-1879175554 pr-1 text-17 pointer-none text-primary pointer">Select Your College / Institute</span><span class="jsx-1879175554 pr-1 text-primary"> &gt;</span><span class="jsx-1879175554 text-17  pointer-none text-empty"> Select Course </span>
        </div>
      </div>
      <hr class="jsx-1879175554 card-divider m-0">
      <div class="jsx-1879175554 d-flex px-4 py-6 flex-wrap" style="overflow-y: auto;" id="suggestList">
        <?php
        if(!empty($data_searched)){
          foreach ($data_searched as $key => $value) {
            ?>
            <div class="col-6 d-flex text-lg hover-primary mb-6 pointer">
              <span class="jsx-1879175554 icon-md icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill="#ff7900" d="M0 11C0 4.925 4.925 0 11 0s11 4.925 11 11-4.925 11-11 11S0 17.075 0 11z"></path><path fill="#fff" d="M9.35 15.007a.822.822 0 01-.584-.241L6.242 12.24a.823.823 0 111.165-1.165l1.942 1.942 4.776-4.776a.826.826 0 011.166 1.166l-5.36 5.36a.825.825 0 01-.582.24z"></path></svg>
              </span>
              <span class="jsx-1879175554 pl-3"><a href="<?php echo $value['inst_review_link'];?>"><?php echo $value['inst_name'];?></a></span>
            </div>
            <?php
          }
        }
        ?>
      </div>
    </div>
    
    
    
  </div>
</div>

<div class="modal enterCollegeCourse" id="enterCollegeCourse" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered  modal-xl">
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


<script type="text/javascript">
  var html_r_col=<?php echo json_encode($data_searched);?>;
  var wbpage='';
  var page='';
</script>


<style type="text/css">

textarea:focus, input:focus{
    outline: none;
}

  .h-350p {
    height: 350px;
}

[class*="col-"].pl-1, input.pl-1, [class*="col-"].px-1, input.px-1 {
    padding-left: 0.25
rem
;
}
[class*="col-"].pb-1, input.pb-1, [class*="col-"].py-1, input.py-1 {
    padding-bottom: 0.25
rem
;
}
[class*="col-"].pt-1, input.pt-1, [class*="col-"].py-1, input.py-1 {
    padding-top: 0.25
rem
;
}
[class*="col-"].pl-0, input.pl-0, [class*="col-"].px-0, input.px-0 {
    padding-left: 0;
}
[class*="col-"].pr-0, input.pr-0, [class*="col-"].px-0, input.px-0 {
    padding-right: 0;
}

.bg-gray-light.jsx-1879175554 {
    background-color: rgb(252, 252, 252) !important;
}
.bg-gray-light {
    background-color: #e9e9e9;
}
.font-weight-bold, h1.font-weight-bold, h2.font-weight-bold, h3.font-weight-bold, h4.font-weight-bold, h5.font-weight-bold, h6.font-weight-bold, .h1.font-weight-bold, .h2.font-weight-bold, .h3.font-weight-bold, .h4.font-weight-bold, .h5.font-weight-bold, .h6.font-weight-bold {
    font-weight: 700;
}
.text-center {
    text-align: center;
}
.p-4 {
    padding: 1rem;
}
.position-relative {
    position: relative;
}
.justify-content-center {
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
}

.srchWrapper.jsx-1879175554 {
    transition: all 0.3s ease 0s;
}
.icon {
    display: inline-block;
    line-height: initial;
    height: 15px;
    width: 15px;
}

.pl-1, .px-1 {
    padding-left: 0.25rem;
}
.pb-1, .py-1 {
    padding-bottom: 0.25rem;
}
.pt-1, .py-1 {
    padding-top: 0.25rem;
}
.pl-0, .px-0 {
    padding-left: 0;
}
.pr-0, .px-0 {
    padding-right: 0;
}
.border-0 {
    border: 0;
}
.col {
    -webkit-flex-basis: 0;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%;
}
.pb-6, .py-6 {
    padding-bottom: 1.5rem;
}
.pt-6, .py-6 {
    padding-top: 1.5rem;
}
.pl-4, .px-4 {
    padding-left: 1rem;
}
.pr-4, .px-4 {
    padding-right: 1rem;
}
.flex-wrap {
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.d-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}

.text-lg {
    font-size: 1rem;
}

.icon-md.jsx-1879175554 {
    min-width: 24px;
    min-height: 24px;
}
.icon {
    display: inline-block;
    line-height: initial;
    height: 15px;
    width: 15px;
}
.pl-3, .px-3 {
    padding-left: 0.75rem;
}
</style>

<style>
  .media-body{
        padding-left:50px;
    }
</style>

<script type="text/javascript">var review_course_populate=false;var page='review_write';var _vtype='';</script>