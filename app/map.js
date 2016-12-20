
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

      //reset map to marker
      placeMarkerAndPanTo(e.latLng, map);

      var submit = document.getElementById('submit');
      submit.addEventListener("click", function() { 
        name = document.getElementById('name').value;

        console.log("Name: " + name + ", Lat: " + lat + ", Long: " + lng); 

        //prepare mocky info

        //CORS helper method
        function createCORSRequest(method, url) {
          var xhr = new XMLHttpRequest();
          if("withCredentials" in xhr) {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true);
          } else if (typeof XDomainRequest != "undefined") {
            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            xhr.open(method, url);
          } else {
            // Otherwise, CORS is not supported by the browser.
            xhr = null;
          }
          return xhr;
        }

        // Helper method to parse the title tag from the response.
        function getTitle(text) {
          return text.match('<title>(.*)?</title>')[1];
        }

        // Make the actual CORS request.
        function makeCorsRequest() {
          // This is a sample server that supports CORS.
          var url = 'http://www.mocky.io/v2/585858fe120000d41bc8af28';
          var xhr = createCORSRequest('GET', url);
          if (!xhr) {
            alert('CORS not supported');
            return;
          }

          //Response handlers.
          xhr.onload = function() {
            var text = xhr.responseText;
            var title = getTitle(text);
            alert('Response from CORS request to ' + url + ': ' + title);
            
            //Successful response
            // if (xhr.readyState == 4 && xhr.status == 200) {
            //   console.log(xhr.responseText);
            //   var response = JSON.parse(xhr.responseText);
            //   alert(response.ip);
            // }
          };
          xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
          };

          xhr.send();
        }

        makeCorsRequest();
      }, false);

	}, false);



  // Try HTML5 geolocation.
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       var pos = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };

  //       infoWindow.setPosition(pos);
  //       infoWindow.setContent('Location found.');
  //       map.setCenter(pos);
  //     }, function() {
  //       handleLocationError(true, infoWindow, map.getCenter());
  //     });
  //   } else {
  //     // Browser doesn't support Geolocation
  //     handleLocationError(false, infoWindow, map.getCenter());
  //   }
  // }

  // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //                         'Error: The Geolocation service failed.' :
  //                         'Error: Your browser doesn\'t support geolocation.');
 }

function placeMarkerAndPanTo(latLng, map) {
	var marker = new google.maps.Marker({
		position: latLng,
		map: map
	});
map.panTo(latLng);
}

