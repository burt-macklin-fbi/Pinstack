
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

      // markers_callback(this.response, function(coords) {
        // bounds.extend(coords); //each marker
      // });
      // map.fitBounds(bounds); //auto-zoom
      // map.panToBounds(bounds); //auto-center

      //show all markers from mock api
      // function markers_callback(response, callback) {
        var json = JSON.parse(this.response);
        console.log(json);

          //if array is defined and has at least one element
        if(typeof json !== 'undefined' && json.length > 0) {
          for(var i =0; i < json.length; i++) {
            var lat = json[i].lat;
            var lng = json[i].lng;
            var coords = [lng, lat];
            
            //create each marker
            var marker = new google.maps.Marker({
              position: {lat: lat, lng: lng},
              map: map
            });
            // var latLng = new google.maps.LatLng(marker.position.lat(coords[1]), marker.position.lng(coords[0]));  
            // callback(marker.position);
            bounds.extend(marker.position); //each marker
          }
        }
        map.fitBounds(bounds); //auto-zoom
        map.panToBounds(bounds); //auto-center
      // }
    }
  };

  request.send();  
  //show all markers  

  map.addListener('click', function(e) {
    markerCreate(e);
  });
}



var setInfo = function(response, callback) {
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

  var markerInfo = { coords: latLng, info: contentString };

  callback(markerInfo);
}

function markerCreate(e) {
  //inhide info box
  var info = document.getElementById('info-box');
  info.className += " active";

  //get all info
  var name;
  var lat = e.latLng.lat();
  var lng = e.latLng.lng();
  console.log(lat + ", " + lng);

  var submit = document.getElementById('submit');
  submit.addEventListener("click", function() { 
    name = document.getElementById('name').value;
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

        //attach info to a marker
        setInfo(this.response, function(object) {
          // console.log(object);
          content = object;
          return content;   
        });
        //reset map to marker
        placeMarkerAndPanTo(content.coords, map, content.info);
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


