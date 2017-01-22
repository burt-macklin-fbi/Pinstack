
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 6
    });
    // var infoWindow = new google.maps.InfoWindow({map: map});

    var marker = new google.maps.Marker({
    position: map.center,
    map: map
    });

    map.addListener('click', function(e) {
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

        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">' + json.submitted_by + '</h1>'+
            '<div id="bodyContent">'+
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
            '(last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>';

        //reset map to marker
        placeMarkerAndPanTo(e.latLng, map, contentString);
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

  }, false);

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
}

