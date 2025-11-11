<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($top_menues)){
    ?>
    <div class="headertopleft clearfix">
        <div class="topNav clearfix" style="padding:10px 3px 0">
             
        <?php
        foreach ($top_menues as $key => $value) {
            ?>
            <a href="<?php echo $value['menu_link'];?>"><?php echo $value['menu_name'];?></a>
            
            <?php
        }
        ?>
    
        </div>
        
    </div>
    <?php
}
?>          