// Declare a variable that stores the jQuery element
var $locationText = $(".location");

// Check if the browser supports geolocation and run the success function
if (navigator.geolocation) {
  // Get the current position with a high accuracy option and a timeout option of 10 seconds
  navigator.geolocation.getCurrentPosition(
    geoLocationSuccess,
    geoLocationError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0 // Add maximumAge option to force a fresh location request
    }
  );
} else {
  // Display an error message if the browser does not support geolocation
  alert("Your browser does not support geolocation");
}

// The function that runs if geolocation succeeds
function geoLocationSuccess(pos) {
  // Get the user's latitude and longitude
  var myLat = pos.coords.latitude;
  var myLng = pos.coords.longitude;
  var loadingTimeout;

  // The function that displays the text "fetching..."
  var loading = function () {
    $locationText.text("fetching...");
  };

  // Run the loading function after 600 milliseconds
  loadingTimeout = setTimeout(loading, 600);

  // Send a GET request to the API nominatim.openstreetmap.org with the latitude and longitude parameters
  var request = $.get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${myLat}&lon=${myLng}&zoom=18&addressdetails=1`
  )
    .done(function (data) {
      // If loadingTimeout still exists, then cancel and delete it
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
        // Display the location name received from the data
        $locationText.text(data.display_name);
      }
    })
    .fail(function () {
      // Handle the error
      alert("Failed to fetch location data");
    });
}

// The function that runs if geolocation fails
function geoLocationError(error) {
  // An object that stores the error messages based on the error code
  var errors = {
    1: "Permission denied",
    2: "Position unavailable",
    3: "Request timeout"
  };
  // Display the error message according to the error code
  alert("Error: " + errors[error.code]);
}
