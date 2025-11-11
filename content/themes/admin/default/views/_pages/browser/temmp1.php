<div class="row inbox-wrapper">
    <div class="col-lg-12">
      <div class="card">
        <div class="card-body">
          <div class="row">
            
            <div class="col-lg-12 email-content">
              <div class="email-inbox-header">
                <div class="row align-items-center">
                  <div class="col-lg-6">
                    <div class="email-title mb-2 mb-md-0"><span class="icon"><i data-feather="inbox"></i></span> Inbox <span class="new-messages">(2 new messages)</span> </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="email-search">
                      <div class="input-group input-search">
                        <input class="form-control" type="text" placeholder="Search mail..."><span class="input-group-btn">
                        <button class="btn btn-outline-secondary" type="button"><i data-feather="search"></i></button></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="container">
                
                <div class="icons-list row">
                  <div class="col-sm-6 col-md-4 col-lg-3">
                    <i data-feather="folder"></i>Folder 11
                  </div>
                  <div class="col-sm-6 col-md-4 col-lg-3">
                    <i data-feather="folder"></i>Folder 2
                  </div>
                </div>
              </div>
              <br><br>
              <div class="container">


                <div class="icons-list row">
                  <div class="col-sm-6 col-md-4 col-lg-3 card-group">
                    <img src="http://placehold.it/400x250/000/fff" class="card-img-top img-fluid" alt="...">
                    <div class="card-body">
                      <i data-feather="file"></i><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" title="Card title 1" data-content="And here's some amazing content. It's very engaging. Right?">Card title 1</a>
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-4 col-lg-3 card-group" data-toggle="tooltip" data-placement="bottom" title="Card title 2">
                    <img src="http://placehold.it/400x250/000/fff" class="card-img-top img-fluid" alt="...">
                    <div class="card-body">
                      <i data-feather="file"></i><a id="myPopover" tabindex="0" role="button" data-toggle="popover">Card title 2</a>
                    </div>
                  </div>

                  <div class="col-sm-6 col-md-4 col-lg-3 card-group" data-toggle="tooltip" data-placement="bottom" title="Card title 2">
                    <img src="http://placehold.it/400x250/000/fff" class="card-img-top img-fluid" alt="...">
                    <div class="card-body">
                      <i data-feather="file"></i><a id="myPopover" tabindex="0" role="button" data-toggle="popover">Card title 2</a>
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-4 col-lg-3 card-group" data-toggle="tooltip" data-placement="bottom" title="Card title 2">
                    <img src="http://placehold.it/400x250/000/fff" class="card-img-top img-fluid" alt="...">
                    <div class="card-body">
                      <i data-feather="file"></i><a id="myPopover" tabindex="0" role="button" data-toggle="popover">Card title 2</a>
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-4 col-lg-3 card-group" data-toggle="tooltip" data-placement="bottom" title="Card title 2">
                    <img src="http://placehold.it/400x250/000/fff" class="card-img-top img-fluid" alt="...">
                    <div class="card-body">
                      <i data-feather="file"></i><a id="myPopover" tabindex="0" role="button" data-toggle="popover">Card title 2</a>
                    </div>
                  </div>
                </div>
              </div>
              

            </div>

          </div>
          
        </div>
      </div>
    </div>
  </div>



    // enable fileuploader plugin
  // $('input[name="documet_file"]').fileuploader({
  //   limit: 20,
  //   maxSize: 50,  
  //   changeInput: '<div class="fileuploader-input">' +
  //               '<div class="fileuploader-input-inner">' +
  //                 '<div class="fileuploader-icon-main"></div>' +
  //               '<h3 class="fileuploader-input-caption"><span>${captions.feedback}</span></h3>' +
  //               '<p>${captions.or}</p>' +
  //               '<button type="button" class="fileuploader-input-button"><span>${captions.button}</span></button>' +
  //             '</div>' +
  //           '</div>',
  //   theme: 'dragdrop',
  //   upload: {
  //     url: base_url+'/settings/browser/upload_file',
  //     data: {csrf_test_name:csrf_hash,document_folder:sessionStorage.getItem('document_folder')},
  //     type: 'POST',
  //     enctype: 'multipart/form-data',
  //     start: true,
  //     synchron: true,
  //     beforeSend: null,
  //     onSuccess: function(result, item) {
  //       var data = {};
        
  //      // alert(sessionStorage.getItem('document_folder'));
  //       // get data
  //       if (result && result.files)
  //         data = result;
  //       else
  //         data.hasWarnings = true;
                
  //       // if success
  //       if (data.isSuccess && data.files[0]) {
  //         item.name = data.files[0].name;
  //         item.html.find('.column-title > div:first-child').text(data.files[0].name).attr('title', data.files[0].name);
  //       }
        
  //       // if warnings
  //       if (data.hasWarnings) {
  //         for (var warning in data.warnings) {
  //           alert(data.warnings[warning]);
  //         }
          
  //         item.html.removeClass('upload-successful').addClass('upload-failed');
  //         // go out from success function by calling onError function
  //         // in this case we have a animation there
  //         // you can also response in PHP with 404
  //         return this.onError ? this.onError(item) : null;
  //       }
                
  //         item.html.find('.fileuploader-action-remove').addClass('fileuploader-action-success');
  //         setTimeout(function() {
  //             item.html.find('.progress-bar2').fadeOut(400);
  //         }, 400);
  //     },
  //     onError: function(item) {
  //       var progressBar = item.html.find('.progress-bar2');
        
  //       if(progressBar.length) {
  //         progressBar.find('span').html(0 + "%");
  //         progressBar.find('.fileuploader-progressbar .bar').width(0 + "%");
  //         item.html.find('.progress-bar2').fadeOut(400);
  //       }
                
  //       item.upload.status != 'cancelled' && item.html.find('.fileuploader-action-retry').length == 0 ? item.html.find('.column-actions').prepend(
  //           '<button type="button" class="fileuploader-action fileuploader-action-retry" title="Retry"><i class="fileuploader-icon-retry"></i></button>'
  //       ) : null;
  //     },
  //     onProgress: function(data, item) {
  //         var progressBar = item.html.find('.progress-bar2');
  
  //         if(progressBar.length > 0) {
  //             progressBar.show();
  //             progressBar.find('span').html(data.percentage + "%");
  //             progressBar.find('.fileuploader-progressbar .bar').width(data.percentage + "%");
  //         }
  //     },
  //     onComplete: null,
  //   },
  //   onRemove: function(item) {
  //     $.post('./php/ajax_remove_file.php', {
  //       file: item.name
  //     });
  //   },
  // });