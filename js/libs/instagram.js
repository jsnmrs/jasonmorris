$(document).ready(function () {
    if ($(".instagram").length > 0) {
        $('.instagram').html('<img src="/img/loading.gif" alt="loading" />');
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: true,
            url: "https://api.instagram.com/v1/users/self/media/recent/?access_token=8067894.64f3363.2f158ac975244b8ba1bba33bd5dab48f",
            success: function (e) {
              $('.instagram').html('');
              for (var t = 0; t < 8; t++) {
                $(".instagram").append("<div class='instagram-placeholder'><a href='" + e.data[t].link + "'><img class='instagram-image' src='" + e.data[t].images.low_resolution.url + "' /></a></div>");
              }
            }
        });
    }
});