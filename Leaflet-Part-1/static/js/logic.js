// Creating the map object cented on Algeria for good global coverage
var myMap = L.map("map", {
  center: [28.0339, 1.6596],
  zoom: 3
});

//Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//URL for eathquake data in the last 7 days
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Build popups based off datas title
function popUp(data, layer) {
  var place = data.properties.place;
  var mag = data.properties.mag;
  var depth = data.geometry.coordinates[2];
  layer.bindPopup(`<h4>${place}</h4><hr>Depth: ${depth}<hr>Magnitude: ${mag}`);  
};

//Find a color for the marker based on depth of earthquake
function depthColor(depth) {
  if (depth < 10) {
      color = '#60B6F1';
  } else if (depth < 30) {
      color = '#5E95C6';
  } else if (depth < 50) {
      color = '#5C80A9';
  } else if (depth < 70) {
      color = '#5A5C7A';
  } else if (depth < 90) {
      color = '#57384A';
  } else {
    color = '#54141A'
  };  
  return color
}

//Place circle markers and define size based on magnitude, color based on depth
function buildMarker(data, coords) {
  var Makers = {
    fillColor: depthColor(data.geometry.coordinates[2]),
    radius: data.properties.mag*3,
    color: "#121212",
    weight: 1.5,
    opacity: 1,
    fillOpacity: 1
  };
  return L.circleMarker(coords, Makers)
};

//Create a legend and position it
var legend = L.control({position: 'bottomright'});

//Build the ledgends text and colors
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  var depths = [-10, 10, 30, 50, 70, 90]
  for (var i = 0; i < depths.length; i++)
  { div.innerHTML += "<i style='background:" + depthColor(depths[i]) + "'></i>" + depths[i] + (depths[i+1]? " - " + depths[i+1] + "<br>":"+")};
  return div;
};

//Load the geoJSON run popup function and build markers then add to map
d3.json(url).then(function(data) {
  L.geoJSON(data, {onEachFeature: popUp, pointToLayer: buildMarker}).addTo(myMap);
});

//Add legend to the map
legend.addTo(myMap); 