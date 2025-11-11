
<div class="jsx-2085888330 nps-banner bg-white my-4 p-4 card" id="div_rating_card">
    <p class="jsx-198376327 text-center mt-4 mb-10 h2 font-weight-bold">How likely are you to recommend Sikshapedia.com to a friend or a college?</p>

    <div class="rating d-flex justify-content-around mx-1" style="margin-top:2px;text-align:center;">

        <div class="row form-row">
            <div class="jsx-779922922 card-body px-4 py-3 show-min" style="text-align:center;">
                <select id="example-1to10" name="rating"  autocomplete="off">
                  <option value=""></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
            </div>

            <hr class="jsx-779922922 mt-3 mb-3">
            <div class="jsx-779922922 card-body px-4 py-3 show-min" style="display: none;" id="features_to_imporve">
                <p class="jsx-198376327 text-center mb-5 h4 font-weight-bold">What feature do you think we need to improve the most on?</p>
                <div class="jsx-198376327 md-radio md-radio-inline radio_wrapper text-base d-flex align-items-center justify-content-center mb-5 mt-10" style="margin-top:2px;">
                
                    <label class="jsx-198376327 radio_container mx-2 d-flex align-items-center">
                        <span class="jsx-198376327">Website Design</span>&nbsp;
                        <input name="reason" type="radio" id="Website Design" class="jsx-198376327 reason_radio" value="Website Design"><span class="jsx-198376327 checkmark"></span>
                    </label>
                    <label class="jsx-198376327 radio_container mx-2 d-flex align-items-center">
                        <span class="jsx-198376327">Content Accuracy</span>&nbsp;
                        <input name="reason" type="radio" id="Content Accuracy" class="jsx-198376327 reason_radio" value="Content Accuracy"><span class="jsx-198376327 checkmark"></span>
                    </label>
                    <label class="jsx-198376327 radio_container mx-2 d-flex align-items-center">
                        <span class="jsx-198376327">Content Quality</span>&nbsp;
                        <input name="reason" type="radio" id="Content Quality" class="jsx-198376327 reason_radio" value="Content Quality" checked="checked"><span class="jsx-198376327 checkmark"></span>
                    </label>
                    <label class="jsx-198376327 radio_container mx-2 d-flex align-items-center">
                        <span class="jsx-198376327">Readability</span>&nbsp;
                        <input name="reason" type="radio" id="Readability" class="jsx-198376327 reason_radio" value="Readability"><span class="jsx-198376327 checkmark"></span>
                    </label>
                    <label class="jsx-198376327 radio_container mx-2 d-flex align-items-center"><span class="jsx-198376327">Website Load Time</span>&nbsp;
                        <input name="reason" type="radio" id="Website Load Time" class="jsx-198376327 reason_radio" value="Website Load Time"><span class="jsx-198376327 checkmark"></span>
                    </label>
                    <label class="jsx-198376327 radio_container mx-2 d-flex align-items-center"><span class="jsx-198376327">Other</span>
                    &nbsp;<input name="reason" type="radio" id="Other" class="jsx-198376327 reason_radio" value="Other"><span class="jsx-198376327 checkmark"></span>
                    </label>
                </div>
                <div class="jsx-198376327 md-radio md-radio-inline radio_wrapper text-base d-flex align-items-center justify-content-center mb-5 mt-10" style="margin-top:2px;">
                    <form id="form_wayto_rating" novalidate="novalidate" style="width:100%;">
                        <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">
                        <div class="alert alert-info" style="text-align:center;display: none;" id="reason_msg">Please select reason for your valuable comment.</div>
                        <div class="col-sm-12">             
                            <div class="form-group">
                              <textarea class="form-control" rows="5" name="rating_comment"></textarea>
                            </div>
                        </div>
                        <div class="col-sm-12">         
                            <div class="form-group">
                                 <button class="btn btn-warning pull-right" typ[e="submit" id="btn_rating_comment">Submit</button>                                                              
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="jsx-2085888330 nps-banner bg-white my-4 p-4 card alert alert-success" style="background-color:#27e352;display:none;" id="rating_msg">
    <p class="jsx-198376327 text-center mt-4 mb-10 h3 font-weight-bold"></p>
</div>


<style type="text/css">
    .rating {
      margin-top: 40px;
      border: none;
      float: left;
    }

.bubble {
    width: 48px;
    height: 48px;
    font-size: 11px;
    
}

.text-lg {
    font-size: 1rem;
}

.stars_radio-input {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 1px;
    height: 1px;
    clip: rect(1px, 1px, 1px, 1px);
}

.rating > label {
  color: #90A0A3;
  float: right;
}

.rating > label > div {
  color: #90A0A3;
  float: right;
  border-radius: 50%;
    border: 1px solid #ccc;
}

.rating > label:before {
  margin: 5px;
  font-size: 2em;
  font-family: FontAwesome;
  display: inline-block;
}

.rating > input {
  display: none;
}


.rating > input:checked ~ label > div,
.rating:not(:checked) > label > div:hover,
.rating:not(:checked) > label + div:hover ~ label + div {
    background-color: rgb(255, 121, 0);
    color: rgb(255, 255, 255);
}

.rating > input:checked + label > div:hover,
.rating > input:checked ~ label > div:hover,
.rating > label > div:hover ~ input:checked ~ label > div,
.rating > input:checked ~ label + div:hover ~ label + div {
   background-color: rgb(255, 121, 0);
   color: rgb(255, 255, 255);
}
</style>



<!-- <style type="text/css">
   .ml-1, .mx-1 {
    margin-left: 0.25rem;
}
.mr-1, .mx-1 {
    margin-right: 0.25rem;
}
.pointer {
    cursor: pointer;
}
.justify-content-around {
    -webkit-box-pack: space-around;
    -webkit-justify-content: space-around;
    -ms-flex-pack: space-around;
    justify-content: space-around;
}
.d-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}
.position-relative {
    position: relative;
}
.align-items-center {
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.flex-column {
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}
.npm-form.jsx-198376327 .stars_radio-input.jsx-198376327 {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 1px;
    height: 1px;
    clip: rect(1px, 1px, 1px, 1px);
}
input[type="radio"], input[type="checkbox"] {
    box-sizing: border-box;
    padding: 0;
}


button, input {
    overflow: visible;
}

.npm-form.jsx-198376327 .stars_radio-input.jsx-198376327 {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 1px;
    height: 1px;
    clip: rect(1px, 1px, 1px, 1px);
}

.npm-form.jsx-198376327 .bubble.jsx-198376327 {
    width: 20px;
    height: 20px;
    font-size: 11px;
}
.npm-form.jsx-198376327 .bubble.active.jsx-198376327 {
    background-color: rgb(255, 121, 0);
    color: rgb(255, 255, 255);
}
.align-items-center {
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

#rating_div > input:checked ~ div,
#rating_div:not(:checked) > div:hover,
#rating_div:not(:checked) > div:hover ~ div {
  background-color: rgb(255, 121, 0);
    color: rgb(255, 255, 255);
}

#rating_div > input:checked + div:hover,
#rating_div > input:checked ~ div:hover,
#rating_div > div:hover ~ input:checked ~ div,
#rating_div > input:checked ~ div:hover ~ div {
  color: #FECE31;
}

</style> -->



<style>
    
    .br-theme-bars-1to10 .br-widget {
  height: 50px;
  white-space: nowrap;
}
.br-theme-bars-1to10 .br-widget a {
  display: block;
  width: 60px;
  padding: 10px 0;
  height: 60px;
  float: left;
  background-color: #fbedd9;
  margin: 10px;
  text-align: center;
  border-radius:50%
}
.br-theme-bars-1to10 .br-widget a.br-active,
.br-theme-bars-1to10 .br-widget a.br-selected {
  background-color: #f57b32;
}
.br-theme-bars-1to10 .br-widget .br-current-rating {
  font-size: 20px;
  line-height: 2;
  float: left;
  padding: 0 20px 0 20px;
  color: #EDB867;
  font-weight: 400;
}
.br-theme-bars-1to10 .br-readonly a {
  cursor: default;
}
.br-theme-bars-1to10 .br-readonly a.br-active,
.br-theme-bars-1to10 .br-readonly a.br-selected {
  background-color: #f2cd95;
}
.br-theme-bars-1to10 .br-readonly .br-current-rating {
  color: #f2cd95;
}
@media print {
  .br-theme-bars-1to10 .br-widget a {
    border: 1px solid #b3b3b3;
    background: white;
    height: 38px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .br-theme-bars-1to10 .br-widget a.br-active,
  .br-theme-bars-1to10 .br-widget a.br-selected {
    border: 1px solid black;
    background: white;
  }
  .br-theme-bars-1to10 .br-widget .br-current-rating {
    color: black;
  }
}


.rating-star {
    direction: rtl;
    font-size: 40px;
    unicode-bidi: bidi-override;
    display: inline-block;
}
.rating-star input {
    opacity: 0;
    position: relative;
    left: -30px;
    z-index: 2;
    cursor: pointer;
}
.rating-star span.star:before {
    color: #777777;
}
.rating-star span.star {
    display: inline-block;
    font-family: FontAwesome;
    font-style: normal;
    font-weight: normal;
    position: relative;
    z-index: 1;
}
.rating-star span {
    /*margin-left: -30px;*/
}
.rating-star span.star:before {
    color: #777777;
    content:"\f006";
}
.rating-star input:hover + span.star:before, .rating-star input:hover + span.star ~ span.star:before, .rating-star input:checked + span.star:before, .rating-star input:checked + span.star ~ span.star:before {
    color: #ffd100;
    content:"\f005";
}
 
.selected-rating{
    color: #ffd100;
    font-weight: bold;
    font-size: 42px;
}

/*.br-current-rating{
    display: none;
}*/
    
</style>



<script type="text/javascript">
    $(function() {
        $.validator.addMethod("alphanumericspace", function(value, element) {
            return this.optional(element) || /^[A-Za-z0-9\-\_\.\s]+$/i.test(value);
        }, "Letters, numbers,space,dashes,full stop and underscores only please");

        $('#example-1to10').barrating('show', {
            theme: 'bars-1to10',
            showValues: true,
            showSelectedRating: false,
            onSelect: function(value, text) {
                $('#features_to_imporve').css('display','block');
            }
        });


        $('#form_wayto_rating').validate({
            rules:{
                rating_comment:{
                    required:true,
                    alphanumericspace:true,
                    minlength:30,
                    maxlength:255
                }
            },
            messages:{
                rating_comment:{
                    required:'Enter your comment please',
                    minlength:'Minimum 30 charachters required',
                    maxlength:'Maximum 255 charachters allowed'
                }
            },
            submitHandler:function(){
                var reason=$('input[type=radio][name=reason]:checked').val();
                var rating=$('#example-1to10 :selected').val();
                //alert(rating);
                if(reason!=''){
                    $('#reason_msg').css('display','none');
                    var formdata=new FormData($('#form_wayto_rating')[0]);
                    formdata.append('rating_value',rating);
                    formdata.append('rating_reason',reason);
                    formdata.append([csrf_name],csrf_hash);
                    console.log(formdata);
                    $.ajax({
                        type:'POST',
                        url:base_url+'ratesite',
                        data:formdata,
                        dataType:'json',
                        cache: false,
                        contentType: false,
                        processData: false,
                        beforeSend:function(){
                          $('#btn_rating_comment').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
                        },
                        success:function(d){
                            if(d.success){
                                $('#rating_msg').css('display','block');
                                $('#rating_msg p').html(d.success);
                                $('#div_rating_card').css('display','none');
                                $('#btn_rating_comment').html('Submit').prop('disabled',false);

                                setTimeout(function(){
                                    $('#rating_msg').css('display','none');
                                },5500);
                            }else{
                                console.log(d);
                            }
                            
                        }
                    });
                }else{
                    $('#reason_msg').css('display','block');
                }
                   
            }
        });

        $('a[data-rating-value="1"]').html('1');
        $('a[data-rating-value="1"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="2"]').html('2');
        $('a[data-rating-value="2"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="3"]').html('3');
        $('a[data-rating-value="3"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="4"]').html('4');
        $('a[data-rating-value="4"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="5"]').html('5');
        $('a[data-rating-value="5"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="6"]').html('6');
        $('a[data-rating-value="6"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="7"]').html('7');
        $('a[data-rating-value="1"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="7"]').html('7');
        $('a[data-rating-value="7"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="8"]').html('8');
        $('a[data-rating-value="8"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="9"]').html('9');
        $('a[data-rating-value="9"]').css({'padding':'15px','color':'white'});
        
        $('a[data-rating-value="10"]').html('10');
        $('a[data-rating-value="10"]').css({'padding':'15px','color':'white'});
    });
</script>