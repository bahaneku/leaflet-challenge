// Store API enpoint inside variable usgsUrl
var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(usgsUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    console.log(earthquakeData);
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3><hr><p>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</h3><hr><p>" + feature.properties.mag + "</p>");
    }
    function radiusSize(magnitude) {
        console.log(magnitude);
        if (magnitude < 1) {
            return magnitude*4
        }
        else if (magnitude < 2) {
            return magnitude*5
        }
        else if (magnitude < 3) {
            return magnitude*6
        }
        else if (magnitude < 4) {
            return magnitude*7
        }
        else if (magnitude < 5) {
            return magnitude*8
        }
        else {
            return magnitude*3
        }
    }
    

    function circleColor(depth) {
        console.log(depth);
        if (depth > 1 && depth < 5) {
            return "#fed976"
        }
        else if (depth > 5 && depth < 10) {
            return "#feb24c"
        }
        else if (depth > 10 && depth < 15) {
            return "#fd8d3c"
        }
        else if (depth > 15 && depth < 20) {
            return "#f03b20"
        }
        else if (depth < 20) {
            return "#bd0026"
        }
        else {
            return "#ffffb2"
        }
}

function style (feature) {
    return {
        color: "black",
        weight: .5,
        radius: radiusSize(feature.properties.mag),
        fillColor: circleColor(feature.geometry.coordinates[2]),
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
    // Streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "streets-v11",
        accessToken: API_KEY
    });
    
    // Darkmap layer
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });
    
    // Satellite layer
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 9,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    // Outdoors layer
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 10,
        id: "outdoors-v11",
        accessToken: API_KEY
    });

    // baseMaps layer
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Satellite": satellite,
        "Outdoors": outdoors
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

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var depth = ["<1", "1-5", "5-10", "10-15","15-20", ">20"];
        var colors = ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"]
        var labels = [];

        // Insert legend to html
        div.innerHTML
        labels.push(`<p style="background-color: #e6ffff"><b> DEPTH (km) </b></p>`);
        depth.forEach(function (depth, i) {
            labels.push(`<ul style="background-color: ${colors[i]}">${depth} km </ul>`);
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Adding legend to the map
    legend.addTo(myMap);
};