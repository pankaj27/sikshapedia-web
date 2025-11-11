@extends('layouts.dashboard')

@section('title', 'Videos')

@section('css')
    <style>
        .has-outline-now .video_options_edit_mode{display: inline-block !important}
        .has-outline-now .video_options_regular{display: none !important}
        .mb10 {
            margin-bottom: 10px;
            margin-top: 10px;
        }
    </style>
@endsection
@section('content')
    <section class="bg-light-body">

        <div class="container-fluid bg-white py-3">
            <div class="row">
                <div class="col-sm-8 col-md-9 col-lg-9 col-xl-10 d-flex ">
                    <form class="seach_form" id="formSearch">
                        <input type="text" name="q" id="q_param" class="form-control fs-14 filter_input" placeholder="Search" value="" />
                        <input type="hidden" name="action_type" id="action_type" value="do_filter" />
                        <button type="button" class="btn-submit-hallow fs-18" id="btn_iconify_span">
                          <span class="iconify" data-icon="bx:bx-search"></span>
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <div class="p-3 relative">

            <div id="videos_playlists_div">

                @if(!empty($_GET['q']))
                    @include('Videos.section_search_videos')
                @else
                    @include('Videos.section_non_search_videos')
                @endif

            </div>

            <!-- Offcanvas wrap -->
            <div id="mySidenav" class="sidenav">
                <div class="p-3 px-4">
                    <div class="row d-flex align-items-center">
                        <div class="col-10">
                            <h4 class="m-0">Settings</h4>
                        </div>
                        <div class="col-2 d-flex justify-content-end">
                            <a href="javascript:void(0)" class="closebtn btn-close-custom ms-auto">
                                <span class="iconify" data-icon="ci:close-big"></span>
                            </a>
                        </div>
                    </div>
                    <!-- ends row -->
                </div>

                <div class="edit_tabs_wrap">
                    <ul class="nav nav-pills nav-justified" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="et-edit-tab" data-bs-toggle="pill" data-bs-target="#pills-edit" type="button" role="tab" aria-controls="pills-edit" aria-selected="true">Edit</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="et-timeline-tab" data-bs-toggle="pill" data-bs-target="#pills-timeline" type="button" role="tab" aria-controls="pills-timeline" aria-selected="false">Timeline</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="et-share-tab" data-bs-toggle="pill" data-bs-target="#pills-share" type="button" role="tab" aria-controls="pills-share" aria-selected="false">Share</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="pills-tabContent"></div>
                </div>

            </div>
            <!-- Offcanvas wrap ends -->

        </div>

        <!-- ends p-3 relative -->

    </section>
@endsection

@section('other_sections')
    <!-- Offcanvas wrap -->
    <div id="mySidenav2" class="sidenav">
        <div class="p-3 px-4">
            <div class="row d-flex align-items-center">
                <div class="col-10">
                    <h4 class="m-0">Settings</h4>
                </div>
                <div class="col-2 d-flex justify-content-end">
                    <a href="javascript:void(0)" class="closebtn btn-close-custom ms-auto" onclick="closeNav2()">
                        <span class="iconify" data-icon="ci:close-big"></span>
                    </a>
                </div>
            </div>
            <!-- ends row -->
        </div>

        <div class="edit_tabs_wrap">
            <ul class="nav nav-pills nav-justified" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="et-edit-tab" data-bs-toggle="pill" data-bs-target="#pills-edit" type="button" role="tab" aria-controls="pills-edit" aria-selected="true">Edit</button>
                </li>
                <!-- <li class="nav-item" role="presentation">
                    <button class="nav-link" id="et-timeline-tab" data-bs-toggle="pill" data-bs-target="#pills-timeline" type="button" role="tab" aria-controls="pills-timeline" aria-selected="false">Timeline</button>
                </li> -->
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="et-share-tab" data-bs-toggle="pill" data-bs-target="#pills-share" type="button" role="tab" aria-controls="pills-share" aria-selected="false">Share</button>
                </li>
            </ul>
            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane p-3 fade show active" id="pills-edit" role="tabpanel" aria-labelledby="et-edit-tab">
                    <!-- <form id="form_edit_playlist"> -->
                        <input type="hidden" name="playlist_id" id="playlist_id" value="">
                       <div class="mb-4" style="margin-top: 10px ">

                            <div class="formfield mb-3" id="videoTitlefield">
                                <input type="text" name="playlist_title" id="playlist_title" required value="">
                                <label alt="Email" for="playlist_title" placeholder="Video Title">Playlist Name</label>
                            </div>

                            <div class="formfield mb-3" id="videoTitlefield">
                                <input type="text" name="playlist_label" id="playlist_label" required value="">
                                <label alt="Email" for="playlist_label" placeholder="Add Label">Add Label</label>
                            </div>
                        </div>



                        <div class="row d-flex align-items-center mb-4">
                            <div class="col-sm-6">
                                <button type="button" class="btn btn-primary text-uppercase letter-spacing-sm mb-1 me-2" id="btn_update_video_playlist">Save</button>
                                <!-- <button type="button" class="closebtn btn btn-muted text-uppercase letter-spacing-sm mb-1 me-2">Cancel</button> -->
                            </div>
                            <div class="col-sm-6 d-flex justify-content-sm-end">
                                <button type="button" class="btn btn-danger-texted text-uppercase letter-spacing-sm mb-1 me-2" data-bs-toggle="modal" data-bs-target="#delete-playlist-Modal">Delete Playlist</button>
                            </div>
                        </div> 
                    <!-- </form> -->
                    <div class="scroll">
                        <div class="playListTabsContent">
                            <div id="playListTab1" style="">
                              <div id="play_list" style="display: block;">
                              </div>
                            </div>
                              
                        </div>
                    </div>
                </div>
                <div class="tab-pane p-3 fade" id="pills-share" role="tabpanel" aria-labelledby="et-share-tab">
                    <div class="mb-4 mt-4">
                    


                    <div class="mb-3">
                        <div class="row align-items-center">
                            <div class="col-sm-6">
                                <label class="d-block mb-2 mb-sm-0 fw-medium">Admins</label>
                            </div>
                            <div class="col-sm-6">
                                <div class="formfield mb-3" id="teamtype-field">
                                    <select class="form-select has-triangle-chev">
                                        <option>Can edit</option>
                                        <option>Can view</option>
                                        <option>No access</option>
                                    </select>
                                    <label alt="Permissions" for="team-type-field" placeholder="Permissions">Permissions</label>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="mb-3">
                        <div class="row align-items-center">
                            <div class="col-sm-6">
                                <label class="d-block mb-2 mb-sm-0 fw-medium">Users</label>
                            </div>
                            <div class="col-sm-6">
                                <div class="formfield mb-3" id="teamtype-field">
                                    <select class="form-select has-triangle-chev">
                                        <option>Can edit</option>
                                        <option>Can view</option>
                                        <option>No access</option>
                                    </select>
                                    <label alt="Permissions" for="team-type-field" placeholder="Permissions">Permissions</label>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                </div>
            </div>
        </div>

    </div>
    <!-- Offcanvas wrap ends -->
    <!-- Modal -->
    <div class="modal fade" id="delete-video-Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body p-4">
                    <p class="lead color-dark-6">
                        Are you sure you want to permanently delete this video?
                    </p>
                </div>
                <div class="d-flex justify-content-end px-4">
                    <p class="lead d-inline-block color-bright-blue c-pointer" data-bs-dismiss="modal">
                        No
                    </p>
                    <p class="lead d-inline-block color-bright-blue c-pointer ms-5 btn_delete_parmanent" >
                        Yes
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="delete-playlist-Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body p-4">
                    <p class="lead color-dark-6">
                        Are you sure you want to permanently delete this playlist?
                    </p>
                </div>
                <div class="d-flex justify-content-end px-4">
                    <p class="lead d-inline-block color-bright-blue c-pointer btn_close_playlist_modal" data-bs-dismiss="modal">
                        No
                    </p>
                    <p class="lead d-inline-block color-bright-blue c-pointer ms-5 btn_delete_playlist_parmanent" >
                        Yes
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="delete-timeline-Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body p-4">
                    <p class="lead color-dark-6">
                        Are you sure you want to permanently delete this timeline?
                    </p>
                </div>
                <div class="d-flex justify-content-end px-4">
                    <p class="lead d-inline-block color-bright-blue c-pointer" data-bs-dismiss="modal">
                        No
                    </p>
                    <p class="lead d-inline-block color-bright-blue c-pointer ms-5 btn_delete_timeline" >
                        Yes
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="cancel-upload-Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <input type="hidden" class="delete_video_id" >
            <div class="modal-content">
                <div class="modal-body p-4">
                    <p class="lead color-dark-6">
                        Are you sure you want to cancel this upload?
                    </p>
                </div>
                <div class="d-flex justify-content-end px-4">
                    <p class="lead d-inline-block color-bright-blue c-pointer" data-bs-dismiss="modal">No</p>
                    <p class="lead d-inline-block color-bright-blue c-pointer ms-5 btn_confirm_cancel">Yes</p>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
     <script type="text/javascript">
        var video_ids="{{$video_ids}}";
    </script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js"></script>
   
    <script type="text/javascript" src="https://bootstrap-tagsinput.github.io/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js"></script>

    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>


    </script>

    <script type="text/javascript">

        var current_id=0;

        //MobileFirst Implementation
        $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
        });

        $('body').on('click','.btn_edit_playlist',function(){
          var playlist_title=$(this).data('playlist_title');
          var playlist_id=$(this).data('playlist_id');

          //load_playlist_data(playlist_id);

          $('#playlist_title').val(playlist_title);
          $('#playlist_id').val(playlist_id);
        });

        $('body').on('click','#btn_update_video_playlist',function(){
            var playlist_title=$('#playlist_title').val();
            var playlist_label=$('#playlist_label').val();
            var playlist_id=$('#playlist_id').val();

            $.ajax({
              type:'POST',
              url:"{{url('videos/update_video_playlists_data')}}",
              data:{playlist_title:playlist_title,playlist_label:playlist_label,playlist_id:playlist_id,'_token':'{{ csrf_token() }}'},
              beforeSend:function(){
                $('#btn_update_video_playlist').html('Updating').prop('disabled',true);
              },
              success:function(d){
                if(d.success){
                  $('#playlist_msg').html('<span class="alert alert-success" style="width:100%;">'+d.success+'</span>');
                  $('#h5_playlist_name'+playlist_id).html(playlist_title);
                  setTimeout(function(){
                    $('#playlist_msg').html('');
                  },1500);
                }else{
                  $('#playlist_msg').html('<span class="alert alert-danger" style="width:100%;">'+d.error+'</span>');
                   setTimeout(function(){
                    $('#playlist_msg').html('');
                  },1500);
                }
              },
              complete:function(xhr,status){
                $('#btn_update_video_playlist').html('Save').prop('disabled',false);
              }
            });
        });

        $('body').on('click','.btn_close_playlist_modal',function(){
            $('#delete-playlist-Modal').removeClass('show');
            $('.modal-backdrop').hide();
            $('.video_box_holder').removeClass('has-outline-now');
            $("#mySidenav2").removeClass("triggered");
        });

        $('body').on('click','.btn_delete_playlist_parmanent',function(){
            var playlist_id=$('#mySidenav2').find('#playlist_id').val();


            delete_playlist(playlist_id);
        });

        function delete_playlist(playlist_id){
            $.ajax({
              type:'POST',
              url:"{{url('videos/remove_video_playlists')}}",
              data:{playlist_id:playlist_id,'_token':'{{ csrf_token() }}'},
              beforeSend:function(){
                $('#btn_delete_playlist').html('Deleting').prop('disabled',true);
              },
              success:function(d){
                if(d.success){
                  $('#playlist_cell'+playlist_id).remove();
                  closeNav2();

                    $('.video_box_holder').removeClass('has-outline-now');
                    $("#mySidenav2").removeClass("triggered");

                    $('#delete-playlist-Modal').removeClass('show');
                    $('.modal-backdrop').hide();


                    $('.video_box_holder'+playlist_id).parent().remove();

                  if(d.video_playlists==0){
                    $('#playlistdiv_p_3').remove();
                  }
                }else{
                  
                }
              },
              complete:function(xhr,status){
                $('#btn_delete_playlist').html('Delete Playlist').prop('disabled',false);
              }
            });
        }

        function load_playlist_data(playlist_id){
            var vid_clip_html='';
            var vid_clip_htmld='';
            $.ajaxSetup({
              headers: {
                  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
              }
            });
            $.ajax({
              type:'POST',
              url:"{{url('videos/load_video_playlists_data')}}",
              data:{playlist_id:playlist_id,'_token':'{{ csrf_token() }}'},
              dataType:'json',
              beforeSend:function(){

                
              },
              success:function(d){
                if(d!=''){
                  $.each(d,function(i,item){
                    vid_clip_html+='<div class="d-flex justify-content-between playListTab1Child" id="playlistdiv'+item.playlist_clip_id+'">';
                      
                        vid_clip_html+='<div class="d-flex flex-column videoTitle" style="display: none;">';
                          vid_clip_html+='<h5>'+item.playlist_item_name+'</h5>';
                          vid_clip_html+='<h6>'+item.playlist_clip_time_formatted+'</h6>';
                        vid_clip_html+='</div>';
                        vid_clip_html+='<div class="d-flex justify-content-center align-items-center deleteIcon btn_delete_clip" data-vid_playlist_id="'+item.playlist_clip_id+'" onclick="remove_clip('+item.playlist_clip_id+','+item.playlist_id+')"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ant-design fs-24" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024" data-icon="ant-design:delete-outlined" style="color: rgb(215, 67, 77);"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>';
                        vid_clip_html+='</div>';
                      vid_clip_html+='</div>';
                  });
                }else{
                  vid_clip_html+='<div class="d-flex justify-content-center align-items-center noDataDiv"> <p id="noDataId">No data available</p> </div>';
                }

                $('#play_list').html(vid_clip_html);
              }
            });
          }

        function remove_clip(clip_id,playlist_id){
            $.ajaxSetup({
              headers: {
                  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
              }
            });

              $.ajax({
                type:'POST',
                url:"{{url('videos/delete_video_playlist_data')}}",
                data:{playlist_id:clip_id,playlists_id:playlist_id,'_token':'{{ csrf_token() }}'},
                success:function(d){
                  if(d.success){
                    $('#playlist_clip_count'+playlist_id).html(d.clips_count+' Clips');
                    if(d.clips_count==0){
                        delete_playlist(playlist_id);
                    }
                    load_playlist_data(playlist_id)
                  }
                }
              });
        }


        //MobileFirst Implementation




        $(document).on('click','.menu_video_action a', function(){

            $('.video_box_holder').removeClass('has-outline-now');

            var tab=$(this).data('tab');
            var id=$(this).closest('.video_box_holder').attr('data-id');

            var that=this;

            if(current_id == id){
                $('#'+tab).trigger('click');
                $("#mySidenav").addClass("triggered");

                return false;

            }else{
                current_id=id;
            }


            $.ajax({
                url: '{{url('/videos/get_video')}}',
                type: 'POST',
                dataType:'html',
                data: {
                    id:id,
                    '_method':'POST',
                    '_token':'{{ csrf_token()}}',
                    tab:tab
                },
                beforeSend:function(){
                },
                success: function($html) {

                    $("#pills-tabContent").html($html);

                    $(that).closest('.video_box_holder').addClass('has-outline-now');
                    $('#'+tab).trigger('click');

                    $("#mySidenav").addClass("triggered");

                    setTimeout(function(){
                        $('#'+tab).trigger('click');
                    }, 1000);

                },
                complement: function(){
                },
                error: function (jqXHR, exception) {

                }
            });

        })

        $(document).on('click','.closebtn',function(){
            $('.video_box_holder').removeClass('has-outline-now');
            $("#mySidenav").removeClass("triggered");

            show_time_line_icon();

        });

        $('.btn_delete_parmanent').click(function(){
            var id=$('.video_id').val();

            $.ajax({
                url: '{{url('/videos/delete_video')}}',
                type: 'POST',
                dataType:'json',
                data: {
                    id:id,
                    '_method':'POST',
                    '_token':'{{ csrf_token()}}',
                },
                beforeSend:function(){
                },
                success: function($html) {

                    $('.video_box_holder').removeClass('has-outline-now');
                    $("#mySidenav").removeClass("triggered");

                    $('#delete-video-Modal').modal('hide');

                    $('.video_box_holder[data-id="'+id+'"]').parent().remove();


                },
                complement: function(){
                },
                error: function (jqXHR, exception) {

                }
            });

        })

        $(document).on('click','.btn_update_video',function(){

            var id=$('.video_id').val();
            var title=$('#video-title-field').val();
            var tags=$('.input_tags').val();
            var fixture_id=$('select[name="fixture_id"]').val();

            $.ajax({
                url: '{{url('/videos/update_video')}}',
                type: 'POST',
                dataType:'json',
                data: {

                    id:id,
                    title:title,
                    tags:tags,
                    fixture_id:fixture_id,

                    '_method':'POST',
                    '_token':'{{ csrf_token()}}',

                },
                success: function($html) {

                    $('.video_box_holder').removeClass('has-outline-now');
                    $("#mySidenav").removeClass("triggered");

                    $('.video_box_holder[data-id="'+id+'"]').find('.div_video_title').html(title);
                    $('.video_box_holder[data-id="'+id+'"]').find('.video_tags_container').html('');

                    var tags_arr = tags.split(',');

                    for(var i=0; i< tags_arr.length; i++){
                        $('.video_box_holder[data-id="'+id+'"]').find('.video_tags_container').append('<span class="badge badge-pink mb-1 me-1">'+tags_arr[i]+'</span>');
                    }

                    show_time_line_icon();

                }
            });

        })

        function show_time_line_icon(){
            if($('.time_lines .timeline-row').length > 0){
                $('.video_box_holder[data-id="'+current_id+'"]').find('.time_line_added').show();
            }else{
                $('.video_box_holder[data-id="'+current_id+'"]').find('.time_line_added').hide();
            }
        }


        var del_time_line_id=0;
        var del_time_line_path='';
        $(document).on('click','.delete_time_line',function(){
            del_time_line_id=$(this).attr('data-id');
            del_time_line_path=$(this).attr('data-path');
            $('#delete-timeline-Modal').modal('show')
        });

        $('.btn_delete_timeline').click(function(){

            $.ajax({
                url: '{{url('/videos/delete_time_line')}}',
                type: 'POST',
                dataType:'json',
                data: {
                    id:del_time_line_id,
                    path:del_time_line_path,
                    '_method':'POST',
                    '_token':'{{ csrf_token()}}',
                },
                success: function($html) {

                    $('#delete-timeline-Modal').modal('hide');
                    $('.delete_time_line[data-id="'+del_time_line_id+'"]').closest('.timeline-row').remove();

                }
            });

        })

        $('.btn_cancel_upload').click(function(){
            var video_id= $(this).data('video_id');
            $('.delete_video_id').val(video_id)
            $('#cancel-upload-Modal').modal('show')
        })

        $('.btn_confirm_cancel').click(function(){

            var video_id=$('.delete_video_id').val()
            $('.btn_cancel_upload[data-video_id="'+video_id+'"]').closest('.video_box_item').remove();
            $('#cancel-upload-Modal').modal('hide')

            $.ajax({
                url: '{{url('/videos/stop_video_upload')}}',
                type: 'POST',
                dataType:'html',
                data: {
                    video_id:video_id,
                    '_method':'POST',
                    '_token':'{{ csrf_token()}}',
                }
            });

        })



        //Search 
        
        // $('body').on('click','#btn_iconify_span',function(){
        //     var action_type=$('#action_type').val();
        //     if(action_type == 'do_clear'){
        //         $('#action_type').val('do_filter');
        //         $('#btn_iconify_span').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" data-icon="bx:bx-search" id="btn_iconify_span"><path fill="currentColor" d="M10 18a7.95 7.95 0 0 0 4.897-1.688l4.396 4.396l1.414-1.414l-4.396-4.396A7.95 7.95 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8s3.589 8 8 8m0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6s-6-2.691-6-6s2.691-6 6-6"></path></svg>');
        //         $('#q_param').val('');
        //     }else if(action_type == 'do_filter'){
        //         $('#action_type').val('do_clear');
        //         $('#btn_iconify_span').html('<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>');
        //     }
        // });


        // Trigger AJAX call on input in the q_param box
        $(document).ready(function() {
            let debounceTimeout;

            // Trigger AJAX call when user types in the input box with a 300ms debounce
            $('#q_param').on('input', function() {
                // Clear the previous timeout
                clearTimeout(debounceTimeout);

                // Set a new timeout for 300ms
                debounceTimeout = setTimeout(function() {
                    // Perform the AJAX request
                    $.ajax({
                        type: 'GET',
                        url: "{{ route('searchvideo') }}",
                        data: $('#formSearch').serialize(), // Send form data (q_param)
                        beforeSend: function() {
                            // Optional: Add a loading spinner or any action before request
                        },
                        success: function(d) {
                            // Update the HTML with the results from the search
                            $('#videos_playlists_div').html(d.html);
                        },
                        complete: function(xhr) {
                            // Optional: Remove loading spinner or any cleanup after request
                        },
                        error: function(xhr, status, error) {
                            console.error('An error occurred:', error);
                        }
                    });
                }, 300); // 300ms delay before making the AJAX request
            });
        });


    </script>
@endsection
