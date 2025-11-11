
<?php
if(!empty($menu_data)){
    ?>
    <div class="jsx-2323360048 jsx-4014918629 jsx-3951915900">
        <div class="jsx-626553351 card my-4 bg-white">
            <div class="jsx-626553351 default-header default_bg_color d-flex align-items-center pl-4">You can also check</div>
            <div class="jsx-626553351 default_body">
                <ul class="jsx-2323360048 jsx-4014918629 jsx-3951915900 list-unstyled mb-0">
                    <?php
                    foreach ($menu_data as $key => $value) {
                        ?>
                        <li class="jsx-2323360048 jsx-4014918629 jsx-3951915900 sidebar-single-elem border-bottom py-2 px-3">
                            <a class="jsx-2323360048 jsx-4014918629 jsx-3951915900 media text-decoration-none" href="<?php echo $value['menu_link'];?>">
                                <div class="jsx-2323360048 jsx-4014918629 jsx-3951915900 media-body font-weight-semi pointer"><p class="jsx-2323360048 jsx-4014918629 jsx-3951915900 mb-0 common_title"><?php echo $value['menu_name'];?></p></div>
                            </a>
                        </li>
                        <?php
                    }
                    ?>
                </ul>
            </div>
        </div>
    </div> 
    <?php
}
?>

