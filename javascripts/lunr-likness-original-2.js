const searchFn = function () {
  let lastTerm = 'You are likely to be eaten by a grue.';
  const stopwords = ['i', 'me', 'my', 'we', 'our', 'you', 'it',
    'its', 'this', 'that', 'am', 'is', 'are', 'was', 'be',
    'has', 'had', 'do', 'a', 'an', 'the', 'but', 'if', 'or', 'as',
    'of', 'at', 'by', 'for', 'with', 'to', 'then', 'no', 'not',
    'so', 'too', 'can', 'and', 'but'];
  const normalizer = document.createElement('textarea');
  const normalize = function (input) {
    normalizer.innerHTML = input;
    const inputDecoded = normalizer.value;
    return ` ${inputDecoded.trim().toLowerCase().replace(/[^0-9a-z ]/gi, ' ').replace(/\s+/g, ' ')} `;
  };

  const getUrl = window.location;
  const baseUrl = `${getUrl.protocol}//${getUrl.host}/${getUrl.pathname.split('/')[1]}`;


  const limit = 30;
  const minChars = 2;
  let searching = false;
  const render = function (results) {
    results.sort((a, b) => b.weight - a.weight);
    for (let i = 0; i < results.length && i < limit; i += 1) {
      const result = results[i].item;

      let resultPane = `${'<article class=\"post\">'
+ '<a class=\"title post-meta-styling\" href=\"'}${result.permalink}\"`
+ `alt=\"${result.showTitle}\">`
+ '<div class=\"d-lg-flex flex-row post-meta-styling\">'
+ `<div class=\"thumb-img col-lg-2\" style=\"background-image: linear-gradient(rgba(0, 0, 0, 0.15),rgba(0, 0, 0, 0.15)), url(\"${result.image}\");\">`
+ '<\/div><div class=\"col-lg-10 text-center text-lg-left align-self-center\">'
+ `<h2>${result.showTitle}</h2>`
+ '</div></div></a>'
+ '<div class=\"mb-3 mt-2\">'
+ `<small><strong>Author:${result.showAuthor}</strong> |` + '&nbsp;' + '<i class=\"far fa-calendar-alt\"></i>' + `&nbsp;${result.showDate}&nbsp;`
+ '|<i class=\"fa fa-tags\" title=\"Tags\" aria-hidden=\"true\">'
+ '</i>' + '&nbsp;';
      for (i = 0; i < result.tags.length; i++) {
        resultPane += `<a href='/tags/${result.tags[i]}'>${result.tags[i]}</a>`;
        if ((i + 1) < result.tags.length) {
          resultPane += ', ';
        }
      }

      resultPane += `</small></div><div>${result.showSummary}</div><div class=\"mt-2\">`
  + `<a class=\"btn btn-outline-secondary\" + href=\"${result.permalink}\" + role =\"button\">Continue Reading...</a>`
+ '</div></article>';

      $('#results').append(resultPane);
    }
  };
  const checkTerms = function (terms, weight, target) {
    let weightResult = 0;
    terms.forEach((term) => {
      if (~target.indexOf(term.term)) {
        let idx = target.indexOf(term.term);
        while (~idx) {
          weightResult += term.weight * weight;
          idx = target.indexOf(term.term, idx + 1);
        }
      }
    });
    return weightResult;
  };
  const search = function (terms) {
    const results = [];
    searchHost.index.forEach((item) => {
      if (item.tags) {
        let weight_1 = 0;
        terms.forEach((term) => {
          if (item.title.startsWith(term.term)) {
            weight_1 += term.weight * 32;
          }
        });
        weight_1 += checkTerms(terms, 1, item.content);
        weight_1 += checkTerms(terms, 2, item.description);
        weight_1 += checkTerms(terms, 2, item.subtitle);
        item.tags.forEach((tag) => {
          weight_1 += checkTerms(terms, 4, tag);
        });
        item.categories.forEach((category) => {
          weight_1 += checkTerms(terms, 4, category);
        });
        weight_1 += checkTerms(terms, 16, item.title);
        if (weight_1) {
          results.push({
            weight: weight_1,
            item,
          });
        }
      }
    });
    if (results.length) {
      let resultsMessage = `${results.length} items found.`;
      if (results.length > limit) {
        resultsMessage += ` Showing first ${limit} results.`;
      }
      $('#results').html(`<p>${resultsMessage}</p>`);
      render(results);
    } else {
      $('#results').html('<p>No items found.</p>');
    }
  };
  const runSearch = function () {
    if (searching) {
      return;
    }
    const term = normalize($('#searchBox').val()).trim();
    if (term === lastTerm) {
      return;
    }
    lastTerm = term;
    if (term.length < minChars) {
      $('#results').html('<p>No items found.</p>');
      $('#btnGo').attr('disabled', true);
      return;
    }
    $('#btnGo').removeAttr('disabled');
    searching = true;
    const startSearch = new Date();
    $('#results').html('<p>Processing search...</p>');
    const terms = term.split(' ');
    const termsTree = [];
    for (let i = 0; i < terms.length; i += 1) {
      for (let j = i; j < terms.length; j += 1) {
        const weight = Math.pow(2, j - i);
        let str = '';
        for (let k = i; k <= j; k += 1) {
          str += (`${terms[k]} `);
        }
        const newTerm = str.trim();
        if (newTerm.length >= minChars && stopwords.indexOf(newTerm) < 0) {
          termsTree.push({
            weight,
            term: ` ${str.trim()} `,
          });
        }
      }
    }
    search(termsTree);
    searching = false;
    const endSearch = new Date();
    $('#results').append(`<p><small>Search took ${endSearch - startSearch}ms.</small></p>`);
  };
  const initSearch = function () {
    $('#searchBox').keyup(() => {
      runSearch();
    });
    $('#btnGo').click(() => {
      runSearch();
      let loc = window.location.href.split('#')[0];
      loc = `${loc}#` + 'resultsArea';
      window.location.href = loc;
    });
    runSearch();
  };
  $('#searchBox').hide();
  $('#btnGo').hide();
  var searchHost = {};
  $.getJSON('/index.json', (results) => {
    searchHost.index = [];
    const dup = {};
    results.forEach((result) => {
      if ((result.tags && result.categories) && result.permalink) {
        const res = {};
        res.showTitle = result.title;
        res.showDescription = result.description;
        res.title = normalize(result.title);
        res.subtitle = normalize(result.subtitle);
        res.description = normalize(result.description);
        res.content = normalize(result.summary);
        const newTags_1 = [];
        result.tags.forEach((tag) => newTags_1.push(normalize(tag)));
        res.tags = newTags_1;
        const newCategories_1 = [];
        result.categories.forEach((category) => newCategories_1.push(normalize(category)));
        res.categories = newCategories_1;
        res.permalink = result.permalink;
        res.image = result.image;
        searchHost.index.push(res);
        dup[result.permalink] = true;
      }
    });
    $('#loading').hide();
    $('#btnGo').show();
    $('#searchBox').show()
      .removeAttr('disabled')
      .focus();
    initSearch();
  });
};
window.addEventListener('DOMContentLoaded', searchFn);
