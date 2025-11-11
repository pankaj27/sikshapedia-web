<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($streams)){
    ?>
    <section class="searchSesultSec jsx-1737880607 course-level-section pt-3 pb-4">
        <div class="jsx-1737880607 wrapper streams-wrapper">
            <?php
            foreach ($streams as $key => $value){
                ?>
                <div class="jsx-1321156703 row d-flex levelCard">
                    <a class="jsx-1321156703 iconWrapper d-flex justify-content-center " href="<?php echo $value['stream_access_link'];?>">
                        <span class="jsx-1321156703 streamIcon">
                           <?php echo $value['strteam_icon'];?>
                        </span>
                        <span class="jsx-1321156703 streamHeading"> <?php echo $value['stream_name'];?> </span>
                    </a>
                    <div class="jsx-1321156703 listWrapper position-relative">
                        <ul class="jsx-1321156703">
                            <?php
                            foreach ($value['stream_courses'] as $k => $v){
                                ?>
                                <li class="jsx-1321156703 courseBlock ">
                                  <div class="jsx-1321156703 d-flex justify-content-between">
                                     <a class="jsx-1321156703 courseName font-weight-bold" href="<?php echo $v['access_link'];?>"><?php echo $v['course_name'];?> </a>
                                     <div class="jsx-1321156703 courseDuration"><span class="jsx-1321156703 year"><span class="jsx-1321156703 mr-1">4 YEARS</span></span><span class="jsx-1321156703 shift"> Full Time </span></div>
                                  </div>
                                  <div class="jsx-1321156703 link-block"><a class="jsx-1321156703 overview-link text-link font-weight-semi" href="/courses/bachelor-of-technology-btech-mechanical-engineering">Course Overview</a><a class="jsx-1321156703 overview-link text-link font-weight-semi" href="/courses/bachelor-of-technology-btech-mechanical-engineering/career-options-and-jobs">Career Options &amp; Jobs</a><a class="jsx-1321156703 overview-link text-link font-weight-semi" href="/courses/bachelor-of-technology-btech-mechanical-engineering/syllabus">Syllabus</a><button data-csm-track="true" data-csm-href="javascript:void(0)" class="jsx-1321156703 customPill "> Apply Now</button></div>
                               </li>
                                <?php
                            }
                            ?>
                        </ul>
                        <div class="jsx-1321156703 text-right view-btn position-absolute "><a class="jsx-1321156703 btn btn-primary allCourseBtn" href="<?php echo $value['stream_access_link'];?>"> View All Courses </a></div>
                    </div>
                </div>
                <?php
            }
            ?>            
        </div>
    </section>
    <?php
}
?>