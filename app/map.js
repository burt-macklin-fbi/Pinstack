
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(2.8,-187.3),
    zoom: 2
  });
  //get all markers from Apiary
  var request = new XMLHttpRequest();
  request.open('GET', 'https://private-979a5-test11968.apiary-mock.com/markers');

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      // console.log('Status:', this.status);
      // console.log('Headers:', this.getAllResponseHeaders());
      // console.log('Body:', this.responseText);
      markers_callback(this.response, function(coords) {
        console.log(coords);
      });
    }
  };
  request.send();  
  //show all markers
  

  map.addListener('click', function(e) {
    markerCreate(e);
  });
}

//show all markers from mock api
function markers_callback(response, callback) {
  var json = JSON.parse(response);

  for(var i =0; i < json.length; i++) {
    var lat = json[i].lat;
    var lng = json[i].lng;
    var coords = [lng, lat];
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var marker = new google.maps.Marker({
      position: latLng, //latLng
      map: map
    });
  }
  callback(coords);
  return;
}

function markerCreate(e) {
  //inhide info box
  var info = document.getElementById('info-box');
  info.className += " active";

  //get all info
  var name;
  var lat = e.latLng.lat();
  var lng = e.latLng.lng();

  var grabMarkerInfo = function(response) {
    var json = JSON.parse(response);
    console.log(json);
    var latLng = {lat: json.lat, lng: json.lng}
    var note = json.note;

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">' + json.submitted_by + '</h1>'+
        '<div id="bodyContent">'+
        '<p>' + note + '</p>'+
        '</div>'+
        '</div>';

    //reset map to marker
    placeMarkerAndPanTo(latLng, map, contentString);
  }

  var submit = document.getElementById('submit');
  submit.addEventListener("click", function() { 
    name = document.getElementById('name').value;
    info.className += "info-box";

    //prepare mocky info
    var request = new XMLHttpRequest();

    request.open('POST', 'https://private-979a5-test11968.apiary-mock.com/markers');

    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        // console.log('Status:', this.status);
        // console.log('Headers:', this.getAllResponseHeaders());
        // console.log('Body:', this.responseText);

        //attach info to a marker
        grabMarkerInfo(this.response);
      }
    };

    var body = {
      'submitted_by': 'Erika Carrington',
      'lat': 32.934292,
      'lng': -97.078065,
      'note': 'This is the city I live in.'
    };

    request.send(JSON.stringify(body));
  }, false);
}

function placeMarkerAndPanTo(latLng, map, contentString) {
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
  map.panTo(latLng);
}


