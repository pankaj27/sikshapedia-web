<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php $this->widget->run('front_college_page_header_section',$show_college_header_widget);?>




<section class="pageDetailsSec py-4">
    <div class="wrapper">
      <div class="row">          
        <div class="col-lg-12 mb-4 mb-lg-0">
          <div class="card userCard">
            <div class="card-header bg-white">
              <h5 class="m-0 d-inline">All Reviews</h5> <small id="user_type" class="form-text text-muted">You can update your branding details.It will be visible to the site visitor as college profile.</small>
            </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12" id="reviews_div">
                    <div class="alert alert-info"><h5>PLease wait while data is being loaded .....</h5></div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
  </div> 
</section>






<?php $this->widget->run('front_subscription_section',true);?>


<script type="text/javascript">var wbpage='';var _cid='<?php echo encode_data($college_id);?>';</script>