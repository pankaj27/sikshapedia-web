jQuery(function($) {
	"use strict";

	$('.theiaStickySidebar').theiaStickySidebar({
		additionalMarginTop: 30,
		additionalMarginBottom: 30,
	});

	if(wbpage==='blog_details_page'){
		$.ajax({
			type:'POST',
			url:base_url+'recordvisits',
			data:{[csrf_name]:csrf_hash,visit_type:visit_type,visit_type_id:visit_type_id},
			success:function(d){}
		});
	}	

});