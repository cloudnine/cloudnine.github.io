"use strict";
var searchFn = function () {
    var lastTerm = "You are likely to be eaten by a grue.";
    var stopwords = ["i", "me", "my", "we", "our", "you", "it",
        "its", "this", "that", "am", "is", "are", "was", "be",
        "has", "had", "do", "a", "an", "the", "but", "if", "or", "as",
        "of", "at", "by", "for", "with", "to", "then", "no", "not",
        "so", "too", "can", "and", "but"];

var normalizer = document.createElement("textarea");
var normalize = function (input) {
    normalizer.innerHTML = input;
    var inputDecoded = normalizer.value;
    return " " + inputDecoded.trim().toLowerCase()
        .replace(/[^0-9a-z ]/gi, " ").replace(/\s+/g, " ") + " ";
}

//the next step is to hide the searchBox, get the index, and run the normalizer on the index

$("#searchBox").hide();
var searchHost = {};
$.getJSON("/index.json", function (results) {
    searchHost.index = [];
    var dup = {};
    results.forEach(function (result) {
        if (result.tags && !dup[result.permalink]) {
            var res = {};
            res.showTitle = result.title;
            res.showSummary = result.summary;
            res.showDate = result.date;
            res.showAuthor = result.author;
            res.title = normalize(result.title);
            res.date = normalize(result.date);
            res.author = normalize(result.author);
			res.subtitle = normalize(result.subtitle);
            res.summary = normalize(result.summary);
            var newTags_1 = [];
            result.tags.forEach(function (tag) {
                return newTags_1.push(normalize(tag));
            });
            res.tags = newTags_1;
            res.permalink = result.permalink;
            res.image = result.image;
            searchHost.index.push(res);
            dup[result.permalink] = true;
        }
    });
    $("#loading").hide();
    $("#searchBox").show()
        .removeAttr("disabled")
        .focus();
    initSearch();
});

var initSearch = function () {
    $("#searchBox").keyup(function () {
        runSearch();
    });
};

//the search section

var runSearch = function () {
    if (searching) {
        return;
    }
    var term = normalize($("#searchBox").val()).trim();
    if (term.length < minChars) {
        $("#results").html('<p>No items found.</p>');
        return;
    }
    searching = true;
    $("#results").html('<p>Processing search...</p>');
    var terms = term.split(" ");
    var termsTree = [];
    for (var i = 0; i < terms.length; i += 1) {
        for (var j = i; j < terms.length; j += 1) {
            var weight = Math.pow(2, j - i);
            var str = "";
            for (var k = i; k <= j; k += 1) {
                str += (terms[k] + " ");
            }
            var newTerm = str.trim();
            if (newTerm.length >= minChars && stopwords.indexOf(newTerm) < 0) {
                termsTree.push({
                    weight: weight,
                    term: " " + str.trim() + " "
                });
            }
        }
    }
    search(termsTree);
    searching = false;
};

//this algorithm orders the results by weight. Substitute in the keys I search

var search = function (terms) {
    var results = [];
    searchHost.index.forEach(function (item) {
        if (item.tags) {
            var weight_1 = 0;
            terms.forEach(function (term) {
                if (item.title.startsWith(term.term)) {
                    weight_1 += term.weight * 32;
                }
            });
            weight_1 += checkTerms(terms, 1, item.summary);
            weight_1 += checkTerms(terms, 2, item.author);
            weight_1 += checkTerms(terms, 2, item.subtitle);
			weight_1 += checkTerms(terms, 2, item.date);
            item.tags.forEach(function (tag) {
                weight_1 += checkTerms(terms, 4, tag);
            });
            weight_1 += checkTerms(terms, 16, item.title);
            if (weight_1) {
                results.push({
                    weight: weight_1,
                    item: item
                });
            }
        }
    });
}

//counting number of hits
var checkTerms = function (terms, weight, target) {
    var weightResult = 0;
    terms.forEach(function (term) {
        if (~target.indexOf(term.term)) {
            var idx = target.indexOf(term.term);
            while (~idx) {
                weightResult += term.weight * weight;
                idx = target.indexOf(term.term, idx + 1);
            }
        }
    });
    return weightResult;
};

var render = function (results) {
    results.sort(function (a, b) { return b.weight - a.weight; });
    for (var i = 0; i < results.length && i < limit; i += 1) {
        var result = results[i].item;


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
