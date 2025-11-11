jQuery(function($) {
    "use strict";
    var timeout;
    var page = 1; // Initial page for pagination
    var loading = false; // To prevent multiple simultaneous requests
    var hasNext = true; // Flag to check if there are more results

    // Function to perform the search with pagination
    function performSearch() {
        if (!loading && hasNext) {
            loading = true;

            var searchTerm = $('#searchInput').val();
            var sanitizedSearchTerm = encodeURIComponent(searchTerm);

            // Send AJAX request to your PHP script with the sanitized search term and page number
            $.ajax({
                type: 'GET',
                url: 'https://staging.sikshapedia.com/api/globallisting?_searched_param=' + sanitizedSearchTerm + '&start=' + page,
                dataType: 'json',
                beforeSend:function(){
                    var html='';

                    //html += '<span class="jsx-2743981883 menu-items pb-2  d-flex align-items-center text-heading"></span>';
                    $('div.trendingSearch .searchBody').html(html);
                },
                success: function(response) {
                    displayResults(response.data.searched_data,response.data.count);
                    loading = false;
                    hasNext = response.data.hasNext;
                    page++;
                },
                error: function(error) {
                    console.error('Error:', error);

                    // Check if the status code is 429 (Too Many Requests)
                    if (error.status === 429) {
                        loading = false; // Reset loading flag to allow future requests
                        // Handle rate limit exceeded error (e.g., display a message to the user)
                        console.error('Rate limit exceeded. Please try again later.');
                    }
                }
            });
        }
    }

    // Function to display search results
    function displayResults(d,count) {
        var resultsContainer = $('div.trendingSearch .searchBody');
        var html = '';

        if (count > 0) {
            $.each(d, function(k, v) {

                html += '<span class="jsx-2743981883 menu-items pb-2  d-flex align-items-center text-heading undefined">';
                html += '<div class="jsx-2743981883 d-inline-block  align-self-start pt-1">';
                html += '<img data-src="' + v.searched_data_logo + '" src="' + v.searched_data_logo + '" alt="' + v.serach_data_name + '" class="jsx-2355921263 logo-img lazyloaded" loading="lazy">';
                html += '</div>';
                html += '<div class="jsx-2743981883 col text-new font-weight-bold text-capitalize"><a href="' + v.searched_access_url + '" class="jsx-2743981883 mb-0 h2 list-name"><strong>' + v.serach_data_name + '</strong>';
                if (v.search_data_address != '') {
                   // html += '<p class="search-add">' + v.search_data_address + '</p>';
                }
                html += '</a><div class="jsx-2743981883 d-flex flex-nowrap tabs-container" wfd-id="2542"></div>';
                html += '</div>';
                html += '<p class="jsx-2743981883 m-0 text-17 text-subheading text-tiny font-weight-bold text-capitalize "><span style="margin-right:5px !important;"><img data-src="' + v.searched_country_logo + '" src="' + v.searched_country_logo + '" alt="' + v.serach_data_name + '" class="jsx-2355921263 logo-img lazyloaded" loading="lazy" style="height: 20px;vertical-align: bottom;"></span> <strong>' + v.search_data_type + '<strrong></p>';
                html += '</span>';

            });

            resultsContainer.append(html);
        } else {
            if (page === 1) {
                resultsContainer.html('<p>No results found</p>');
            }
        }
    }

    // Event handler for various actions in the search box
    $('#searchInput').on('input propertychange paste', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            page = 1; // Reset page when the search term changes
            hasNext = true; // Reset hasNext flag
            performSearch();
        }, 300);
    });

    // Event handler for scroll events on searchBody
    $('#searchBody').on('scroll', function() {
        var container = $(this);
        var scrollHeight = container[0].scrollHeight;
        var scrollTop = container.scrollTop();
        var clientHeight = container.height();

        // Load more results when user scrolls near the bottom and there are more results
        if (scrollHeight - scrollTop - clientHeight < 100 && hasNext) {
            performSearch();
        }
    });

    // Event handler for the Enter key pressed in the search box
    // $('#searchInput').on('keyup', function(e) {
    //     if (e.keyCode === 13) { // Enter key pressed
    //         page = 1; // Reset page when Enter key is pressed
    //         hasNext = true; // Reset hasNext flag
    //         performSearch();
    //     }
    // });
});
