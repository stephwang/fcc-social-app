(function() {
    var apiUrl = window.location.origin + '/search';
    
    function resultCard(bar) {
        return `
        <div class="resultCard">
            <div class="bar-image">
                <img src=` + bar.image_url + `>
            </div>
            <div class="bar-info">
                <div class="bar-title">` + bar.name + `</div>
                <div class="bar-rating">
                    <img src=` + bar.rating_img_url_small + `> (` + bar.review_count + `)
                </div>
                <div class="bar-snippet">` + bar.snippet_text + `</div>
            </div>
            <div class="bar-actions">
                <div class="bar-users-going"> x people going </div>
                <div class="bar-going-button">I'm going!</div>
                <a href=` + bar.url + `><div class="bar-yelp-button">Yelp page</div></a>
            </div>
        </div>
        `;
    }
    
    $("#search").submit(function(e) {
        e.preventDefault();
        var location = $("#search-bar").val();
        $.ajax({
             url: apiUrl,
            type: 'GET',
            data: { location: location },
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $("#results").html("");
                var bars = response.businesses;
                bars.forEach(function(bar){
                    $("#results").append(resultCard(bar));
                });
            },
            error: function (err) {
                console.log(err);
            }
        }); 
    });

})();