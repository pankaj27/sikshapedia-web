<section class="pageBannerSec" style="background-image: url(https://static.waytoadmissions.com/data/coupons/background.webp) ;">
      <div class="bradcumSec">
        <div class="wrapper">
             <div class="row">
                 <div class="col-md-8 mb-2 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">
                     <h4 class="m-0 text-center text-md-left text-uppercase">Get best deals & coupons on various brands on signup</h4>
                 </div>
                 <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-end">
                     <nav aria-label="breadcrumb">
                         <ol class="breadcrumb  m-0">
                         <li class="breadcrumb-item"><a href="<?php echo base_url();?>">Home</a></li>
                         <li class="breadcrumb-item active">Coupons</li>
                         </ol>
                     </nav>
                 </div>
             </div>
         </div>
        </div>
        <!-- <div class="pageSearchSec">
            <div class="pageSearchBox">
                <form>
                    <div class="row no-gutters">
                        <div class="col-md-2 col-sm-12 col-12 bgColor2">
                            <p class="secTitle"><small>Search by</small><br> Courses</p>
                        </div>
                        <div class="col-sm-8 ">
                            <input type="text" class="form-control form-control-lg" placeholder="Search">
                        </div>
                        <div class="col-sm-2">
                            <button class="btn btn-primary btn-block btn-lg">Search</button>
                        </div>
                    </div>
                </form>
            </div>
        </div> -->
  </section>


  <section class="searchSesultSec py-5">
    <div class="wrapper">
        <div class="row">
            <?php $this->widget->run('front_coupons_list_section',TRUE);?>
        </div>
        <!-- <div class="text-center"><a href="" class="btn-temp ">Explore All</a></div> -->
    </div>
</section>



<?php $this->widget->run('front_subscription_section',TRUE);?>

<script type="text/javascript">
    var wbpage ='coupons_page';
    var page='coupons_page';
    var _vtype='';
    var _c='';
</script>
