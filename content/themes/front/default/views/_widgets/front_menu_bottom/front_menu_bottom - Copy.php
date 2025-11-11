<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($menues)){
	foreach ($menues as $key => $value) {
		?>
		<div class="col-6 col-lg-3 col-md-6 ">
			<div class="footer-links pt-3 pt-lg-5 pb-3">
			<h4><?php echo $value['menu_name'];?></h4>
			<?php
				if(!empty($value['sub_menues'])){
					?>
					<ul>
					<?php
						foreach ($value['sub_menues'] as $k => $v) {
							?>
							<li><i class="fa fa-chevron-right"></i> <a href="<?php echo $v['menu_link'];?>"><?php echo $v['menu_name'];?></a></li>
							<?php
						}
					?>
					</ul>
					<?php					
				}		
			?>
			</div>
		</div>
		<?php
	}
}
?>

