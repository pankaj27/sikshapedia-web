<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="card notificationCard mb-4">
    <div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
      <h5 class="m-0">SUBSCRIBE TO OUR NEWLETTER FORM</h5>
    </div>
    <div class="card-body">
        <form id="form_subscription">
          <div class="row">
             <div class="col-sm-12">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Enter your email" name="subscriber_email" id="subscriber_email" style="height:35px !important;">
                </div>
             </div>
             <div class="col-sm-12">
                <div class="form-group">
                  <input type="text" class="form-control" placeholder="Enter your phone no" name="subscriber_phone" id="subscriber_phone" style="height:35px !important;">
                </div>
             </div>
             <div class="col-sm-12">
                <div class="form-group">
                  <select class="form-control subscriber_course" name="subscriber_course" id="subscriber_course">
                  </select>
                </div>
             </div>
             <div class="col-sm-12">
                <div class="form-group">
                    <button class="btn btn-secondary btn-block" type="submit" id="btn_subscribe_newsletter">Submit</button>
                </div>
             </div>
          </div>
        </form>
    </div>                    
</div>

<style type="text/css">
 .chosen-container{
    z-index: 1800000;
  }
 .chosen-container-single{
    width: 100% !important;
    border-radius: 0px !important;
  }
.chosen-drop{
    max-height: 150px;
  }

.chosen-container ul.chosen-results {
    max-height: 108px !important;
  }

  .active-result .group-option .highlighted{
    background-color: #1b1f4c !important;
  }
</style>