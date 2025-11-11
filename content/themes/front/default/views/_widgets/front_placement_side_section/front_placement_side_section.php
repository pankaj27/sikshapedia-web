<?php defined('BASEPATH') OR exit('No direct script access allowed');?>


<?php
if(!empty($college_placements)){

	?>
	<div class="card notificationCard mb-4">
		<div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  	<h5 class="m-0">Placements</h5>
		</div>
		<div class="card-body body-row bg-white py-2 d-flex flex-wrap">
			<div class="jsx-2872610573 jsx-3951915900 body-row bg-white px-3 py-2"><span class="jsx-2872610573 jsx-3951915900 pack common_title d-block"><span class="jsx-2872610573 jsx-3951915900 icon"><svg viewBox="0 0 13 21" xmlns="http://www.w3.org/2000/svg"><path d="M7.43 10.477v7.213l3.92-3.92c.306-.309.78-.309 1.058 0 .309.277.309.752 0 1.058l-5.175 5.175a.727.727 0 01-.548.196.73.73 0 01-.55-.196L.962 14.828c-.308-.306-.308-.78 0-1.058.277-.309.751-.309 1.058 0l3.92 3.92V3.263l-3.92 3.92c-.306.309-.78.309-1.058 0-.308-.276-.308-.752 0-1.058L6.136.95a.727.727 0 01.549-.196.73.73 0 01.548.196l5.175 5.175c.309.306.309.78 0 1.059-.277.308-.751.308-1.058 0l-3.92-3.92v7.213z" stroke="transparent"></path></svg></span> Highest Package</span><span class="jsx-2872610573 jsx-3951915900 value font-weight-bold text-uppercase text-lg text-success d-flex align-items-center"><span class="jsx-2872610573 jsx-3951915900 icon icon-success"><svg width="4" height="6" viewBox="0 0 4 6" xmlns="http://www.w3.org/2000/svg"><path d="M.532 1.356l-.14.434h1.771a.75.75 0 01-.294.448c-.224.154-.56.238-1.001.238H.441v.511c.168 0 .322.049.462.14.119.084.238.203.357.364L2.513 5.15h1.036L2.051 3.253a3.533 3.533 0 00-.329-.378c.371-.077.672-.224.896-.448.168-.175.266-.385.308-.637h.749l.147-.434H2.94a1.462 1.462 0 00-.308-.77h1.043l.14-.434H.525L.378.586h.728c.35 0 .616.077.798.238a.833.833 0 01.273.532H.532z" fill-rule="evenodd"></path></svg></span> 3,000,000</span></div>
			<?php
			foreach ($college_placements as $key => $value){
				?>
				<div class="col-4 col_6 text-center">
					<img data-src="<?php echo $value['company_image'];?>" src="<?php echo $value['company_image'];?>" alt="<?php echo $value['company_name'];?>" height="50px" class="image ls-is-cached lazyloaded" style="display: flex;justify-content: center;margin-left: auto;margin-right: auto; width: 60%;vertical-align: middle;">
				</div>
				<?php
			}
			?>					
		</div>
	</div>
	<?php
}
?>


<style type="text/css">
	.body.jsx-2872610573 .body-row.jsx-2872610573 {
	    border-bottom: solid 1px rgba(0,0,0,0.07);
	}

	.pb-2, .py-2 {
	    padding-bottom: 0.5rem;
	}
	.pt-2, .py-2 {
	    padding-top: 0.5rem;
	}
	.flex-wrap {
	    -webkit-flex-wrap: wrap;
	    -ms-flex-wrap: wrap;
	    flex-wrap: wrap;
	}
	.d-flex {
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: -ms-flexbox;
	    display: flex;
	}
	.bg-white {
	    background-color: #fff;
	}
	@media (min-width: 600px) and (max-width: 1100px)
	.col_6.jsx-2872610573 {
	    max-width: 50%;
	    -webkit-flex: 0 0 50%;
	    -ms-flex: 0 0 50%;
	    flex: 0 0 50%;
	}
	.text-center {
	    text-align: center;
	}
	.body.jsx-2872610573 .body-row.jsx-2872610573 .image {
    width: 100%;
    max-width: 100%;
    object-fit: cover;
}
img.jsx-2480469295 {
    height: 50px;
    width: 75px;
    max-height: 50px;
    max-width: 75px;
    overflow: hidden;
}
img {
    vertical-align: middle;
    border-style: none;
}
</style>