var x = document.getElementById('location-result');
const locationBtn = document.getElementById('get-location-btn');
// const search = document.getElementById('search-input');

const search = document.getElementById('search-input');
const matchList = document.getElementById('match-list');
const sResults = document.getElementById('search-results-wrapper');
var cities = {};

$(document).ready(function () {
  $.getJSON("/data/cities.min.json", function (json) {
    cities = json;
  });
});




function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);

  } else {
    x.innerHTML = 'Geolocation is not supported by this browser.';
  }
}

function showPosition(position) {
  // x.innerHTML = 'Latitude: ' + position.coords.latitude +
  //   '<br>Longitude: ' + position.coords.longitude + '<br>';
  // console.log(position)
  // searchForCity(position.coords.latitude, position.coords.longitude);

  const lat = position.coords.latitude;
  const long = position.coords.longitude;

  // Replace ./data.json with your JSON feed
  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      // Work with JSON data here
      console.log(data);
      search.value = data.city + ', ' + data.countryCode;
      document.getElementById('citynameinputid').value = data.city;
      document.getElementById('countrycodeinputid').value = data.countryCode;
      document.getElementById('longitudeinputid').value = long;
      document.getElementById('latitudeinputid').value = lat;
      document.getElementById('data-submit-btn').disabled = false;

    })
    .catch(err => {
      console.log(err.message);
    });
}


locationBtn.addEventListener('click', () => {
  getLocation();
});


// searching json file and filter it

const searchCities = async searchText => {
  // const res = await fetch('/data/city.list.min.json');
  // const cities = await res.json();

  // get matches to current text input
  let matches = cities.filter(city => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return city.name.match(regex);
  });

  if (searchText.length === 0) {
    matches = [];
    matchList.innerHTML = '';
  }
  outputHtml(matches);

};

const outputHtml = matches => {
  if (matches.length > 0) {
    var html = '<ul id="search-results-wrapper">';

    for (var i = 0; i < 9; i++) {
      var match = matches[i];
      if (typeof (match) !== 'undefined') {
        html += `<li class = "search-result" 
       
        data-cityname = "${match.name}"
        data-country = "${match.country}"
        data-longitude="${match.lng}"
        data-latitude="${match.lat}" >
        <span>${match.name}, ${match.country}</span>
      </li>`;
      }

    }
    html += '</ul>';
    matchList.innerHTML = html;
  }
};

search.addEventListener('input', () => {
  matchList.hidden = false;
  searchCities(search.value);
});

matchList.addEventListener('click', function (e) {
  e.stopPropagation();
  //console.log('ale ale');
  // var bookId = $(e.relatedTarget).data('value');
  var myElement = e.target;
  // console.log(e.target.nodheName);
  // eslint-disable-next-line eqeqeq
  if (e.target.nodeName == 'SPAN') {
    myElement = e.target.parentElement;
    // console.log(e.target.parentElement.nodeName);
  }
  console.log(myElement);
  search.value = '';
  console.log(myElement.value);
  search.value = myElement.firstElementChild.innerHTML;
  console.log(myElement.dataset.cityname);
  console.log(myElement.dataset.country);
  document.getElementById('citynameinputid').value = myElement.dataset.cityname;
  document.getElementById('countrycodeinputid').value = myElement.dataset.country;
  document.getElementById('longitudeinputid').value = myElement.dataset.longitude;
  document.getElementById('latitudeinputid').value = myElement.dataset.latitude;

  document.getElementById('data-submit-btn').disabled = false;

  this.hidden = true;
});

$(window).click(function () {
  //Hide the menus if visible
  matchList.hidden = true;

});