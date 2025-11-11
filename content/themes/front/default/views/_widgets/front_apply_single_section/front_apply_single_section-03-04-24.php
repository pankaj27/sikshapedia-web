
<?php

if(!empty($college_data)){
	?>
	<button type="button" class="btn btn-lg btn-primary mb-3 btn-block  d-flex justify-content-between align-items-center apply" data-clogo="<?php echo $college_data['college_logo'];?>" data-cname="<?php echo $college_data['college_name'];?>,<?php echo $college_data['college_city'];?>" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['college_type'];?>" data-cphcode="<?php echo $college_data['college_country_phone_code'];?>" data-cou="<?php echo $college_data['college_country_id'];?>"><span>APPLY NOW </span> <i class="far fa-envelope"></i></button>
	<?php
}

?>

