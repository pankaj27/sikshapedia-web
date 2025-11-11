<?php 
  if(!empty($news_data)){
    ?>
    <div class="card imageCard mb-4">
      <div class="card-header bg-white">
        <h5 class="m-0 color2"> COLLEGE NEWS AND ARTICLE</h5>
      </div>
      <div class="card-body">
        <div class="row form-row">
          <div class="jsx-287911430 card-body p-4">
            <div class="jsx-287911430 row row-custom">

              <?php
              foreach ($news_data as $key => $value) {
                ?>
                <div class="jsx-2885338243 col-4 px-2 news-card">
                  <div class="jsx-2885338243 news-wrap mb-4">
                    <img data-src="<?php echo $value['news_image'];?>" alt="<?php echo $value['news_title'];?>" src="<?php echo $value['news_image'];?>" alt="<?php echo $value['news_title'];?>" height="144px" class="jsx-1145089839 image lazyloaded">
                    <div class="jsx-2885338243 news-block p-2 position-relative">
                      <div class="jsx-2885338243 d-flex justify-content-between">
                        <span class="jsx-2885338243 text-silver text-tiny font-weight-semi"> <?php echo $value['news_published'];?></span>
                        <!-- <span class="jsx-2885338243 icon pointer icon-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 979.494 979.494">
                            <path d="M964.616 227.519c-15.63-44.595-43.082-84.824-79.389-116.338-36.341-31.543-80.051-53.048-126.404-62.188-17.464-3.444-35.421-5.19-53.371-5.19-52.371 0-103.306 14.809-147.296 42.827a275.546 275.546 0 00-68.908 62.484 275.529 275.529 0 00-68.859-62.364c-43.969-27.977-94.869-42.765-147.2-42.765h-.001c-43.604 0-87.367 10.77-126.546 31.143-39.15 20.358-73.104 49.978-98.188 85.658C22.752 197.343 7.096 238.278 1.92 282.453-2.612 321.14.888 362.67 12.325 405.889c22.656 85.615 72.803 163.707 110.882 214.142 82.795 109.659 196.636 209.196 348.028 304.301l18.085 11.36 18.086-11.36c186.218-116.982 316.196-240.49 397.358-377.583 46.678-78.844 70.994-149.084 74.343-214.733 1.865-36.587-3.011-71.745-14.491-104.497zM489.322 855.248c-135.253-87.096-237.398-177.586-311.846-276.192-34.407-45.571-79.583-115.623-99.414-190.562-9.245-34.937-12.14-67.951-8.604-98.128 3.846-32.824 15.494-63.262 34.623-90.47 18.844-26.803 44.41-49.085 73.932-64.436 29.533-15.357 62.444-23.474 95.176-23.474 39.377 0 77.654 11.113 110.692 32.136 32.204 20.492 58.094 49.399 74.868 83.596l30.559 62.292 30.505-62.318c16.759-34.238 42.648-63.183 74.872-83.705 33.057-21.054 71.358-32.182 110.767-32.182 13.544 0 27.074 1.314 40.216 3.905 34.739 6.85 67.585 23.042 94.986 46.826 27.39 23.774 48.064 54.023 59.79 87.476 8.547 24.385 12.164 50.811 10.75 78.542-2.772 54.379-24.017 114.42-64.944 183.553-72.912 123.155-189.793 235.552-356.928 343.141z" fill="#ff7900"></path>
                          </svg>
                        </span> -->
                      </div>
                      <a class="jsx-2885338243 font-weight-bold text-base" href="<?php echo $value['news_link'];?>"><?php echo $value['news_title'];?></a>
                      <p class="jsx-2885338243 mb-2 mt-2 text-sm text-silver">Looking back on November, do you realise you should have revised more, or do you wonder what your parents would think about the final shortlist? Isn&amp;#39;t it true that everything right now seems to be reminding you of the shortlist? The worst part is simply not knowing!And, to alleviate your mor</p>
                    </div>
                  </div>
                </div>
                <?php
              }
              ?>
            </div>
          </div>
        </div>
      </div>
    </div>
    <?php
  }
?>








<style type="text/css">
  .news.jsx-287911430 {
      border-radius: 4px;
      box-shadow: 0 0 4px 0 rgb(207 207 207 / 50%);
  }

.news.jsx-287911430 .card-heading.jsx-287911430 {
    font-size: 1.125rem;
    -webkit-letter-spacing: .7px;
    -moz-letter-spacing: .7px;
    -ms-letter-spacing: .7px;
    letter-spacing: .7px;
    border-bottom: solid 1px rgba(164,164,164,0.2);
}

.news.jsx-287911430 .row-custom.jsx-287911430 {
    margin-right: -8px;
    margin-left: -8px;
}

.news-card.jsx-2885338243 .news-wrap.jsx-2885338243 {
    background-color: #fcfcfc;
    border: 1px solid #eee;
}

.news-card.jsx-2885338243 .image {
    width: 100% !important;
    max-width: 100% !important;
    min-height: 144px;
}

img.jsx-1145089839 {
    height: 144px;
    width: 277px;
    max-height: 144px;
    max-width: 277px;
    overflow: hidden;
}
img {
    vertical-align: middle;
    border-style: none;
}

.news-card.jsx-2885338243 .news-wrap.jsx-2885338243 .news-block.jsx-2885338243 {
    height: 124px;
    overflow: hidden;
}

.justify-content-between {
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
}
.d-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}
.text-silver {
    color: #999;
}
.font-weight-semi {
    font-weight: 600;
}

.text-tiny {
    font-size: .625rem;
}
.icon {
    display: inline-block;
    line-height: initial;
    height: 15px;
    width: 15px;
}

.pointer {
    cursor: pointer;
}

.font-weight-bold, h1.font-weight-bold, h2.font-weight-bold, h3.font-weight-bold, h4.font-weight-bold, h5.font-weight-bold, h6.font-weight-bold, .h1.font-weight-bold, .h2.font-weight-bold, .h3.font-weight-bold, .h4.font-weight-bold, .h5.font-weight-bold, .h6.font-weight-bold {
    font-weight: 700;
}
.text-base {
    font-size: .875rem;
}

p.mb-2, p.my-2 {
    margin-bottom: .5rem;
}
.text-silver {
    color: #999;
}
.mb-2, .my-2 {
    margin-bottom: .5rem;
}
.mt-2, .my-2 {
    margin-top: .5rem;
}
.text-sm {
    font-size: .6875rem;
}
p {
    margin-top: 0;
    margin-bottom: 1rem;
}

[class*="col-"].pl-2, input.pl-2, [class*="col-"].px-2, input.px-2 {
    padding-left: .5rem;
}
[class*="col-"].pr-2, input.pr-2, [class*="col-"].px-2, input.px-2 {
    padding-right: .5rem;
}
.pl-2, .px-2 {
    padding-left: .5rem;
}
.pr-2, .px-2 {
    padding-right: .5rem;
}
.col-3 {
    -webkit-flex: 0 0 25%;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
}
.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-md-auto {
    position: relative;
    width: 100%;
    padding-right: 10px;
    padding-left: 10px;
}
</style>