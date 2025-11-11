
<?php 

if(!empty($google_maps_data)){
  ?>
  <div class="jsx-2880160527  address bg-white mt-4">
    <div class="jsx-2880160527 card-body">
      <div class="jsx-2880160527 row">
        <div class="jsx-2880160527 address-box p-4 col-6" style="background-color: #323c4f !important;">
          <div class="jsx-2880160527 location-box position-relative">
            <div class="jsx-2880160527 info d-flex">
              <span class="jsx-2880160527 icon location mr-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="78.958 0 308.666 466.582"><path d="M233.292 0c-85.1 0-154.334 69.234-154.334 154.333 0 34.275 21.887 90.155 66.908 170.834 31.846 57.063 63.168 104.643 64.484 106.64l22.942 34.775 22.941-34.774c1.316-1.998 32.641-49.577 64.482-106.64 45.023-80.68 66.908-136.559 66.908-170.834C387.625 69.234 318.391 0 233.292 0zm0 233.291c-44.182 0-80-35.817-80-80s35.818-80 80-80 80 35.817 80 80-35.819 80-80 80z"></path></svg></span><h5 class="jsx-2880160527 text-lg text-white"><?php echo $google_maps_data['college_address'];?> <br class="jsx-2880160527"><?php echo $google_maps_data['college_city'];?>  - <?php echo $google_maps_data['college_zipcode'];?><br class="jsx-2880160527"><?php echo $google_maps_data['college_state'];?>,   <?php echo $google_maps_data['college_country'];?></h5>
            </div>

            
              <div class="jsx-2880160527 info d-flex text-uppercase mt-5">
                <span class="jsx-2880160527 icon bullet mr-7 mt-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.107 29.107"><path d="M14.554 0C6.561 0 0 6.562 0 14.552c0 7.996 6.561 14.555 14.554 14.555 7.996 0 14.553-6.559 14.553-14.555C29.106 6.562 22.55 0 14.554 0z"></path></svg> </span>
                <?php
                if(!empty($google_maps_data['college_direction'])){
                  ?>
                    <span class="jsx-2880160527 text-white text-sm d-flex"><span class="jsx-2880160527 distance bg-white text-secondary px-2 mr-7">0.51 KM</span><span class="jsx-2880160527 loc-name d-inline-flex"><span class="jsx-2880160527 icon mr-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.3 24.3"><path data-name="Icon awesome-bus" d="M23.161 6.075h-.38V3.8c0-2.126-4.708-3.8-10.631-3.8S1.519 1.671 1.519 3.8v2.275h-.38A1.139 1.139 0 000 7.214v3.8a1.139 1.139 0 001.139 1.136h.38v7.594a1.519 1.519 0 001.519 1.519v1.519A1.519 1.519 0 004.556 24.3h1.519a1.519 1.519 0 001.519-1.519v-1.519h9.112v1.519a1.519 1.519 0 001.519 1.519h1.519a1.519 1.519 0 001.519-1.519v-1.519h.3a1.2 1.2 0 001.215-1.215v-7.9h.38a1.139 1.139 0 001.142-1.136v-3.8a1.139 1.139 0 00-1.139-1.136zM5.316 18.984a1.519 1.519 0 111.519-1.519 1.519 1.519 0 01-1.519 1.519zm.759-5.316a1.519 1.519 0 01-1.519-1.518V6.075a1.519 1.519 0 011.519-1.519h12.15a1.519 1.519 0 011.519 1.519v6.075a1.519 1.519 0 01-1.519 1.519zm12.909 5.316a1.519 1.519 0 111.516-1.518 1.519 1.519 0 01-1.516 1.518z" fill="#4d586c"></path></svg> </span>IIMB Bus Stop</span></span>
                    <?php
                }
                ?>
            </div>
              


            
          </div>
          <?php
          if(!empty($google_maps_data['college_phone_no'])){
            ?>
            <div class="jsx-2880160527 contact pt-4 text-white">
              <div class="jsx-2880160527 info mt-5 d-flex">
                <span class="jsx-2880160527 icon mr-7"><svg viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg"><path d="M13.333 11.398L11.28 9.344c-.41-.407-1.087-.395-1.51.029l-1.035 1.034a30.272 30.272 0 01-.204-.113c-.653-.362-1.548-.859-2.489-1.8C5.1 7.55 4.602 6.654 4.24 6c-.039-.07-.075-.136-.112-.2l.695-.693.341-.342c.424-.424.436-1.101.028-1.51L3.137 1.202C2.73.794 2.051.806 1.627 1.23l-.578.582.015.016a3.347 3.347 0 00-.477.841c-.11.294-.18.573-.212.854-.27 2.248.756 4.302 3.544 7.09 3.854 3.854 6.96 3.563 7.094 3.549a3.47 3.47 0 001.694-.69l.013.011.586-.574c.423-.424.435-1.101.027-1.51z" fill="#FFF" fill-rule="evenodd"></path></svg> </span><p class="jsx-2880160527 m-0 font-weight-bold text-uppercase"> <?php echo $google_maps_data['college_phone_no'];?></p>
              </div>
            </div>
            <?php
          }

          ?>
          
          <!-- <div class="jsx-2880160527 email-contact text-white" style="margin-top: 10px;">
            <div class="jsx-2880160527 info mt-6 d-flex">
              <span class="jsx-2880160527 icon mr-7"><svg viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg"><path d="M1.091 4.888A.835.835 0 00.9 6.341l2.705 1.968L13.21.75 4.716 9.12l3.698 2.69a.93.93 0 001.42-.433L13.79.552a.299.299 0 00-.388-.381L1.092 4.888zm1.87 4.076l.023.125.525 2.87a.649.649 0 00.99.43c.73-.472 1.685-1.098 1.66-1.135L2.96 8.964z" fill="#4FB7DD" fill-rule="evenodd"></path></svg> </span><span class="jsx-2880160527 m-0 pointer text-blue text-uppercase font-weight-bold">get Email contact</span>
            </div>
          </div>
          <div class="jsx-2880160527 email-contact text-white">
            <div class="jsx-2880160527 info mt-6 d-flex">
              <span class="jsx-2880160527 icon mr-7"><svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M12.556.222H1.889c-.733 0-1.333.6-1.333 1.334v12l2.666-2.667h9.334c.733 0 1.333-.6 1.333-1.333v-8c0-.734-.6-1.334-1.333-1.334zM4.725 6.016H3V4h1.725v2.016zm3.45 0H6.448V4h1.725v2.016zm3.449 0H9.899V4h1.725v2.016z" fill="#4FB7DD" fill-rule="evenodd"></path></svg> </span><span class="jsx-2880160527 m-0 pointer text-blue text-uppercase font-weight-bold">get SMS contact</span>
            </div>
          </div> -->
          <?php
          if(!empty($google_maps_data['college_web_address'])){
            ?>
            <div class="jsx-2880160527 website p-5">
              <div class="jsx-2880160527 info d-flex">
                <span class="jsx-2880160527 icon mr-7"><svg width="18" height="13" viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg"><path d="M9.3 13.06l8.769-5.478-8.77-5.48V5.7c-.251.022-.64.046-1.112.046-2.527 0-6.768-.682-6.768-5.254L.636.444C.58.621-.67 4.824 2.656 7.51 4.176 8.738 6.411 9.443 9.3 9.606v3.455z" fill="#FFF" fill-rule="evenodd" opacity="0.8"></path></svg> </span><a target="_blank" href="<?php echo $college_data['college_web_address'];?>" class="jsx-2880160527 m-0 font-weight-bold text-blue"> <?php echo $google_maps_data['college_web_address'];?> </a>
              </div>
            </div>
            <?php
          }
          ?>
            
        </div>
          <div class="jsx-2880160527 col-6 p-0">
            <div id="google-map" class="jsx-2514834862 map undefined india-college-map">
              <iframe  class="jsx-2514834862 lazyloaded" src="<?php echo $google_maps_data['college_google_map'];?>" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
            </div>
          </div>
        </div>
    </div>
  </div> 
  <?php
}

?>

<style type="text/css">
  .address.jsx-2705322352 {
    border-radius: 4px;
    box-shadow: 0 0 4px 0 rgb(207 207 207 / 50%);
  }
  .address.jsx-2705322352 .card-body.jsx-2705322352 {
    padding: 0px 15px;
  }
  .address.jsx-2705322352 .address-box.jsx-2705322352 {
    background-color: #323c4f !important;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    min-height: 440px;
  }
  .address.jsx-2705322352 .address-box.jsx-2705322352 .location-box.jsx-2705322352 {
    min-height: 100px;
    border-bottom: 2px solid #6f7683;
    padding-bottom: 30px;
  }
  .address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .icon.location.jsx-2705322352 {
    background-position: -150px 0px;
    -webkit-filter: invert(1);
    filter: invert(1);
    height: 20px;
    width: 20px;
    fill: #fff;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .location-svg-list.jsx-2705322352 {
    background: url(https://images.collegedunia.com/public/asset/img/college_address.svg) no-repeat;
    background-size: auto 100%;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 h3.jsx-2705322352 {
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
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .location-svg-list.jsx-2705322352 {
    background: url(https://images.collegedunia.com/public/asset/img/college_address.svg) no-repeat;
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

.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .icon.email.jsx-2705322352 {
    background-position: -18px 0px;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .location-svg-list.jsx-2705322352 {
    background: url(https://images.collegedunia.com/public/asset/img/college_address.svg) no-repeat;
    background-size: auto 100%;
}
.text-blue.jsx-2705322352 {
    color: #4fb8dd;
}
.pointer {
    cursor: pointer;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .icon.sms.jsx-2705322352 {
    background-position: -36px 0px;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .location-svg-list.jsx-2705322352 {
    background: url(https://images.collegedunia.com/public/asset/img/college_address.svg) no-repeat;
    background-size: auto 100%;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .website.jsx-2705322352 {
    width: 100%;
    margin-left: -16px;
    position: absolute;
    background-color: #222b3a;
    border-bottom-left-radius: 4px;
    bottom: 0;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .icon.website-icon.jsx-2705322352 {
    background-position: -148px 0px;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .location-svg-list.jsx-2705322352 {
    background: url(https://images.collegedunia.com/public/asset/img/college_address.svg) no-repeat;
    background-size: auto 100%;
}
.map.jsx-2514834862 {
    height: 100%;
}
.map.india-college-map.jsx-2514834862 iframe.jsx-2514834862 {
    height: 440px;
}
.map.jsx-2514834862 iframe.jsx-2514834862 {
    width: 100%;
    frameborder: 0;
    border: 0;
}

.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .icon.location.jsx-2705322352 {
    background-position: -150px 0px;
    -webkit-filter: invert(1);
    filter: invert(1);
    height: 20px;
    width: 20px;
    fill: #fff;
}
.address.jsx-2705322352 .address-box.jsx-2705322352 .info.jsx-2705322352 .location-svg-list.jsx-2705322352 {
    background: url(https://images.collegedunia.com/public/asset/img/college_address.svg) no-repeat;
    background-size: auto 100%;
}
  .mt-4, .my-4 {
    margin-top: 1rem;
  }

</style>