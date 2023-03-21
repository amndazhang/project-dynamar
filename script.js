var map = L.map('map').setView([0, -100], 3);

var osm = L.tileLayer('https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=Laz3Xyzb9RTOE87DY37e', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

// Read markers data from data.csv
$.get('Processed_GPE3_Tracks_BUM_SAL.csv', function(csvString) {

    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    // Polylines
    var count = 0;
    var uniquePtt = 137;
    var polylineLatlng = [];
    var polylineLayer = [];
    var ptt = data[0].ptt;
    var i = 0;
    while (count <= uniquePtt) {
        var c;
        polylineLatlng = [];
        while (i < data.length) {
            var row = data[i];
            c = row.species == 'BUM' ? 'blue' : 'red';
            if (ptt == row.ptt) {
                polylineLatlng.push([row.lat, row.lon]);
                polylineLayer.push([row.lat, row.lon]);
            } else {
                ptt = row.ptt;
                break;
            }
            i++;
        }
        var lines = L.layerGroup(polylineLayer);
        var polyline = L.polyline(polylineLatlng, {color: c, opacity: 0.5});
        L.layerGroup(polyline).addTo(map);
        count++;
    }

    // Points
    var circles = [];
    for (var j in data) {
        var row = data[j];
        var c = row.species == 'BUM' ? 'blue' : 'red';

        var circle = L.circle([row.lat, row.lon], {
            opacity: 1,
            color: c
        }).bindPopup(row.ptt)
        circle.addTo(map);
        circles.push(circle);
    }

});

// Attribution
map.attributionControl.setPrefix(
    'View <a href="https://github.com/amndazhang/project-dynamar" target="_blank">code on GitHub</a>'
);
