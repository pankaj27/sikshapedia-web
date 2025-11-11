<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charSet="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale=1.0, maximum-scale=2.0, user-scalable=yes, shrink-to-fit=no" />
		<meta name="msvalidate.01" content="38578E85AE92887F09CF3D2A62F5AF0B" />
		<link rel="dns-prefetch" href="<?php echo base_url();?>">
		<link rel="canonical" href="<?php echo decode_data($current_url);?>">
		<link rel="preload" href="<?php echo $system_logo;?>">
		<link rel="preload" href="<?php echo $system_logo_small;?>">
		<link rel="preconnect" href="//www.google-analytics.com">
		<?php
		if($default_country_data->country_iso_code_4==='in'){
			$hreflang_link=base_url();
		}else{
			$hreflang_link=base_url($default_country_data->country_iso_code_4);
		}
		?>
		<link rel="alternate" href="<?php echo $hreflang_link;?>" hreflang="<?php echo $default_country_data->country_lang;?>" />
		<?php $this->widget->run('front_meta_preload_section',TRUE);?>
		<title><?php echo Events::trigger('the_title', $title, 'string');?></title>
		<meta name="title" content="<?php echo $title;?>" />
		<script type="application/ld+json">
		  <?php echo $system_application_json_ld;?>
		  	<?php
			if(isset($page_structure_data) && !empty($page_structure_data)){
			  foreach ($page_structure_data as $key => $value) { 
			  	echo trim(strip_whitespace($value->slug_type_json_ld_data));
			  }
			}
			?>
		</script>
		<?php echo add_csrf_meta();?>
  		<?php echo @$metadata; ?>
  		<script type="text/javascript">var base_url='<?php echo base_url();?>';var wb_api='<?php echo API_URL;?>';var csrf_name='<?php echo $csrf['name'];?>';
        var csrf_hash='<?php echo $csrf['hash'];?>';var _xtYu='<?php echo $security_token;?>';
    	</script>
    	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
		<?php echo @$css_files; ?>

    	<style type="text/css">
    	.progress-wrap{position:fixed;right:50px;bottom:50px;height:46px;width:46px;cursor:pointer;display:block;border-radius:50px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.2);z-index:10000;opacity:0;visibility:hidden;transform:translateY(15px);-webkit-transition:.2s linear;transition:.2s linear}.progress-wrap::after,.progress-wrap::before{position:absolute;content:'↑';text-align:center;line-height:46px;font-size:24px;left:0;top:0;height:46px;width:46px;cursor:pointer;-webkit-transition:.2s linear;display:block}.progress-wrap.active-progress{opacity:1;visibility:visible;transform:translateY(0)}.progress-wrap::after{color:#e8522e;z-index:1;transition:.2s linear}.progress-wrap:hover::after{opacity:0}.progress-wrap::before{opacity:0;background-image:linear-gradient(298deg,#da2c4d,#f8ab37);-webkit-background-clip:text;-webkit-text-fill-color:transparent;z-index:2;transition:.2s linear}.progress-wrap:hover::before{opacity:1}.progress-wrap svg path{fill:none}.progress-wrap svg.progress-circle path{stroke:#1b1f4c;stroke-width:4;box-sizing:border-box;-webkit-transition:.2s linear;transition:.2s linear}.card__image.loading{height:40px;width:40px;margin-right:5px!important;background:0 0/40px 40px repeat-y #d3d3d370}.skeleton-loader{width:100%;height:15px;display:block;margin-bottom:5px!important;background:linear-gradient(to right,rgba(255,255,255,0),rgba(255,255,255,.5) 50%,rgba(255,255,255,0) 80%),#d3d3d3;background-repeat:repeat-y;background-size:50px 500px;background-position:0 0;animation:2s infinite shine}@keyframes shine{to{background-position:100% 0,0 0}}.skeleton-loader:empty{width:100%;height:15px;display:block;background:linear-gradient(to right,rgba(255,255,255,0),rgba(255,255,255,.5) 50%,rgba(255,255,255,0) 80%),#d3d3d370;background-repeat:repeat-y;background-size:50px 500px;background-position:0 0;animation:1s infinite shine}.isaMenu>.isaMenu-list>li .isaTliststy02 li a:hover{color:#f57b32;text-decoration:none}#footer{bottom:0}.isaMenu>.isaMenu-list>li .isaTliststy02 li a{font-weight:600!important}

    	.blur-text {filter: blur(5px); /* Adjust the blur amount as needed */color: black; /* Optional: Set a color for better visibility */}

    	</style>
    	<script type="text/javascript">
		    (function(c,l,a,r,i,t,y){
		        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
		        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
		        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
		    })(window, document, "clarity", "script", "ensidd8ecl");
		    var is_loggedin="<?php (session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id'))?'yes':'no';?>";
		</script>
		<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2842650819272111');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=2842650819272111&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
    	<?php echo @$js_files;?>
    	
	</head>
	<body>
		<?php echo @$layout;?>
	</body>
</html>