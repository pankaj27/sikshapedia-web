<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="card userCard">
  <div class="card-header bg-white">
      <h5 class="m-0 d-inline">General Settings</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
    </div>
    <div class="card-body">
      <div class="filter-is-visible">
        <div class="forlerForm">
          <div class="isa-filter-block">
            <h4>Account Settings</h4>
            <ul class="isa-filter-content list nicescroll" tabindex="2" style="overflow: hidden; outline: none; font-size: 14px;">
              <li>
                 <label class=""><a href="<?php echo base_url();?>account/basic-info">Basic Info </a></label>
              </li>
              <li>
                 <label class=""><a href="<?php echo base_url();?>account/branding">Branding</a></label>
              </li>
            </ul>
          </div>
          <div class="isa-filter-block">
            <h4>Course</h4>
            <ul class="isa-filter-content list nicescroll" tabindex="2" style="overflow: hidden; outline: none;">
              <!-- <li>
                 <label class="">BACHELOR OF TECHNOLOGY - [21]</label>
              </li>
              <li>
                 <label class="">BACHELOR OF TECHNOLOGY - [21]</label>
              </li> -->
            </ul>
          </div>
        </div>
      </div>
    </div>
</div>