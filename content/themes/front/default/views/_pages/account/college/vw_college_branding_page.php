<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php $this->widget->run('front_college_page_header_section',$show_college_header_widget);?>


  <section class="pageDetailsSec py-4">
      <div class="wrapper">
        <div class="row">
          
          <div class="col-lg-9 mb-4 mb-lg-0">
            <?php $this->widget->run('front_college_branding_edit_section',$show_college_branding_edit_widget);?>
          </div>
          <div class="col-lg-3 mb-3 mb-lg-0">
          </div>
        </div>
    </div> 
  </section>

   <?php $this->widget->run('front_subscription_section',true);?>

  <script type="text/javascript">
    var wbpage='brandingpage';
  </script>

  <style type="text/css">
  .description.ytcp-profile-image-upload {
    font-family: "Roboto", "Noto", sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    font-size: 13px;
    line-height: 20px;
  }

    .card__image.loading {
        height: 40px;
        width: 40px;
        margin-right: 5px !important;
        background: #d3d3d370;
        background-repeat: repeat-y;
        background-size: 40px 40px;
        background-position: 0 0;
    }
   .skeleton-loader:empty {
  width: 100%;
  height: 15px;
  display: block;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%
    ),
    lightgray;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  animation: shine 1s infinite;
}

@keyframes shine {
  to {
    background-position: 100% 0;
  }
}

  </style>