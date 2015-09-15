$(document).ready(function () {
    if ($(".photos").length > 0) {
        //$('.instagram').html('<img src="/images/loading.gif" alt="loading" />');
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: true,
            url: "https://api.instagram.com/v1/users/self/media/recent/?access_token=8067894.64f3363.b86b57e0933b45fe811a9c9aaab38f66",
            success: function (e) {
              $('.photos').html('');
              for (var t = 0; t < 8; t++) {
                $(".photos").append("<article><a href='" + e.data[t].link + "'><img class='instagram-image' src='" + e.data[t].images.standard_resolution.url + "' /><div class='post-title'><h2>" + e.data[t].caption.text + "<span aria-hidden='true'> &rarr;</span></h2></div></a></article>");
              }
            }
        });
    }
});
