jQuery(function($) {
  "use strict";

  loadStates();

  function loadStates(){
  	var f_data 	= 	new Array(country,'checkbox');
    var ctext 	= 	CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
  	$.ajax({
  		type:'POST',
  		url:base_url+'get_states',
  		data:{ctext:ctext,csrf_test_name:csrf_hash},
  		success:function(d){
  			$('#filter_states').html(d.html);
  		}
  	});
  }

});