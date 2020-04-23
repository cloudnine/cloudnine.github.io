var lunrIndex, $results, pagesIndex;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');

        if (pair[0] === variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
        }
    }
}

var searchTerm = getQueryVariable('query');

// Initialize lunrjs using our generated index file
function initLunr() {
    // First retrieve the index file
    $.getJSON("/index.json")
        .done(function (index) {
            pagesIndex = index;
            lunrIndex = lunr(function () {
                this.field("title", { boost: 10 });
                this.field("tags", { boost: 5 });
                this.field("summary");
                this.ref("uri");

                pagesIndex.forEach(function (page) {
                    this.add(page)
                }, this)
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.error("Error getting Hugo index file:", err);
        });
}

// Nothing crazy here, just hook up a listener on the input field
function initUI() {
    $results = $("#blog-listing-medium");
    $("#searchinput").keyup(function () {
        $results.empty();

        // Only trigger a search when 2 chars. at least have been provided
        var query = $(this).val();
        if (query.length < 2) {
            return;
        }

        var results = search(query);

        renderResults(results);
    });
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
    return lunrIndex.search(query, {
        wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
    }).map(function (result) {
        return pagesIndex.filter(function (page) {
            return page.uri === result.ref;
        })[0];
    });
}

/**
 * Display the 10 first results
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
    if (!results.length) {
        $results.append("<p>No results found</p>");
        return;
    }


    results.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    // Only show the ten first results
    results.slice(0, 100).forEach(function (result) {


var $resultstring = "<article class='post'>" +
"<a class='title post-meta-styling' alt='" + .result.showTitle + "href='" + result.permalink + "'>" +
"<div class="d-lg-flex flex-row post-meta-styling'> " +
"<div class='thumb-img col-lg-2' style='background-image: linear-gradient(rgba(0, 0, 0, 0.15),rgba(0, 0, 0, 0.15)), url('" + result.image + "');>" +
"</div><div class='col-lg-10 text-center text-lg-left align-self-center'>" +
"<h2>" + result.showTitle +  "</h2>" +
"</div></div></a>" +
"<div class='mb-3 mt-2'>" +
"<small><strong>Author:" + result.showAuthor +  "</strong> |" + "&nbsp;" +
"<i class='far fa-calendar-alt'></i>" + "&nbsp;" + result.showDate + "&nbsp;" +
"|<i class='fa fa-tags' title='Tags' aria-hidden='true'></i>&nbsp;" +
for (i = 0; i < result.tags.length; i++) {
            $resultstring += "<a href='/tags/" + result.tags[i] + "'>" + result.tags[i] + "</a>";
            if ((i + 1) < result.tags.length) {
                $resultstring += ", ";
            }
        }

$resultstring += "</small></div><div>" + result.showSummary +
"</div><div class='mt-2'>" +
"<a class='btn btn-outline-secondary' href='" + result.permalink + "'role = 'button'>Continue Reading...</a>" +
"</div></article>";

var $result = ($resultstring);
        $("#results").append($result);

    }
};



    });
}

initLunr();

$(document).ready(function () {
    initUI();
});
