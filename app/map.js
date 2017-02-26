
var map;

function initMap() {
  var bounds = new google.maps.LatLngBounds();
  // var loc = new google.maps.LatLng();
  // bounds.extend(loc);

  map = new google.maps.Map(document.getElementById('map'), {});
  //get all markers from Apiary
  var request = new XMLHttpRequest();
  request.open('GET', 'https://private-979a5-test11968.apiary-mock.com/markers');

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      // console.log('Status:', this.status);
      // console.log('Headers:', this.getAllResponseHeaders());
      // console.log('Body:', this.responseText);

      var json = JSON.parse(this.response);

        //if array is defined and has at least one element
      if(typeof json !== 'undefined' && json.length > 0) {
        for(var i = 0; i < json.length; i++) {

          var content = setInfo(json[i]);
          //map to marker
          var marker = placeMarker(content.coords, map, content.info);
          
          bounds.extend(marker.position); //each marker
        }
      }
      map.fitBounds(bounds); //auto-zoom
      map.panToBounds(bounds); //auto-center
    }
  };

  request.send();  
  //show all markers  

  map.addListener('click', function(e) {
    markerCreate(e);
  });
}

function markerCreate(e) {
  //inhide info box
  var info = document.getElementById('info-box');
  info.className += " active";

  //get all info
  // var name;

  var submit = document.getElementById('submit');
  submit.addEventListener("click", function() { 
    var name = document.getElementById('name').value;
    info.className += "info-box";

    //prepare mocky info
    var request = new XMLHttpRequest();

    request.open('POST', 'https://private-979a5-test11968.apiary-mock.com/markers');

    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
      var content;
      if (this.readyState === 4) {
        // console.log('Status:', this.status);
        // console.log('Headers:', this.getAllResponseHeaders());
        // console.log('Body:', this.responseText);

        var json = JSON.parse(this.response);

        //attach info to a marker
        var content = setInfo(json);
      
        //reset map to marker
        placeMarker(content.coords, map, content.info);
        map.panTo(content.coords);
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

function setInfo(response) {

  var json = response;
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

  var markerInfo = { coords: latLng, info: contentString };

  return markerInfo;
}

function placeMarker(latLng, map, contentString) {
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

  return marker;
}


