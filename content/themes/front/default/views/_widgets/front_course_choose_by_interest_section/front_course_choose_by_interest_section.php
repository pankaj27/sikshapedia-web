<?php
if(!empty($streams)){
?>
<section class="chooseby">
  <div class="wrapper">
    <div class="section-title text-white">
      <h2>CHOOSE BY INTEREST</h2>
      <p>Sikshapedia.com is an extensive search engine for the students, parents,and education industry players who are seeking information</p>
    </div>
    <div class="row">
      <?php
      foreach ($streams as $key => $value){
        ?>
        <div class="col-md-3">
          <div class="grid__item grid__item--1">
            <div class="item">
              <div class="cousubcon">
                <a href="#">
                  <img src="<?php echo base_url();?>public/data/app/app_data/final-course-icon/<?php echo $value['stream_icon'];?>" alt="<?php echo $value['stream_name'];?>">
                </a>
                <span class="cour"><?php echo $value['stream_name'];?></span>
                <!--  <h5>JEE MAIN 2023</h5> -->
                <?php
                if(!empty($stream_degrees[$value['stream_id']])){
                  ?>
                  <ul class="jsx-2039099299 level-ul p-0 mb-2">
                    <?php
                    foreach ($stream_degrees[$value['stream_id']] as $k => $v){
                      ?>
                      <li class="jsx-2039099299 d-inline-block list-li">
                    <a class="jsx-2039099299 position-relative list-link font-weight-bold" href="<?php echo $v['degree_access_url'];?>"><?php echo $v['degree_name'];?></a>
                  </li>
                      <?php
                    }
                    ?>
                  </ul>
                  <?php
                }
                ?>
              </div>
              <div class="over1">
                <div class="row">
                  <div class="col-lg-12 col-sm-12">
                    <a href="<?php echo $value['stream_access_url'];?>" class="over">EXPLORE ALL COURSES</a>
                  </div>
                  <!--   <div class="col-lg-4 col-sm-4"><div class="over-icon"><img src="assets/engineering-1.svg"></div></div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <?php
      }
      ?>
      
    </div>
  </div>
  </div>
</section>
<?php
}
?>


<style type="text/css">
  /********* choose by interest ***************/
  .cour {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-left: 14px;
  }
  ul.jsx-2039099299.level-ul.p-0.mb-2 {
      margin-top: 15px;
  }
  .chooseby {
      padding: 60px 0px;
  }
  .chooseby p{color:#1b1f4c;}

  a.jsx-2039099299.position-relative.list-link.font-weight-bold {
      text-decoration: none;
      margin-right: 25px;
      color: #848282;
  }
  .grid__item.grid__item--1 {
      padding-top: 37px;
  }

/************* End of choose by interest **********/

  /******** Top Exams**********/
  .grid__item .item {
    border: 1px #00000036 solid;
    border-radius: 4%;
    padding-bottom: 5px;
    transition: box-shadow 0.3s ease;
}
.cousubcon {
    / border: 1px solid #d7d3d3; /
    padding-top: 21px!important;
    padding-left: 20px!important;
    margin-right: 0px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #f6f6f6;
    margin-top: 0px;
    height: 170px;
}
.cousubcon .time {
    position: relative;
    top: -16px;
    text-decoration: none;
    color: #fff;
    font-weight: 400;
    padding: 8px 14px;
    background-color: #40414de0;
    font-size: 15px;
    border: 1px solid #40414de0;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}
.cousubcon h5 {
    color: #000;
    font-size: 23px;
    margin-top: 20px;
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
    / border-radius: 8px; /
}
.over1 .over {
    color: #fff;
    font-size: 18px;
    font-weight: 400;
    text-decoration: none;
    padding: 8px 20px;
    background-color: #fd390e!important;
    border-radius: 15px;
    / text-align: center; /
}

.over-icon {
    / width: 56%; /
    margin-top: -56px;
    background-color: #fff;
    height: 100px;
    width: 100px;
    padding: 5px;
    border-radius: 50%;
    border: 7px solid #f4f4f4;
    text-align: center;
    line-height: 80px;
}
/**********End of Top Exams******************/
</style>