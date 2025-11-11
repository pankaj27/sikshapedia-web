<section class="blog-sec">
  <div class="container">
    <div class="section-title">
      <h2>Sikshapedia Blog</h2>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">

      <?php

      if(!empty($blog_post_data)){
        foreach ($blog_post_data as $key => $value) {
          ?>
          <div class="col-lg-4" style="margin-top:20px;">
            <div class="card crd-prt">
              <!-- <span class="badge bg-success position-absolute top-0 end-0 m-3 fs-sm spon">Sponsored</span> -->
              <img src="<?php echo $value['blog_cover_image'];?>" alt="<?php echo $value['blog_title'];?>" style="height:278px;">
              <div class="card-body crd-body">
                <a class="fs-sm text-uppercase text-decoration-none txt" href="#"><?php echo $value['blog_category'];?></a>
                <h2 class="headi-prt">
                  <a href="<?php echo $value['blog_link'];?>"><?php echo $value['blog_title'];?></a>
                </h2>
                <?php
                if(!empty($value['blog_exerpt'])){
                  ?>
                  <p class="mb-md-4 text-muted"><?php echo $value['blog_exerpt'];?></p>
                  <?php
                }
                ?>                  
              </div>
              <div class="card-footer p-0 border-top-0 foter-prt">
                <a class="d-flex align-items-center text-decoration-none position-relative zindex-5" href="#">
                  <img class="rounded-circle" src="<?php echo $value['blog_user_image'];?>" width="48" alt="<?php echo $value['blog_user_name'];?>">
                  <div class="ps-2">
                    <h6 class="fs-sm text-nav lh-base mb-1 nme1"><?php echo $value['blog_user_name'];?></h6>
                    <div class="d-flex text-body fs-xs">
                      <span class="me-2 pe-1">
                        <i class="fi-calendar-alt opacity-70 mt-n1 me-1 align-middle"></i><?php echo $value['blog_created_at'];?> </span>
                      <!-- <span>
                        <i class="fi-chat-circle opacity-70 mt-n1 me-1 align-middle"></i>0 comments </span> -->
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <?php
        }
      }
      ?>
    </div>
  </div>
</section>

<div style="height:20px;margin-bottom:20px;background-color: #fff;"></div>

<?php $this->widget->run('front_subscription_section',TRUE);?>

<style type="text/css">
    
    /**************Blog*************/

.crd-body .txt{color:#f0644a;}
.crd-bdy {
    margin-top: 5px;
}
.headi-prt a{
  font-size:20px;
  color:#222;
}
.foter-prt{
  padding-top:10px!important;
  padding-bottom:10px!important;
  padding-left:10px!important;
}
.blog-sec {
    padding-top: 20px;
    background-color: #fff;
}
.card-horizontal .card-img-top, .card-horizontal .card-img-bottom {
    max-width: 39%;
    min-width: 39%;
}
.img-por1 {
    min-width: 100%;
    max-width: 100%;
    /* margin-top: 20px; */
    min-height: 230PX;
    margin-top: 25px;
    border-radius: 20px 20px 20px 20px;
}
.crd-main-prt {
    border: none!important;
    margin-top: 20px;
    background: none!important;
}
.rounded-circle {
    border-radius: 50%!important;
    margin-right: 10px;
}
.offcanvas-title {
    display: none;
}
.sear1{ position: absolute!important;
    right: 12px;
    top: 12px;}
.new1 {
    top: 8%;
    left: -1%;
    color: #fff;
    background-color: #f57b32!important;
    font-family: sans-serif;
    border-radius: 7px 7px 7px 7px;
}
#blog-sidebar {
    display: inline-flex!important;
    margin-top: 40px;
}
.btn-close1 {
    display: none;
}
.btn12 {
    padding: 7px 16px;
    margin-left: 0px;
}
.btn12:hover {
    color: #fff!important;
    background-color: #a6a8a9!important;
    border-color: #a6a8a9!important;
}
.crd-bdy h5 a {
    color: #ea6647;
    margin-left: -1px;
    margin-top:0;
}
.crd-bdy a {
    margin-top: -10px;
    margin-left: -6px;
}

.crd-bdy h3 a {
    color: #747272;
    font-size: 22px;
    margin-left: -17px;
    margin-top: 0;
}
.crd-bdy p {
    margin-top: 0px;
    
}
.spon {
    color: #fff;
    font-family: sans-serif;
  

}
.blog-pagi{margin-bottom:20px;}
.form-control1 {
    /* border-radius: 20px; */
    border: none;
}
.form-select1 {
    display: block;
    width: 100%;
    padding: .575rem 2.53125rem .575rem 1.125rem;
    -moz-padding-start: calc(1.125rem - 3px);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #454056;
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23454056' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1.125rem center;
    background-size: 16px 12px;
    border: 1px solid #d5d2dc;
    border-radius: .5rem;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0);
    transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
.offcanvas-body {
    display: block !important;
    height: 100%;
}
.nme1 {
    color: #e66c43;
}
.page-item.active>.page-link {
    font-weight: bold;
    border-radius: 50%;
    cursor: default;
    background-color: #eb6840;
    border: none;
    height: 35px;
    width: 35px;
    text-align: center;
    line-height: 22px;
}
.me-2 {
    margin-right: 0.5rem !important;
}
.mb-2 {
    margin-bottom: 0.5rem !important;
}
.pagination {
    --fi-pagination-padding-x: 0.475rem;
    --fi-pagination-padding-y: 0;
    --fi-pagination-font-size: 1rem;
    --fi-pagination-color: #454056;
    --fi-pagination-bg: transparent;
    --fi-pagination-border-width: 1px;
    --fi-pagination-border-color: transparent;
    --fi-pagination-border-radius: 0.5rem;
    --fi-pagination-hover-color: #fd5631;
    --fi-pagination-hover-bg: transparent;
    --fi-pagination-hover-border-color: transparent;
    --fi-pagination-focus-color: var(--fi-link-hover-color);
    --fi-pagination-focus-bg: transparent;
    --fi-pagination-focus-box-shadow: none;
    --fi-pagination-active-color: #fff;
    --fi-pagination-active-bg: #fd5631;
    --fi-pagination-active-border-color: transparent;
    --fi-pagination-disabled-color: rgba(69, 64, 86, 0.4);
    --fi-pagination-disabled-bg: transparent;
    --fi-pagination-disabled-border-color: transparent;
    display: flex;
    padding-left: 0;
    list-style: none;
}
.page-item {
    margin: 0 0.25rem;
}
.page-link1 {
    position: relative;
    display: block;
    padding: 0.5rem 0.75rem;
    margin-left: -1px;
    line-height: 1.25;
    color: #eb6840;
    background-color: none;
    border: none;
}
.page-link1>i {
    display: inline-block;
    margin-top: -0.125rem;
    vertical-align: middle;
    font-size: .7em;
}
.form-group.rounded-pill, .form-group.rounded-xl-pill, .form-group.rounded-lg-pill, .form-group.rounded-md-pill, .form-group.rounded-sm-pill {
    padding-left: 0.75rem;
}
.input-group1 {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    width: 76%;
}
.visually-hidden, .visually-hidden-focusable:not(:focus):not(:focus-within) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}
.btn-primary1 {
    position: relative;
    color: #fff;
    background: #eb6345;
    border-color: #f36148;
}
.btn-primary1:hover{
  color:#eb6345!important;
  background:#fff!important;
}
/* .form-group {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid #efecf3;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 0.125rem 0.125rem -0.125rem rgba(31,27,45,.08), 0 0.25rem 0.75rem rgba(31,27,45,.08);
} */
.cate1 {
    padding-top: 5px!important;
    padding-bottom: 5px!important;
    color: #7f7b7b;
}
.cate1:hover{color:#ea6647;}
.rounded-pill {
    border-radius: 50rem !important;
}
.privacy1 {
    text-decoration: underline;
    color: #e96848;
}
.privacy1:hover{
  text-decoration: none;
      color: #e96848;
}
.input-group>.form-control, .input-group>.form-select, .input-group>.form-floating {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0;
    background: none;

}

    /**************Ending of Blog-Part*************/
  </style>
<style type="text/css">
  .blog-slider-row{
    margin-top: -25px !important;
  }
 .blog-slider-row .blog-slider {
  width: 100%;
  max-height: 100%;
  height: 516px !important;
  margin-top:-25px !important;
}

.blog-slider-row .item {
  width: 200px;
  height: 300px;
  list-style-type: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  background-position: center;
  background-size: cover;
  border-radius: 20px;
  box-shadow: 0 20px 30px rgba(255,255,255,0.3) inset;
  transition: transform 0.1s, left 0.75s, top 0.75s, width 0.75s, height 0.75s;

  &:nth-child(1), &:nth-child(2) {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform: none;
    border-radius: 0;
    box-shadow: none;
    opacity: 1;
  }

  &:nth-child(3) { left: 50%; }
  &:nth-child(4) { left: calc(50% + 220px); }
  &:nth-child(5) { left: calc(50% + 440px); }
  &:nth-child(6) { left: calc(50% + 660px); opacity: 0; }
}

.blog-slider-row .content {
  width: min(30vw,400px);
  position: absolute;
  top: 50%;
  left: 3rem;
  transform: translateY(-50%);
  font: 400 0.85rem "Ubuntu Condensed" !important;
  color: white;
  text-shadow: 0 3px 8px rgba(0,0,0,0.5);
  opacity: 0;
  display: none;

  & .title {
    font-family: "Ubuntu Condensed" !important;
    text-transform: uppercase;
  }

  & .description {
    line-height: 1.7;
    margin: 1rem 0 1.5rem;
    font-size: 0.8rem;
  }

  & button {
    width: fit-content;
    background-color: rgba(0,0,0,0.1);
    color: white;
    border: 2px solid white;
    border-radius: 0.25rem;
    padding: 0.75rem;
    cursor: pointer;
  }
}

.blog-slider-row .item:nth-of-type(2) .content {
  display: block;
  animation: show 0.75s ease-in-out 0.3s forwards;
}

@keyframes show {
  0% {
    filter: blur(5px);
    transform: translateY(calc(-50% + 75px));
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}

.blog-slider-row .nav {
  position: absolute;
  bottom: 2rem;
  right: 6%;
  transform: translateX(-50%);
  z-index: 5;
  user-select: none;

  & .btn {
    background-color: rgba(255,255,255,0.5);
    color: rgba(0,0,0,0.7);
    border: 2px solid rgba(0,0,0,0.6);
    margin: 0 0.25rem;
    padding: 0.75rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background-color: rgba(255,255,255,0.3);
    }
  }
}

@media (width > 650px) and (width < 900px) {
  .blog-slider-row .content {
    & .title        { font-size: 1rem; }
    & .description  { font-size: 0.7rem; }
    & button        { font-size: 0.7rem; }
  }
  .blog-slider-row .item {
    width: 160px;
    height: 270px;

    &:nth-child(3) { left: 50%; }
    &:nth-child(4) { left: calc(50% + 170px); }
    &:nth-child(5) { left: calc(50% + 340px); }
    &:nth-child(6) { left: calc(50% + 510px); opacity: 0; }
  }
}

@media (width < 650px) {
  .blog-slider-row .content {
    & .title        { font-size: 0.9rem; }
    & .description  { font-size: 0.65rem; }
    & button        { font-size: 0.7rem; }
  }
  .blog-slider-row .item {
    width: 130px;
    height: 220px;

    &:nth-child(3) { left: 50%; }
    &:nth-child(4) { left: calc(50% + 140px); }
    &:nth-child(5) { left: calc(50% + 280px); }
    &:nth-child(6) { left: calc(50% + 420px); opacity: 0; }
  }
}
</style>

<script type="text/javascript">
  var wbpage='blogs';
  const slider = document.querySelector('.slider');
  setTimeout(function(){
    var cimg='https://www.sikshapedia.com/public/data/app/app_data/way2a.png?tr=h-50,w-50,c-force';
    var _cname='Sikshapedia';
    $('#reg3ApplyModal').find('.img_logo').attr('src',cimg);
    $('#reg3ApplyModal').find('.img_logo').attr('alt',_cname);
    $('#reg3ApplyModal').find('.media-body').html('Register Now To Apply<br>'+_cname);
    $('#reg3ApplyModal').find('#sayCarousol').hide();
    $('#reg3ApplyModal').find('#applicant_aut_source').val('blog_page');
    $('#reg3ApplyModal').find('#_applicant_aut_source').val('blog_page');
    $('#reg3ApplyModal').modal('show');
  },5000);

function activate(e) {
  const items = document.querySelectorAll('.item');
  e.target.matches('.next') && slider.append(items[0])
  e.target.matches('.prev') && slider.prepend(items[items.length-1]);
}

document.addEventListener('click',activate,false);


</script>
