<section class="bradcumSec bg-white py-2">
   <div class="wrapper">
        <div class="row">
            <div class="col-md-10">
                <nav aria-label="breadcrumb" >
                    <ol class="breadcrumb bg-white m-0 pl-0">
                      <?php
                      foreach ($exams_data['breadcumb'] as $key => $value) {
                        ?>
                        <li class="breadcrumb-item <?php echo (empty($value))?'active':'';?>">
                          <?php
                          if(!empty($value)){
                            ?>
                            <a href="<?php echo $value;?>"><?php echo $key;?></a>
                            <?php
                          }else{
                            echo $key;
                          }
                          ?>
                        </li>
                        <?php
                      }
                      ?>
                    </ol>
                </nav>
            </div>
            <div class="col-md-12">
                <div class="media">
                    <img src="<?php echo $exams_data['exam_logo'];?>" class="mr-3 h-60p" alt="<?php echo $exams_data['exam_name'];?>">
                    <div class="media-body">
                        <div class="row">

                            <div class="col-sm-12">
                                <h5 class="mt-0"><?php echo $exams_data['exam_heading'];?></h5>
                            </div>
                            <!-- <div class="col-sm-4">
                                <div class="border p-2 d-inline float-sm-right ">
                                    <i class="far fa-clock"></i> 
                                    <span>Results: 07 Mar `21 </span>| <a href="#" class="color2"> See all dates</a>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php
if(!empty($exam_menu)){
  ?>
    <section class="tabSliderSec border-top">
      <div class="weapper">
        <div class="swiper-container tabSlider navTabSlider">
          <div class="swiper-wrapper">
           
            <?php
            foreach ($exam_menu as $key => $value) {
              if(!empty($value['child_menu'])){
                ?>
                <div class="nav-item dropdown" style="z-index: 1000;position: relative;">
                  <button class="nav-link dropdown-toggle swiper-slide" type="button" data-toggle="dropdown" style="border:none;"><?php echo $value['menu_name'];?>
                  <span class="caret"></span></button>
                  <ul class="dropdown-menu" style="border-top:none;margin-top: 0px;">
                    <?php
                    foreach ($value['child_menu'] as $k => $v){
                      ?>
                      <li style="margin-top: 0px;"><a href="<?php echo $v['menu_link'];?>"><?php echo $v['menu_name'];?></a></li>
                      <?php
                    }
                    ?>
                  </ul>
                </div>
                <?php                
              }else{
                ?>
                <a href="<?php echo $v['menu_link'];?>" class="swiper-slide navLink active"> <?php echo $value['menu_name'];?> </a>
                <?php
              }
            }
            ?>
          </div>
          <div class="swiper-button-next swiper-button-white"></div>
          <div class="swiper-button-prev swiper-button-white"></div>
        </div>
      </div>
    </section>
  <?php
}

?>



<section class="pageDetailsSec py-4">
  <div class="wrapper">
    <div class="row">
      <!-- <div class="col-lg-2 d-none d-lg-block">
          <div class="card numberingListCard ">
              <div class="list-group list-group-flush  ">
                  <a href="" class="list-group-item list-group-item-action active"><span class="number">01</span> <span> JEE Main 2021 Exam Dates</span></a>
                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
                  <a href="" class="list-group-item list-group-item-action"> <span class="number">02</span><span> JEE Main 2021 Exam Dates</span></a>
                 
              </div>
          </div>
      </div> -->  
      <div class="col-lg-9 mb-4 mb-lg-0">
        <div class="adBlock" style="margin-top: 5px; margin-bottom:5px;">      
        <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
              crossorigin="anonymous"></script>
          <!-- wayto_hz_1_ads -->
          <ins class="adsbygoogle"
              style="display:inline-block;width:728px;height:90px"
              data-ad-client="ca-pub-9545373166119354"
              data-ad-slot="7117741101" style="clear: both; display: flex;justify-content: center;margin-left:50px;margin-right:50px;"></ins>
          <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      </div>
      <?php $this->widget->run('front_exam_details_data',TRUE);?>
        <div class="card infoCard mb-4">
          <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
            <div class="media">
              <!-- <a href="#" class="mr-3 "><img class="img-circle" src="assets/img/avatar.jpg" width="60" alt=""></a> -->
              <div class="media-body">
                <h5 class="mt-0 text-dark"><a href="#"> -  </a> </h5>
                <p class="m-0">Content Curator 
                  <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
                  <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
                  <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
                </p>
              </div>
            </div>
            <div class="updateDate">Updated On - December 7th, 2020</div>
          </div>
          <div class="card-body readall">
            <p>IIM Bangalore has come up as one of the best B-School in Central Asia by Eduniversal Ranking 2020. The B-School award was announced in the annual Eduniversal 3D World Convention 2020.</p>

            <p>Indian Institute of Management - [IIMB] Recent Admission Alerts and Updates</p>
            <ul>
              <li>6 November, 2020: IIM Bangalore commences PhD Admission 2021.  Apply till January 18, 2021 Know more</li>
              <li>25 August, 2020: IIMB PGPEM Admission deadline is January 18 Know more</li>
            </ul>
            <p>IIM Bangalore has announced the admission criteria for MBA 2021-2023 Batch. The Admission Criteria for MBA will be the same as the previous year. </p>
            IIM Bangalore has come up as one of the best B-School in Central Asia by Eduniversal Ranking 2020. The B-School award was announced in the annual Eduniversal 3D World Convention 2020.</p>

            <p>Indian Institute of Management - [IIMB] Recent Admission Alerts and Updates</p>
            <ul>
              <li>6 November, 2020: IIM Bangalore commences PhD Admission 2021.  Apply till January 18, 2021 Know more</li>
              <li>25 August, 2020: IIMB PGPEM Admission deadline is January 18 Know more</li>
            </ul>
            <p>IIM Bangalore has announced the admission criteria for MBA 2021-2023 Batch. The 
            <div class="table-responsive">
              <table class="table table-striped table-bordered table-sm">
                 <thead>
                    <tr>
                       <th>EVENT</th>
                       <th>DATE</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                       <td>CAT Registration</td>
                       <td>05 Aug - 23 Sep, 2020</td>
                    </tr>
                    <tr>
                       <td>Shortlist Announcement for PI-WAT (Tentatives)</td>
                       <td>10 Jan, 2021</td>
                    </tr>
                 </tbody>
              </table>
           </div>
           <p>Indian Institute of Management Bangalore (IIMB), established in 1973, is a top-ranked institute among all the IIMs in India. It offers management courses at PG and Doctoral level. NIRF 2020 ranked the institute at the number 2 position after IIM Ahmedabad. PGP is it's most sought after program globally. The Average placement package of the 2019 batch went as high as INR 25 Lacs per annum.</p> 

          <p>Some of the notable alumni of IIM Bangalore are – K. Radhakrishnan (Ex-ISRO Chairman), Ravi Subramanium (Popular Author), Shehla Rashid (Indian Politician), Vega Tamotia (Indian Actress) and many more.</p>

          <div id="accordionExample1" class="accordion">
            <div class="card br-0">
              <a href="#" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" class="card-header d-block position-relative text-dark text-uppercase collapsible-link ">Collapsible Group Item #1</a>
              <div id="collapseOne" data-parent="#accordionExample1" class="collapse show">
                <div class="card-body">
                  <p class="font-weight-light m-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.</p>
                </div>
              </div>
            </div>
            <div class="card br-0">
              <a href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" class="card-header d-block position-relative collapsed text-dark text-uppercase collapsible-link py-2">Collapsible Group Item #2</a>
              <div id="collapseTwo" data-parent="#accordionExample1" class="collapse">
                <div class="card-body">
                  <p class="font-weight-light m-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.</p>
                </div>
              </div>
            </div>
            <div class="card br-0">
              <a href="#" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" class="card-header d-block position-relative collapsed text-dark text-uppercase collapsible-link py-2">Collapsible Group Item #3</a>
              <div id="collapseThree"  data-parent="#accordionExample1" class="collapse">
                <div class="card-body">
                  <p class="font-weight-light m-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.</p>
                </div>
              </div>
            </div>
          </div>

          </div>
        </div>

        <div class="card infoCard mb-4">
          <div class="card-header bg-white">
            <h5 class="m-0 color2"> INDIAN INSTITUTE OF MANAGEMENT - [IIMB], BANGALORE FEES & ELIGIBILITY</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered table-sm">
                 <thead>
                    <tr>
                       <th class="bg-indigo text-wite">Course</th>
                       <th class="bg-blue text-wite">Fees</th>
                       <th class="bg-teal text-wite">Eligibility</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                       <td><a href="https://collegedunia.com/university/25602-indian-institute-of-management-iimb-bangalore/courses-fees?slug=post-graduate-program-in-management-pgpm&amp;course_type=Full-Time">PGPM</a></td>
                       <td>₹23.15 Lakhs (Total Fees)</td>
                       <td>Graduation + CAT/GMAT</td>
                    </tr>
                    <tr>
                       <td><a href="https://collegedunia.com/university/25602-indian-institute-of-management-iimb-bangalore/courses-fees?course_id=6648">PGP-PPM</a></td>
                       <td>₹19 Lakhs (Total Fees)</td>
                       <td>Pass in Graduation + CAT</td>
                    </tr>
                    <tr>
                       <td><a href="https://collegedunia.com/university/25602-indian-institute-of-management-iimb-bangalore/courses-fees?course_id=9750">PGPBA</a></td>
                       <td>₹21.15 Lakhs (Total Fees)</td>
                       <td>Pass in Graduation + CAT</td>
                    </tr>
                    <tr>
                       <td><a href="https://collegedunia.com/university/25602-indian-institute-of-management-iimb-bangalore/courses-fees?slug=executive-post-graduate-program&amp;course_type=Full-Time">Executive</a></td>
                       <td>₹27.5 Lakhs (Total Fees)</td>
                       <td>Graduation</td>
                    </tr>
                 </tbody>
              </table>
           </div>
          </div>
        </div>

        <div class="card infoCard mb-4">
          <div class="card-header ">
            <form>
              <div class="input-group input-group-lg mb-3">
                <input type="text" class="form-control" placeholder="Search">
                <button class="btn btn-outline-secondary" type="submit" ><i class="fas fa-search"></i></button>
              </div>
            </form>
            <p class="d-flex flex-wrap align-items-center badgeRow">
              <span class="mr-2">Select Degree : </span>  
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
            </p>
            <p class="d-flex flex-wrap align-items-center badgeRow">
              <span class="mr-2">Select Stream : </span>  
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
              <a href="#" class="py-1 px-2 mr-2 badge bg-light text-dark">Light</a>
            </p>

            <h5 class=" color2"> INDIAN INSTITUTE OF MANAGEMENT - [IIMB] TOP COURSES, FEES & ELIGIBILITY  </h5>
            <ul class="nav nav-tabs card-header-tabs tempTab">
              <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#tab1_1">All</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#tab1_2">Part Time</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#tab1_3">Full Time</a>
              </li>
            </ul>

          </div>
          <div class="card-body">
            <div class="tab-content">
              <div class="tab-pane fade show active" id="tab1_1">
                <div class="row">
                  <div class="col-md-9">
                    <h5 class="mb-2"><a href="#" class="text-dark">Post Graduate Programme in Business Analytics</a></h5>
                    <div class="d-flex flex-wrap">
                     <span class="mr-2 badge color-blue"><i class="far fa-bookmark"></i> 2 Years </span>
                     <span class="mr-2 badge color-purple"><i class="far fa-bookmark"></i> Degree </span>
                     <span class="mr-2  badge color-green"><i class="far fa-bookmark"></i> Full Time </span>
                     <span class="mr-2 badge color-indigo"><i class="far fa-bookmark"></i> On Campus </span>
                     <span class="mr-2 badge color-teal"><i class="far fa-bookmark"></i> Post Graduation </span>
                    </div>
                  </div>
                  <div class="col-md-3 d-flex justify-content-end">
                    <div class=" text-md-right">
                      <h4 class="color2 mb-2 "> ₹ 2,115,000 <small class="text-muted">Fees</small> </h4>
                      <a href="#" class="color-indigo">Check details</a>
                    </div>
                  </div>
                </div>
                <div class="color2 mb-2">
                  9.4/10 <span class="stars color-orange"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></span> Based on 11 Reviews 
                </div>
                <ul class="pl-3">
                  <li>Dates : Application Starts 05 Aug 2020 | Application Ends 10 Jan 2021 Check All Dates</li>
                    <li>Ranking: #2 Management - NIRF</li>
                    <li>Exams Accepted: <span class="color2"> CAT | GMAT | GRE </span></li>
                </ul>
                <p>Admission Guide 2020 <a class="color-teal" href=""><i class="fas fa-download"></i> Download Brochure </a></p>
              </div>
            </div>
            
          </div>
        </div>

        <div class="card imageCard mb-4">
          <div class="card-header bg-white">
            <h5 class="m-0 color2"> IMAGES</h5>
          </div>
          <div class="card-body">
            <h6>EVENTS</h6>
            <div class="row form-row">
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="assets/img/course1.jpg" data-fancybox="events" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="assets/img/course1.jpg" data-fancybox="events" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="assets/img/course1.jpg" data-fancybox="events" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="assets/img/course1.jpg" data-fancybox="events" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
            </div>
            <h6>CAMPUS</h6>
            <div class="row form-row">
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="assets/img/course1.jpg" data-fancybox="campus" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="assets/img/course1.jpg" data-fancybox="campus" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="assets/img/course1.jpg" data-fancybox="campus" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="assets/img/course1.jpg" data-fancybox="campus" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
            </div>
          </div>
          
        </div>

        <div class="card imageCard mb-3">
          <div class="card-header bg-white border-top">
            <h5 class="m-0 color2"> VIDEOS</h5>
          </div>
          <div class="card-body">
            <div class="row form-row">
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk" data-fancybox="video" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk" data-fancybox="video" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk" data-fancybox="video" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk" data-fancybox="video" class="imgBox h-150"><img class="img-thumbnail" src="assets/img/course1.jpg"></a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="col-lg-3 ">
        <a href="" class="btn btn-primary mb-3 btn-block  d-flex justify-content-between align-items-center "><span>APPLY NOW </span> <i class="far fa-envelope"></i></a>
        <a href="" class="btn btn-warning  mb-3 btn-block d-flex justify-content-between "> <span>DOWNLOAD BROCHURE </span> <i class="fas fa-download"></i></a>
        

        <div class="card notificationCard mb-4">
          <div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
            <h5 class="m-0">Notification</h5>
            <i class="fas fa-bell"></i>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-1.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-2.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-3.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
          </ul>
          <div class="card-header bg-white text-center">
            <a class="#">View All News</a>
          </div>
        </div>

        <div class="card interestCard mb-4">
          <div class="card-body ">
            <div class="icon text-center mb-3">
              <svg width="144" height="47" viewBox="0 0 144 47" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M72.5 4.3h4.3V1.5h-6.55v3.55h1.5a.75.75 0 01.75-.75z" fill="#FFCC75"></path><path fill="#F2EBD9" d="M70.25 33.167h5.25V42.5h-5.25zM63.5 33.167h5.25V42.5H63.5z"></path><path fill="#FFF" d="M63.5 44h12v1.5h-12zM57 43.25V29.5h-9.5v16h10.25V44a.75.75 0 01-.75-.75zm-5.833-7.833a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3zm3.666 0a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3zM91.5 45.5v-16H82v13.75a.75.75 0 01-.75.75v1.5H91.5zm-3.667-13.083a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm-3.666 0a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3z"></path><path d="M81.25 44a.75.75 0 01-.75-.75V19.4h-5.25a.75.75 0 01-.75-.75H73a.75.75 0 01-.75.75H58.5v23.85a.75.75 0 01-.75.75v1.5H62V32.417a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75V45.5h4.25V44zM69.5 29.167a3.637 3.637 0 01-3.633-3.634A3.638 3.638 0 0169.5 21.9a3.637 3.637 0 013.633 3.633 3.638 3.638 0 01-3.633 3.634z" fill="#FFF"></path><path d="M69.5 23.4a2.136 2.136 0 00-2.133 2.133c0 1.177.957 2.134 2.133 2.134a2.136 2.136 0 002.133-2.134A2.136 2.136 0 0069.5 23.4z" fill="#98D9D5"></path><path fill="#F2EBD9" d="M47.5 25.5H57V28h-9.5zM82 25.5h9.5V28H82z"></path><path d="M74.5 18.65a.75.75 0 01.75-.75h3.844L69.5 10.307 59.906 17.9H72.25a.75.75 0 01.75.75h1.5z" fill="#FF6E1D"></path><path d="M92.25 24H82v-5.35a.738.738 0 00-.005-.082c0-.007-.002-.013-.003-.02a.759.759 0 00-.01-.06l-.006-.023a.756.756 0 00-.016-.055l-.008-.023a.76.76 0 00-.06-.122l-.013-.022a.762.762 0 00-.033-.047l-.013-.018a.754.754 0 00-.053-.059l-.006-.005a.715.715 0 00-.054-.048l-.005-.004L70.25 8.987V1.5h6.55v2.8h-4.3a.75.75 0 000 1.5h5.05a.75.75 0 00.75-.75V.75a.75.75 0 00-.75-.75H69.5a.75.75 0 00-.75.75v8.237l-11.466 9.075-.004.004a.762.762 0 00-.054.048l-.006.005a.754.754 0 00-.053.059l-.013.018a.762.762 0 00-.033.047l-.014.022a.772.772 0 00-.059.122l-.008.023a.729.729 0 00-.016.055l-.006.023a.751.751 0 00-.01.06c-.001.007-.003.013-.003.02a.763.763 0 00-.005.082V24H46.75a.75.75 0 00-.75.75v21.5c0 .414.336.75.75.75h45.5a.75.75 0 00.75-.75v-21.5a.75.75 0 00-.75-.75zM63.5 45.5V44h12v1.5h-12zm12-12.333V42.5h-5.25v-9.333h5.25zM68.75 42.5H63.5v-9.333h5.25V42.5zM77 32.417a.75.75 0 00-.75-.75h-13.5a.75.75 0 00-.75.75V45.5H47.5v-16H57v13.75a.75.75 0 001.5 0V19.4h13.75a.75.75 0 000-1.5H59.906l9.594-7.593 9.594 7.593H75.25a.75.75 0 000 1.5h5.25v23.85a.75.75 0 001.5 0V29.5h9.5v16H77V32.417zM91.5 28H82v-2.5h9.5V28zM57 28h-9.5v-2.5H57V28z" fill="#082947"></path><path d="M50.417 31.667a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zM54.083 31.667a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zM88.583 36.167a.75.75 0 00.75-.75v-3a.75.75 0 00-1.5 0v3c0 .414.336.75.75.75zM84.917 36.167a.75.75 0 00.75-.75v-3a.75.75 0 00-1.5 0v3c0 .414.335.75.75.75zM69.5 21.9a3.637 3.637 0 00-3.633 3.633 3.637 3.637 0 003.633 3.634 3.637 3.637 0 003.633-3.634A3.637 3.637 0 0069.5 21.9zm0 5.767a2.136 2.136 0 01-2.133-2.134c0-1.176.957-2.133 2.133-2.133 1.176 0 2.133.957 2.133 2.133a2.136 2.136 0 01-2.133 2.134z" fill="#082947"></path><g fill="#F7F7F7"><path d="M35.798 28.418c2.108-5.69 2.345-9.798 1.928-12.542-.487-3.207-3.458-5.645-6.576-5.086-3.664.657-3.755 4.689-3.755 4.689s-3.711-1.573-5.802 1.507c-1.779 2.62-.76 6.327 1.972 8.076 2.337 1.497 6.177 2.968 12.233 3.356z"></path></g><g fill="#F5F5F5"><path d="M5.053 37.714c4.014-1.76 6.267-3.697 7.484-5.29 1.421-1.863 1.197-4.63-.657-5.969-2.18-1.573-4.32.402-4.32.402S6.515 24.14 3.866 24.6c-2.254.39-3.668 2.78-3.207 5.076.395 1.966 1.557 4.698 4.394 8.04z"></path></g><g fill="#F5F5F5"><path d="M130.563 29.139c-3.064-5.239-4.01-9.242-4.077-12.018-.077-3.242 2.426-6.16 5.593-6.15 3.723.011 4.513 3.966 4.513 3.966s3.381-2.194 5.975.477c2.207 2.272 1.847 6.098-.54 8.296-2.041 1.88-5.567 3.995-11.464 5.429z"></path></g><g fill="#F0F0F0"><path d="M109.178 37.873c-3.374-2.799-5.005-5.282-5.735-7.15-.854-2.181.124-4.779 2.276-5.555 2.53-.912 4.042 1.577 4.042 1.577s1.753-2.324 4.173-1.152c2.06.996 2.76 3.682 1.683 5.763-.921 1.78-2.791 4.086-6.44 6.517z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M98.277 14.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092s1.214-1.609 2.889-.798c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M27.277 44.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092s1.214-1.609 2.889-.798c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g><g opacity="0.632" fill="#F0F0F0"><path d="M50.277 13.912c-2.336-1.938-3.465-3.657-3.97-4.95-.591-1.51.086-3.308 1.575-3.846 1.751-.631 2.799 1.092 2.799 1.092S51.895 4.6 53.57 5.41c1.425.69 1.91 2.55 1.165 3.99-.638 1.233-1.933 2.83-4.458 4.512z"></path></g></g></svg>
            </div>
            <h6 class="mb-3 text-center">INTERESTED IN THIS COLLEGE ?</h6>
            <a href="#" class="btn btn-warning  btn-block d-flex justify-content-between align-items-center"> <span>ASK QUESTION </span> <i class="fas fa-question"></i></a>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header bg-white">
            <h5 class="m-0">Featured News</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-1.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-2.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-3.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
          </ul>
          <div class="card-header bg-white text-center">
            <a class="#">View All News</a>
          </div>
        </div>


        <div class="card mb-4">
          <div class="card-header bg-white">
            <h5 class="m-0">Featured News</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-1.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-2.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
            <li class="list-group-item">
              <a href="#" class="media">
                <img src="assets/img/img-3.jpg" width="40" class="mr-2" alt="..."> 
                <div class="media-body">
                  <h6 class="mb-0 color2">Media heading</h6>
                  <small> sit amet nibh libero, in gravida nulla. </small> 
                </div>
              </a>
            </li>
          </ul>
          <div class="card-header bg-white text-center">
            <a class="#">View All News</a>
          </div>
        </div>
      </div>
    </div>
  </div> 
</section>
<section class="pageDetailsSec py-4">
  <div class="wrapper">
    <div class="row">
        <div class="col-lg-12">
            <?php $this->widget->run('front_exam_fees_mock_section',TRUE);?>
        </div>
        
    </div>
  </div>
 </section>

 <section class="pageDetailsSec py-4">
  <div class="wrapper">
    <div class="row">
        <div class="col-lg-12">
            <div class="jsx-222626221 section_wrapper my-4 pb-5">
                <div class="jsx-222626221 article_heading">
                    <h2 class="jsx-222626221 font-weight-normal">
                        <b class="jsx-222626221">Sample/Mock</b> Papers</h2>
                    </div><div class="jsx-222626221 row"><div class="jsx-222626221 col-md-3 col-sm-6"><a href="https://images.static-collegedunia.com/public/college_data/images/entrance/sample_paper/1604919726XAT_2019.pdf" target="_blank" class="jsx-222626221 text-md"><div class="jsx-222626221 download_sample"><span class="jsx-222626221 month">2021</span><h3 class="jsx-222626221 text-base py-2">XAT Paper.pdf</h3><span class="jsx-222626221 text-md">Download here<span class="jsx-222626221 icon mock_paper_download_button"><svg id="new_download_as_pdf_svg__Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 49.2 45.5" xml:space="preserve" fill="#fff"><style></style><path d="M39.3 29.4c-1.1-1.9-5.8-3.2-9.9-3.4-.4-.4-.8-.8-1.1-1.3-3.6-4.1-5-10-5.5-13.1-.1-.7-.1-1.2-.2-1.6 0-.3-.1-1-.9-1-.2 0-.4.1-.6.3-.3.3-.2.6-.2 1s.1 1 .2 1.6c.3 3.2.4 9.2-2 14.1-.3.5-.5 1-.8 1.4-4.6 1.3-8.3 3.7-8.8 5.7-.2.7 0 1.4.5 1.9.6.6 1.3.9 2.1.9 2.2 0 4.6-2.4 7.3-7.2 1.2-.3 2.4-.5 3.6-.7.4 0 1.2-.1 1.6-.2 1.2-.2 2.6-.3 4.1-.2 3.3 3.5 6 5.2 8.1 5.2 1.1 0 2-.5 2.5-1.5.4-.6.4-1.3 0-1.9zm-27.2 4.8c-.3 0-.6-.1-.9-.4-.1-.1-.1-.2-.1-.4.3-1 2.6-2.8 6.1-4-2 3.1-3.8 4.8-5.1 4.8zm12.3-8c-.4.1-1.1.2-1.5.2-.8.1-1.6.2-2.4.4 0-.1.1-.1.1-.2 1.2-2.4 1.9-5.2 2.2-8.4 1.1 3.1 2.5 5.6 4.3 7.6l.2.2c-1.1 0-2 .1-2.9.2zm13.5 4.3c-.3.5-.6.7-1.2.7-1.3 0-3.2-1.2-5.6-3.4 3.6.5 6.3 1.6 6.8 2.4.1.1.1.2 0 .3zm0 0"></path></svg></span></span></div></a></div></div></div>
            <hr class="jsx-3025402055 jsx-1091906639">
        </div>
        
    </div>
  </div>
 </section>
 


<div class="adBlock">
  <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
        crossorigin="anonymous"></script>
    <!-- wayto_hz_1_ads -->
    <ins class="adsbygoogle"
        style="display:inline-block;width:728px;height:90px"
        data-ad-client="ca-pub-9545373166119354"
        data-ad-slot="7117741101" style="clear: both; display: flex;justify-content: center;margin-left:50px;margin-right:50px;"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </div>
</div>

<?php $this->widget->run('front_exam_news_section',TRUE);?>
<!--<style>
    .exam-news-container {
        background: rgb(252, 252, 252);
        height: 100%;
    }
    .exam-news-container .news-img-container {
        overflow: hidden;
    }
    a {
        color: #ff7900;
        -webkit-text-decoration: none;
        text-decoration: none;
        background-color: transparent;
    }
    .exam-news-container .news-img-container a .news-img {
        width: 100%;
        height: 160px;
    }

    img.jsx-2239496879 {
        height: 160px;
        width: auto;
        max-height: 160px ;
        overflow: hidden;
    }
    img {
        vertical-align: middle;
        border-style: none;
    }
    .exam-news-container .exam-news-content {
        padding: 10px 10px 5px;
    }
    .exam-news-container .exam-news-content .posted-on {
        color: rgb(187, 187, 187);
    }
    .d-inline-block {
        display: inline-block;
    }
    .text-md {
        font-size: .75rem;
    }
    .exam-news-container .exam-news-content .news-like-icon {
        cursor: pointer;
    }
    a:not([href]) {
        color: inherit;
        -webkit-text-decoration: none;
        text-decoration: none;
    }
    .pb-2, .py-2 {
        padding-bottom: 0.5rem ;
    }
    .pt-2, .py-2 {
        padding-top: 0.5rem;
    }
    .float-right {
        float: right;
    }
    .exam-news-container .exam-news-content .categories {
        color: rgb(54, 54, 54);
        display: block;
        margin-top: 5px;
    }
    .text-uppercase {
        text-transform: uppercase;
    }
    .text-md {
        font-size: .75rem;
    }
    .like-icon {
        width: 25px;
        height: 23px;
        fill-opacity: 0 !important;
        stroke: rgb(239, 83, 72) !important;
        stroke-width: 12 !important;
    }
    .icon {
        display: inline-block;
        line-height: initial;
        height: 15px;
        width: 15px;
    }
</style>
<section class="pageDetailsSec py-4">
  <div class="wrapper">
    <div class="row">
        <div class="col-lg-12">
           <section class="jsx-3185532658 pb-5 section-wrapper my-4">
            <div class="jsx-3185532658 d-block my-5 article-heading text-uppercase">
                <h2 class="jsx-3185532658 d-inline-block m-0 font-weight-normal"><b class="jsx-3185532658">xat</b> News</h2>
                <span class="jsx-3185532658 ml-5">
                    <a class="jsx-3185532658 text-gray text-decoration-none font-weight-semi see-more" href="/exams/xat/news">See more news</a></span></div><div class="jsx-1139490189 row "><div class="jsx-1139490189 col-md-3 col-sm-6 col-xs-12 mb-4 "><div class="jsx-1139490189 exam-news-container border position-relative overflow-hidden"><div class="jsx-1139490189 news-img-container overflow-hidden"><a target="_blank" href="https://collegedunia.com/news/xat-2021-result-released-xatonlinein-check-steps-to-download-alertid-32430" class="jsx-1139490189"><img data-src="https://images.static-collegedunia.com/public/asset/img/exam/news/news8.jpg?tr=h-160,c-at_max" src="https://images.static-collegedunia.com/public/asset/img/exam/news/news8.jpg?tr=h-160,c-at_max" alt="" height="160px" class="jsx-2239496879 news-img ls-is-cached lazyloaded"></a></div><div class="jsx-1139490189 exam-news-content"><span class="jsx-1139490189 posted-on text-md d-inline-block">Jan 15, 2021</span><a class="jsx-1139490189 float-right py-2  news-like-icon"><span class="jsx-1139490189 icon like-icon"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 176.104 176.104"><path d="M150.383 18.301a49.633 49.633 0 00-24.033-6.187c-15.394 0-29.18 7.015-38.283 18.015-9.146-11-22.919-18.015-38.334-18.015-8.704 0-16.867 2.259-24.013 6.187C10.388 26.792 0 43.117 0 61.878 0 67.249.874 72.4 2.457 77.219c8.537 38.374 85.61 86.771 85.61 86.771s77.022-48.396 85.571-86.771a49.09 49.09 0 002.466-15.341c0-18.754-10.388-35.074-25.721-43.577z"></path></svg></span></a><span class="jsx-1139490189 categories text-md text-uppercase">xat 2021</span><h3 class="jsx-1139490189 text-base mb-0"><a target="_blank" href="https://collegedunia.com/news/xat-2021-result-released-xatonlinein-check-steps-to-download-alertid-32430" class="jsx-1139490189 news-title mb-2">XAT 2021 Result Released @xatonline.in, Know How to Download...</a></h3></div></div></div><div class="jsx-1139490189 col-md-3 col-sm-6 col-xs-12 mb-4 "><div class="jsx-1139490189 exam-news-container border position-relative overflow-hidden"><div class="jsx-1139490189 news-img-container overflow-hidden"><a target="_blank" href="https://collegedunia.com/news/xat-2021-answer-key-released-xatonlinein-check-here-to-download-alertid-32103" class="jsx-1139490189"><img data-src="https://images.static-collegedunia.com/public/asset/img/exam/news/news6.jpg?tr=h-160,c-at_max" src="https://images.static-collegedunia.com/public/asset/img/exam/news/news6.jpg?tr=h-160,c-at_max" alt="" height="160px" class="jsx-2239496879 news-img ls-is-cached lazyloaded"></a></div><div class="jsx-1139490189 exam-news-content"><span class="jsx-1139490189 posted-on text-md d-inline-block">Jan 8, 2021</span><a class="jsx-1139490189 float-right py-2  news-like-icon"><span class="jsx-1139490189 icon like-icon"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 176.104 176.104"><path d="M150.383 18.301a49.633 49.633 0 00-24.033-6.187c-15.394 0-29.18 7.015-38.283 18.015-9.146-11-22.919-18.015-38.334-18.015-8.704 0-16.867 2.259-24.013 6.187C10.388 26.792 0 43.117 0 61.878 0 67.249.874 72.4 2.457 77.219c8.537 38.374 85.61 86.771 85.61 86.771s77.022-48.396 85.571-86.771a49.09 49.09 0 002.466-15.341c0-18.754-10.388-35.074-25.721-43.577z"></path></svg></span></a><span class="jsx-1139490189 categories text-md text-uppercase">xat 2021</span><h3 class="jsx-1139490189 text-base mb-0"><a target="_blank" href="https://collegedunia.com/news/xat-2021-answer-key-released-xatonlinein-check-here-to-download-alertid-32103" class="jsx-1139490189 news-title mb-2">XAT 2021: Answer Key Released @xatonline.in; Check Here to Download...</a></h3></div></div></div><div class="jsx-1139490189 col-md-3 col-sm-6 col-xs-12 mb-4 "><div class="jsx-1139490189 exam-news-container border position-relative overflow-hidden"><div class="jsx-1139490189 news-img-container overflow-hidden"><a target="_blank" href="https://collegedunia.com/news/xat-2021-xlri-jamshedpur-to-begin-shortlisting-for-bm-hrm-soon-check-application-process-dates-cutoff-here-alertid-32063" class="jsx-1139490189"><img data-src="https://images.static-collegedunia.com/public/asset/img/exam/news/news7.jpg?tr=h-160,c-at_max" src="https://images.static-collegedunia.com/public/asset/img/exam/news/news7.jpg?tr=h-160,c-at_max" alt="" height="160px" class="jsx-2239496879 news-img lazyloaded"></a></div><div class="jsx-1139490189 exam-news-content"><span class="jsx-1139490189 posted-on text-md d-inline-block">Jan 8, 2021</span><a class="jsx-1139490189 float-right py-2  news-like-icon"><span class="jsx-1139490189 icon like-icon"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 176.104 176.104"><path d="M150.383 18.301a49.633 49.633 0 00-24.033-6.187c-15.394 0-29.18 7.015-38.283 18.015-9.146-11-22.919-18.015-38.334-18.015-8.704 0-16.867 2.259-24.013 6.187C10.388 26.792 0 43.117 0 61.878 0 67.249.874 72.4 2.457 77.219c8.537 38.374 85.61 86.771 85.61 86.771s77.022-48.396 85.571-86.771a49.09 49.09 0 002.466-15.341c0-18.754-10.388-35.074-25.721-43.577z"></path></svg></span></a><span class="jsx-1139490189 categories text-md text-uppercase">xat 2021</span><h3 class="jsx-1139490189 text-base mb-0"><a target="_blank" href="https://collegedunia.com/news/xat-2021-xlri-jamshedpur-to-begin-shortlisting-for-bm-hrm-soon-check-application-process-dates-cutoff-here-alertid-32063" class="jsx-1139490189 news-title mb-2">XAT 2021: XLRI Jamshedpur to Begin Shortlisting for BM, HRM Soon; Check Application Proces...</a></h3></div></div></div><div class="jsx-1139490189 col-md-3 col-sm-6 col-xs-12 mb-4 "><div class="jsx-1139490189 exam-news-container border position-relative overflow-hidden"><div class="jsx-1139490189 news-img-container overflow-hidden"><a target="_blank" href="https://collegedunia.com/news/xat-2021-response-sheet-out-answer-key-releasing-soon-xatonlinein-details-here-alertid-31813" class="jsx-1139490189"><img data-src="https://images.static-collegedunia.com/public/asset/img/exam/news/news12.jpg?tr=h-160,c-at_max" src="https://images.static-collegedunia.com/public/asset/img/exam/news/news12.jpg?tr=h-160,c-at_max" alt="" height="160px" class="jsx-2239496879 news-img lazyloaded"></a></div><div class="jsx-1139490189 exam-news-content"><span class="jsx-1139490189 posted-on text-md d-inline-block">Jan 5, 2021</span><a class="jsx-1139490189 float-right py-2  news-like-icon"><span class="jsx-1139490189 icon like-icon"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 176.104 176.104"><path d="M150.383 18.301a49.633 49.633 0 00-24.033-6.187c-15.394 0-29.18 7.015-38.283 18.015-9.146-11-22.919-18.015-38.334-18.015-8.704 0-16.867 2.259-24.013 6.187C10.388 26.792 0 43.117 0 61.878 0 67.249.874 72.4 2.457 77.219c8.537 38.374 85.61 86.771 85.61 86.771s77.022-48.396 85.571-86.771a49.09 49.09 0 002.466-15.341c0-18.754-10.388-35.074-25.721-43.577z"></path></svg></span></a><span class="jsx-1139490189 categories text-md text-uppercase">xat 2021</span><h3 class="jsx-1139490189 text-base mb-0"><a target="_blank" href="https://collegedunia.com/news/xat-2021-response-sheet-out-answer-key-releasing-soon-xatonlinein-details-here-alertid-31813" class="jsx-1139490189 news-title mb-2">XAT 2021 Response Sheet (Out), Answer Key Releasing Soon @xatonline.in; Details Here...</a></h3></div></div></div></div></section>
          </div>
        
    </div>
  </div>
 </section>
-->
<div class="adBlock">
  <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
                  crossorigin="anonymous"></script>
    <!-- wayto_hz_1_ads -->
    <ins class="adsbygoogle"
        style="display:inline-block;width:728px;height:90px"
        data-ad-client="ca-pub-9545373166119354"
        data-ad-slot="7117741101" style="clear: both; display: flex;justify-content: center;margin-left:50px;margin-right:50px;"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </div>
</div>

<?php $this->widget->run('front_subscription_section',TRUE);?>


 <style>
 .section_wrapper.jsx-222626221 .download_sample.jsx-222626221 {
    position: relative;
    background: rgb(248, 248, 248);
    padding: 20px 15px;
    font-size: 1.2rem;
 }
 .section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .month.jsx-222626221 {
    color: rgb(255, 138, 0);
    font-weight: 900;
    display: block;
    line-height: 1.6;
    margin-bottom: -8px;
}
.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 h3.jsx-222626221 {
    font-weight: 600;
    margin-top: 0px;
    margin-bottom: 5px;
    color: rgb(54, 54, 54);
}
.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .text-md.jsx-222626221 {
    color: rgb(151, 151, 151);
}
.section_wrapper.jsx-222626221 .download_sample.jsx-222626221 .text-md.jsx-222626221 .mock_paper_download_button.jsx-222626221 {
    background: rgb(255, 138, 0);
    width: 50px;
    height: 50px;
    fill: rgb(255, 255, 255);
    border-radius: 50%;
    position: absolute;
    right: 30px;
    bottom: -20px;
}
.icon {
    display: inline-block;
    line-height: initial;
    height: 15px;
    width: 15px;
}
 </style>

<style>
  .dropdown-menu{
    z-index: 99999 !important
  }
    .dropdown-menu li a{
        background-image: none;
        color: #666;
        border-right: 0 none;
        text-align: left;
        display: block;
        line-height: 22px;
        padding: 8px 12px;
        text-transform: none;
        font-size: 13px;
        letter-spacing: normal;
        border-right: 0 solid;
        text-decoration:none;
    }
   .dropdown-menu li:hover {
        background-color: #eee;
    }

    @media all and (min-width: 992px) {
      .nav-item .dropdown-menu{ display: none; }
      .nav-item:hover .nav-link{   }
      .nav-item:hover .dropdown-menu{ display: block; }
      .nav-item .dropdown-menu{ margin-top:0; }
    }
</style>

<script type="text/javascript">
  var wbpage='exampage';var _vtype='';var page='exam_details_page';
</script>
