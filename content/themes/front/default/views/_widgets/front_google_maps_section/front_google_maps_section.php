<?php
if(!empty($google_maps_data)){
  ?>
 
  <div class="address bg-white mt-4 non-mobile-map">
    <div class="card-body">
      <div class="row">
        <?php
        if($google_maps_data['college_paid']==="yes"){
          ?>
          <div class="address-box p-4 col-6">
            <div class="location-box position-relative">
              <div class="info d-flex">
                <span class="icon location-svg-list location mr-7  text-white"></span>
                <h3 class="text-lg text-white"> <?php echo $google_maps_data['college_address'];?> <br class=""><?php echo $google_maps_data['college_state'];?>, <?php echo $google_maps_data['college_country'];?> 
                  </h3>
              </div>
              <?php
              if(!empty($google_maps_data['college_direction'])){
                ?>
                <div class="info d-flex text-uppercase mt-5">
                  <span class="icon location-svg-list bullet mr-7 mt-1"></span>
                  <span class="text-white text-sm d-flex">
                    <span class="distance bg-white text-secondary px-2 mr-7">1.11 KM</span>
                    <span class="loc-name d-inline-flex">
                      <span class="icon bus location-svg-list mr-2"></span>I.I.T. Main Gate </span>
                  </span>
                </div>
                <?php
              }
              ?>
                
            </div>
        
          
              <div class="contact pt-4 text-white">
                <div class="info mt-5 d-flex">
                  <span class="icon call location-svg-list mr-7  text-white"></span>
                  <p class="m-0 font-weight-bold text-uppercase"> <?php echo $google_maps_data['college_phone_no'];?></p>
                </div>
              </div>
            
              
            <div class="email-contact text-white">
              <div class="info mt-6 d-flex">
                <span class="icon email location-svg-list mr-7  text-white"></span>
                <span class="m-0 pointer text-white text-uppercase font-weight-bold" style="cursor: auyo !important;"><?php echo $google_maps_data['college_email_address'] ;?></span>
              </div>
            </div>

          
          </div>
          <?php
        }
        ?>
        

        <div class="col-<?php echo ($google_maps_data['college_paid']==="yes")?'6':'12';?> p-0" <?php echo ($google_maps_data['college_paid']==="yes")?'':'height="30%"';?>>
          <div id="google-map" class="map">
            <iframe data-src="<?php echo $google_maps_data['college_google_map'];?>" src="<?php echo $google_maps_data['college_google_map'];?>" class="lazyloaded"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="address bg-white mt-4 mobile-map">
    <div class="card-body">
      <div class="row">
        <div class="address-box p-4 col-12">
          <div class="location-box position-relative">
            <div class="info d-flex" style="margin-bottom:-10px !important">
              <span class="icon location-svg-list location mr-7"></span>
              <h3 class="text-lg text-white"><?php echo $google_maps_data['college_address'];?> <br class=""><?php echo $google_maps_data['college_state'];?>, <?php echo $google_maps_data['college_country'];?> 
                </h3>
            </div>
            <?php
            if(!empty($google_maps_data['college_direction'])){
              ?>
              <div class="info d-flex text-uppercase mt-5">
                <span class="icon location-svg-list bullet mr-7 mt-1"></span>
                <span class="text-white text-sm d-flex">
                  <span class="distance bg-white text-secondary px-2 mr-7">1.11 KM</span>
                  <span class="loc-name d-inline-flex">
                    <span class="icon bus location-svg-list mr-2"></span>I.I.T. Main Gate </span>
                </span>
              </div>
              <?php
            }
            ?>
              
          </div>
       
         <?php
          if($google_maps_data['college_paid']==="paid"){
            ?>
            <div class="contact pt-4">
              <div class="info mt-5 d-flex">
                <span class="icon call location-svg-list mr-7 text-white"></span>
                <p class="m-0 font-weight-bold text-uppercase text-white"> <?php echo $google_maps_data['college_phone_no'];?></p>
              </div>
            </div>
            <?php
          }
          ?>
            
          <div class="email-contact">
            <div class="info mt-6 d-flex">
              <span class="icon email location-svg-list mr-7 text-white"></span>
              <span class="m-0 pointer text-white white-uppercase font-weight-bold" style="cursor: auyo !important;"><?php echo $google_maps_data['college_email_address'] ;?></span>
            </div>
          </div>

          <?php
          if($google_maps_data['college_paid']=="paid"){
            ?>
            <div class="email-contact">
                <div class="info mt-6 d-flex">
                  <span class="icon sms location-svg-list mr-7 text-white"></span>
                  <span class="m-0 pointer text-white text-uppercase font-weight-bold" style="cursor: auyo !important;"><?php echo $google_maps_data['college_phone_no'] ;?></span>
                </div>
              </div>
            <?php
          }
          ?>

          <div class="container" style="padding-top:15px !important;height: 35svh !important;">
              <div id="google-map" class="map">
                <iframe data-src="<?php echo $google_maps_data['college_google_map'];?>" src="<?php echo $google_maps_data['college_google_map'];?>" class="lazyloaded"></iframe>
              </div>
          </div>


        </div>
      </div>
    </div>
  </div>
  <?php
}
?>



<style type="text/css">
  .address {
    border-radius: 4px;
    box-shadow: 0 0 4px 0 rgb(207 207 207 / 50%);
    margin-bottom: 20px;
  }
  .address .card-body {
    padding: 0px 15px;
  }
  .address .address-box {
    background-color: #1d1d1e  !important;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    min-height: 440px;
    color:#fff;
  }
  .address .address-box .location-box {
    min-height: 100px;
    border-bottom: 2px solid #6f7683;
    padding-bottom: 30px;
  }
    .address .address-box .info .icon.location {
        background-position: -150px 0px;
        -webkit-filter: invert(1);
        filter: invert(1);
        height: 20px;
        width: 30px !important;
        fill: #fff;
    }
.address .address-box .info .location-svg-list {
    background: url(<?php echo base_url('public/data/app/app_data/college_address.svg');?>) no-repeat;
    background-size: auto 100%;
}
.address .address-box .info h3 {
    line-height: 1.5;
}
.text-white {
    color: #fff;
}
.text-lg {
    font-size: 1rem;
}
.text-uppercase {
    text-transform: uppercase;
}
.mt-5, .my-5 {
    margin-top: 1.25rem;
}
.text-white {
    color: #fff;
}
.pt-4, .py-4 {
    padding-top: 1rem;
}
.address .address-box .info .location-svg-list {
    background: url(<?php echo base_url('public/data/app/app_data/college_address.svg');?>) no-repeat;
    background-size: auto 100%;
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
p.m-0 {
    margin: 0;
}
.mt-6, .my-6 {
    margin-top: 1.5rem;
}

.address .address-box .info .icon.email {
    background-position: -18px 0px;
}
.address .address-box .info .location-svg-list {
    background: url(<?php echo base_url('public/data/app/app_data/college_address.svg');?>) no-repeat;
    background-size: auto 100%;
}
.text-blue {
    color: #4fb8dd;
}
.pointer {
    cursor: pointer;
}
.address .address-box .info .icon.sms {
    background-position: -36px 0px;
}
.address .address-box .info .location-svg-list {
    background: url(<?php echo base_url('public/data/app/app_data/college_address.svg');?>) no-repeat;
    background-size: auto 100%;
}
.address .address-box .website {
    width: 100%;
    margin-left: -16px;
    position: absolute;
    background-color: #222b3a;
    border-bottom-left-radius: 4px;
    bottom: 0;
}
.address .address-box .info .icon.website-icon {
    background-position: -148px 0px;
}
.address .address-box .info .location-svg-list {
    background: url(<?php echo base_url('public/data/app/app_data/college_address.svg');?>) no-repeat;
    background-size: auto 100%;
}
.map {
    height: 100%;
}
.map.india-college-map iframe {
    height: 440px;
}
.map iframe {
    width: 100%;
    frameborder: 0;
    border: 0;
}


.address .address-box .info .location-svg-list {
    background: url(<?php echo base_url('public/data/app/app_data/college_address.svg');?>) no-repeat;
    background-size: auto 100%;
}
.mt-4, .my-4 {
margin-top: 1rem;
}

</style>