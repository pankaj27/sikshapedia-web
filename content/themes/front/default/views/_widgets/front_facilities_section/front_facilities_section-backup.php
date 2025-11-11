<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<!---   wITH BACKGROUND --->
<?php
if(!empty($college_facilities)){
	?>

  <div class="card infoCard mb-4">
      <div class="card-header bg-white">
         <h5 class="m-0 color2">FACILITIES</h5>
      </div>
      <div class="card-body">
        <?php
        if(!empty($college_facilities_intro)){
            ?>
            <div class="d-flex flex-wrap"><?php echo $college_facilities_intro;?></div>
            <?php
        }
        ?>
        
        <div class="d-flex flex-wrap">

          <?php
          foreach ($college_facilities as $key => $value){
          ?>
          <div class="serviceIcoBox text-center">
            <img src="https://static.waytoadmissions.com/content/themes/front/default/assets/icon/background/<?php echo $value['facility_icon_3'];?>" style="width:60px;"/>
            
        
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

