// Store API enpoint inside variable usgsUrl
var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(usgsUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    console.log(earthquakeData);
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3" + feature.properties.place + "</h3><hr><p>" +new Date(feature.properties.time) + "</p>");
    }
    function radiusSize(magnitude) {
        return magnitude * 5;
    }

    function circleColor(magnitude) {
        if (magnitude < 1) {
            return "#fcbba1"
        }
        else if (magnitude < 2) {
            return "#fc9272"
        }
        else if (magnitude < 3) {
            return "#fb6a4a"
        }
        else if (magnitude < 4) {
            return "#de2d26"
        }
        else if (magnitude < 5) {
            return "#a50f15"
        }
        else {
            return "#fee5d9"
        }
}

function style (feature) {
    return {
        radius: radiusSize(feature.properties.mag),
        color: circleColor(feature.properties.mag),
        fillOpacity: 1
    }
}
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(earthquakeData, latlng) {
            return L.circleMarker(latlng);
        },
        onEachFeature: onEachFeature,
            style: style
    });

    createMap(earthquakes);
};
function createMap(earthquakes) {
    // Streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // baseMaps layer
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Map with streetmap and earthquake layers
    var myMap = L.map('mapid', {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // // Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });

    // // // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        return div;
    };
    // // Add the info legend to the map
    info.addTo(map);
};

