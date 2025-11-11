<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
/*
if(!empty($college_facilities)){
	?>

  <div class="card infoCard mb-4">
      <div class="card-header bg-white">
         <h5 class="m-0 color2">FACILITIES(WB)</h5>
      </div>
      <div class="card-body">
        <div class="d-flex flex-wrap">

          <?php
          foreach ($college_facilities as $key => $value){
          ?>
          <div class="serviceIcoBox text-center">
            <!--<div class="ico">
              <?php //echo $value['facility_icon'];?>
            </div>-->
            
          <?php if($value['facility_name'] =="AUDITORIUM"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/AUDITORIUM.svg" style="width:60px;"/>
            
          <?php }else if($value['facility_name'] =="BANK"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/BANK.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="MEDICAL"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/MEDICAL.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="CAFETERIA"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/CAFETERIA.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="LIBRARY"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/LIBRARY.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="CLASSROOM"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/CLASSROOM.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="THEATER"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/AUDITORIUM.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="HOSTEL"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/HOSTEL.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="SPORTS"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/SPORTS.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="LABS"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/LAB.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="POOL"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/POOL.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="COMPUTER LAB"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/COMPUTER_LAB.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="TRANSPORT"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/TRANSPORT.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="GYM"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/withoutbackground/GYM.svg" style="width:60px;"/>
          
          <?php } ?>
          
            <br>
         
            <span class="text-sm font-weight-semi mt-2 pt-5"><?php echo $value['facility_name'];?></span>
          </div>

          <?php
          }
          ?>

        </div>
      </div>
    </div>




	<?php
}**/

?>

<!---   wITH BACKGROUND --->
<?php
if(!empty($college_facilities)){
	?>

  <div class="card infoCard mb-4">
      <div class="card-header bg-white">
         <h5 class="m-0 color2">FACILITIES</h5>
      </div>
      <div class="card-body">
        <div class="d-flex flex-wrap">

          <?php
          foreach ($college_facilities as $key => $value){
          ?>
          <div class="serviceIcoBox text-center">
            <!--<div class="ico">
              <?php //echo $value['facility_icon'];?>
            </div>-->
            
          <?php if($value['facility_name'] =="AUDITORIUM"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/AUDITORIUM.svg" style="width:60px;"/>
            
          <?php }else if($value['facility_name'] =="BANK"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/BANK.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="MEDICAL"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/MEDICAL.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="CAFETERIA"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/CAFETERIA.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="LIBRARY"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/LIBRARY.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="CLASSROOM"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/CLASSROOM.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="THEATER"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/AUDITORIUM.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="HOSTEL"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/HOSTEL.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="SPORTS"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/SPORTS.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="LABS"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/LAB.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="POOL"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/POOL.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="COMPUTER LAB"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/COMPUTER_LAB.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="TRANSPORT"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/TRANSPORT.svg" style="width:60px;"/>
          
          <?php }else if($value['facility_name'] =="GYM"){  ?>
          
                <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/GYM.svg" style="width:60px;"/>
          
          <?php } ?>
          
            <br>
         
            <span class="text-sm font-weight-semi mt-2 pt-5"><?php echo $value['facility_name'];?></span>
          </div>

          <?php
          }
          ?>

        </div>
      </div>
    </div>




	<?php
}

?>
<style>
.address.jsx-2880160527 {
    border-radius: 4px;
    box-shadow: rgb(207 207 207 / 50%) 0px 0px 4px 0px;
}
.mt-4, .my-4 {
    margin-top: 1rem;
}
.address.jsx-2880160527 .card-body.jsx-2880160527 {
    padding: 0px 15px;
}
.address.jsx-2880160527 .address-box.jsx-2880160527 {
    background-color: rgb(50, 60, 79);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    min-height: 440px;
}
.address.jsx-2880160527 .address-box.jsx-2880160527 .location-box.jsx-2880160527 {
    min-height: 100px;
    border-bottom: 2px solid rgb(111, 118, 131);
    padding-bottom: 30px;
}
.address.jsx-2880160527 .address-box.jsx-2880160527 .info.jsx-2880160527 .icon.location.jsx-2880160527 {
    height: 20px;
    width: 20px;
    fill: rgb(255, 255, 255);
}

.icon {
    display: inline-block;
    line-height: initial;
    height: 15px;
    width: 15px;
}
.mr-7, .mx-7 {
    margin-right: 1.75rem;
}
.address.jsx-2880160527 .address-box.jsx-2880160527 .info.jsx-2880160527 h3.jsx-2880160527 {
    line-height: 1.5;
}
.text-uppercase {
    text-transform: uppercase;
}
.address.jsx-2880160527 .address-box.jsx-2880160527 .info.jsx-2880160527 .icon.bullet.jsx-2880160527 {
    height: 10px;
    width: 20px;
    fill: rgb(255, 121, 0);
    z-index: 1;
}
.address.jsx-2880160527 .address-box.jsx-2880160527 .info.jsx-2880160527 .distance.jsx-2880160527 {
    border-radius: 12px;
}
*, *::before, *::after {
    box-sizing: border-box;
}
.map.jsx-2514834862 {
    height: 100%;
}
.address.jsx-2880160527 .address-box.jsx-2880160527 .location-box.jsx-2880160527:before {
    height: 67%;
    position: absolute;
    content: '';
    left: 9px;
    top: 28px;
    z-index: 1;
    border: 1px dashed #fff;
}


.map.india-college-map.jsx-2514834862 iframe.jsx-2514834862 {
    height: 99%;
    width:100%;
}

</style>

