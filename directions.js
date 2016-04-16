// This example displays an address form, using the origin feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var travMode;
var placeSearch, origin;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the origin object, restricting the search to geographical
  //￼ location types.
  origin = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('origin')),
      {types: ['geocode']});
  destination = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('destination')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  //origin.addListener('place_changed', fillInAddress);
}

function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}

function fillInAddress() {
  // Get the place details from the origin object.
  var place = origin.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

function estimateWakeUpTime() {
  var timestr = $("#time").val()+":00";
  var datestr = new Date().toLocaleDateString();
  var s = datestr + " " + timestr;
  var date = new Date(s);
  getTravelTime(date);
}

function getTravelTime(date) {
  var mode = $('input[name="travelMode"]:checked').val();
  var directionsService = new google.maps.DirectionsService();
  var origPlace = origin.getPlace().geometry.location;
  var destPlace = destination.getPlace().geometry.location;
  var request = {
    origin: origPlace,
    destination: destPlace,
    travelMode: travMode
  };
  directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        var milliseconds = date.valueOf();

        var travelTime = response.routes[0].legs[0].duration.value * 1000;
        var alarmDate = new Date(milliseconds - travelTime);
        var alarmName = $("#name").val();
        $.post("add_alarm_action.php", {
          name: alarmName,
          hours: alarmDate.getHours(),
          minutes: alarmDate.getMinutes(),
        }, function(data, status) {});
        $("#duration").html("<p>Your estimated travel time is " + Math.round(travelTime / 60000) + " minutes. \
        <br/>We will wake you up at " + alarmDate.getHours() + ":" + alarmDate.getMinutes() + ".");
      }
      else{
        $("#duration").html("<p>Sorry, there seems to be an issue with your request. Please try a different one.</p>")
      }
   });
   console.log("Requesting...");
}

// Bias the origin object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (false) {//(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      origin.setBounds(circle.getBounds());
    });
  }
}
