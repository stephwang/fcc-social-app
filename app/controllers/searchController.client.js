(function() {
    var appUrl = window.location.origin;
    
    $(document).ready(getBars());

    $("#search").submit(function(e) {
        e.preventDefault();
        $("#results").html("<div class='container'>Loading results...</div>");
        var location = $("#search-bar").val();
        getBars(location);
    });
    
    $("#results").on("click", ".bar-going-button", function(){
        var bar_id = this.id
        $.ajax({
            url: appUrl + '/api/going',
            type: 'GET',
            data: { id: bar_id },
            success: function(data){
                if (typeof data.redirect == 'string')
                    window.location = data.redirect;
                else
                    updateGoing(bar_id, true);
            },
            error: function (err) {
                console.log(err);
            }
        }); 
    });
    
    $("#results").on("click", ".bar-not-going", function(){
        var bar_id = this.id;
        $.ajax({
            url: appUrl + '/api/notgoing',
            type: 'GET',
            data: { id: bar_id },
            success: function(data){
                updateGoing(bar_id, false);
            },
            error: function (err) {
                console.log(err);
            }
        }); 
    });
    
    function resultCard(bar) {
        var goingClass, goingText;
        if(bar.going.isGoing){
            goingClass = 'bar-not-going';
            goingText = 'I\'m going!';
        }
        else {
            goingClass = 'bar-going-button';
            goingText='RSVP';
        }
        var goingCountID = "going-count-" + bar.id;
        
        return `
        <div class="resultCard">
            <div class="bar-image">
                <img src=` + bar.image + `>
            </div>
            <div class="bar-info">
                <div class="bar-title">` + bar.name + `</div>
                <div class="bar-rating">
                    <img src=` + bar.rating + `> (` + bar.reviews + `)
                </div>
                <div class="bar-snippet">` + bar.snippet + `</div>
            </div>
            <div class="bar-actions">
                <div class="bar-users-going">
                    <span id=` + goingCountID + `>` + bar.going.count + `</span> going
                </div>
                <div class= "button ` + goingClass + `" id=` + bar.id + `>` + goingText + `</div>
                <a href=` + bar.url + `><div class="button yelp">Yelp page</div></a>
            </div>
        </div>
        `;
    }
    
    function getBars(location=null){
        $.ajax({
            url: appUrl + '/api/search',
            type: 'GET',
            data: { location: location },
            contentType: 'application/json; charset=utf-8',
            success: compileResults,
            error: function (err) {
                console.log(err);
            }
        }); 
    }
    
    function getCounts(id, success){
        $.ajax({
            url: appUrl + '/api/goingdata',
            type: 'GET',
            data: { id: id },
            contentType: 'application/json; charset=utf-8',
            success: success,
            error: function (err) {
                console.log(err);
            }
        }); 
    }
    
    function compileResults(response, next) {
        if(response != '') {
            $("#search-bar").val(response.query);
            $("#results").html("");
            
            var results = [];
            var bars = response.businesses;
            var barsProcessed = 0;
            bars.forEach(function(bar){
                // create an object for this bar
                var result = {
                    id: bar.id,
                    name: bar.name,
                    image: bar.image_url,
                    rating: bar.rating_img_url_small,
                    reviews: bar.review_count,
                    url: bar.url,
                    snippet: bar.snippet_text,
                };
                
                getCounts(bar.id, function(data){
                    // get going data and add result object to results array
                    result.going = data;
                    results.push(result);
                    barsProcessed++;
                    // if info has been gotten for all bars, start appending the result cards
                    if(barsProcessed === bars.length) {
                        results.forEach(function(bar){
                            $("#results").append(resultCard(bar));
                        });
                    }
                });

            });
        }
    }
    
    function updateGoing(bar_id, isGoing){
        if(isGoing){
            $("#" + bar_id).removeClass("bar-going-button").addClass("bar-not-going").text("I'm going!");
            
            var newCount = parseInt($("#going-count-" + bar_id).text()) + 1;
            $("#going-count-" + bar_id).text(newCount);
        }
        else {
            $("#" + bar_id).removeClass("bar-not-going").addClass("bar-going-button").text("RSVP");
            
            var newCount = parseInt($("#going-count-" + bar_id).text()) - 1;
            $("#going-count-" + bar_id).text(newCount);
        }
    }
})();