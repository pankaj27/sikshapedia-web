<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($streams)){
?>

     
<div class="card infoCard mb-4">
  <!-- <div class="card-header bg-white">
    <div class="section-title text-white">
      <h2>Top Exams</h2>
    </div>
  </div> -->
  <div class="card-body exam_wrapper">
    <div class="container-fluid">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <?php
        $tab=0;
        foreach ($streams as $key => $value) {
            ?>
            <li class="nav-item tabli">
              <a class="nav-link taba <?php echo ($tab==0)?'active':'';?>" data-toggle="tab" href="#tab<?php echo $tab;?>" role="tab" aria-controls="tab<?php echo $tab;?>" aria-selected="<?php echo ($tab==0)?'true':'';?>">
                <span class="logoimg">
                  <img src="<?php echo $value['stream_icon'];?>" alt="<?php echo $value['stream_name'];?>">
                </span><?php echo $value['stream_name'];?> </a>
            </li>
            <?php
            $tab++;
        }

        ?>
      </ul>
      <div class="tab-content" id="myTabContent">
        <?php
        $_tab=0;

        foreach ($streams as $key => $value) {
            ?>
            <div class="tab-pane fade show <?php echo ($_tab==0)?'active':'';?>" id="tab<?php echo $_tab;?>" role="tabpanel" aria-labelledby="tab<?php echo $_tab;?>">
              <div class="btnGroup flex-wrap">
                <div class="row">
                    <?php
                    if(!empty($value['stream_exams'])){
                        foreach ($value['stream_exams'] as $k => $v) {
                            ?>
                            <div class="col-md-4" style="margin-top: 10px;">
                                <div class="grid__item grid__item--1">
                                  <div class="item">
                                    <div class="cousubcon">
                                        <div class="row">
                                            <div class="col-lg-8 col-sm-12"><h5><?php echo $v['exam_short_name'];?></h5></div>
                                            <!-- <div class="col-lg-4 col-sm-12"><a href="#" class="time">Online Exam</a></div>  -->
                                            <div class="col-lg-12"><p><?php echo $v['exam_full_name'];?></p></div>

                                            <!-- <div class="col-lg-6 col-sm-12"><div class="exam1"><h6>Exam Date</h6></div></div>
                                            <div class="col-lg-6 col-sm-12"><div class="examda1"><p>24 Jan 24 - 01 Feb 24</p></div></div>
                                            <div class="col-lg-6 col-sm-12"><div class="appli"><h6>Application Form</h6></div></div>
                                            <div class="col-lg-6 col-sm-12"><div class="applida"><p>21 Jan 24 - 01 Nov 23</p></div></div>
                                            <div class="col-lg-6 col-sm-12"><div class="resultann"><h6>Result Announce</h6></div></div>
                                            <div class="col-lg-6 col-sm-12"><div class="resultanndt"><p>12 Feb</p></div></div> -->

                                        </div>
                                    </div>
                                    <div class="over1">
                                      <div class="row">
                                        <div class="col-lg-8 col-sm-8">
                                          <a href="<?php echo $v['exam_url'];?>" class="over">Read More</a>
                                        </div>
                                        <div class="col-lg-4 col-sm-4">
                                          <div class="over-icon">
                                            <img src="<?php echo $v['exam_logo'];?>" width="50px" hright="50px" alt="<?php echo $v['exam_lgo_alt'];?>">
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            <?php
                        }
                    }
                    ?>

                </div>
              </div>
            </div>
            <?php

            $_tab++;
        }

        ?>
      </div>
    </div>
  </div>
</div>
      


<style>
     /******** Top Exams**********/
    .grid__item .item {
        border: 1px #00000036 solid;
        border-radius: 4%;
        padding-bottom: 5px;
        transition: box-shadow 0.3s ease;
    }
    .cousubcon {
        padding-top: 21px!important;
        padding-left: 20px!important;
        margin-right: 0px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #f6f6f6;
        margin-top: 0px;
        height: auto;
    }
    .cousubcon .time {
        position: relative;
        top: 6px;
        text-decoration: none;
        color: #fff;
        font-weight: 400;
        padding: 8px 10px;
        background-color: #40414de0;
        font-size: 15px;
        border: 1px solid #40414de0;
        border-bottom-left-radius: 15px;
        margin-left: -26px;
        margin-left: -14px!;
        t-radius: 15px;
        margin-left: -14px;
    } 
    .cousubcon h5 {
        color: #000;
        font-size: 23px;
        margin-top: 16px;
    }
    .cousubcon p {
        color: #201e1e;
        font-size: 15px;
        line-height: 20px;
    }

    .over1 {
        background-color: #e7e7e7;
        padding: 20px;
        margin-right: 0px;
        margin-bottom: -6px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        /* border-radius: 8px; */
    }
    .over1 .over {
        color: #fff;
        font-size: 18px;
        font-weight: 400;
        text-decoration: none;
        padding: 8px 20px;
        background-color: #fd390e!important;
        border-radius: 15px;
        /* text-align: center; */
    }

    .over-icon {
        /* width: 56%; */
        margin-top: -56px;
        background-color: #fff;
        height: 90px;
        width: 90px;
        padding: 5px;
        border-radius: 50%;
        border: 7px solid #f4f4f4;
        text-align: center;
        line-height: 70px;
    }

    .btnGroup.flex-wrap {
        margin-top: 25px;
    }
    /**********End of Top Exams******************/
    /****tab implementattion************/
    #myTab{border-bottom:0;}
    #myTab .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
        border-color: #dee2e6 #dee2e6 #fff;
        border-radius: 20px;
       
      border: 1px solid #ff7900!important;
        background: #fff;
        color: #222!important;
    }
    #myTab .tabli {
        border: 1px solid #e7e7e7;
        border-radius: 35px;
        margin-left: 9px;
        margin-top:10px;
    }
    #myTab .taba{color:#333;
    border:none;
    border-radius: 20px;}

    .logoimg img {
        height: 40px;
        width: 40px;
        margin-right: 6px;
    }


    .cousubcon {
        padding-top: 21px!important;
        padding-left: 20px!important;
        margin-right: 0px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #f6f6f6;
        margin-top: 0px;
        height: auto;
    }
    .cousubcon .time {
        position: relative;
        top: -15px;
        text-decoration: none;
        color: #fff;
        font-weight: 400;
        padding: 8px 10px;
        background-color: #40414de0;
        font-size: 15px;
        border: 1px solid #40414de0;
        border-bottom-left-radius: 15px;
        margin-left: -14px;
    }
</style>

<?php
}
?>