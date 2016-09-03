(function() {
    var apiUrl = window.location.origin + '/search';
    
    $(document).ready(getBars());

    $("#search").submit(function(e) {
        e.preventDefault();
        $("#results").html("<div class='container'>Loading results...</div>");
        var location = $("#search-bar").val();
        getBars(location);
    });
    
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
    
    function getBars(location=null){
        $.ajax({
             url: apiUrl,
            type: 'GET',
            data: { location: location },
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $("#results").html("");
                if(response != '') {
                    $("#search-bar").val(response.query);
                    var bars = response.businesses;
                    bars.forEach(function(bar){
                        $("#results").append(resultCard(bar));
                    });
                }
            },
            error: function (err) {
                console.log(err);
            }
        }); 
    }

})();