<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

 <li aria-haspopup="true" class="wsshopmyaccount"><a href="https://consultantregistration.ncriptech.com/login/"> ASSOCIATE LOGIN</a></li>

<?php
if(!empty($top_menues)){
    foreach ($top_menues as $key => $value) {
        ?>
        <li aria-haspopup="true" class="wsshopmyaccount"><a href="<?php echo $value['menu_link'];?>"> <?php echo $value['menu_name'];?></a></li>        
        <?php
    }
}
?>