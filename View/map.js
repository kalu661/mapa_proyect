const mbAttr =
	'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const mbUrl =
	"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

const streets = L.tileLayer(mbUrl, {
	id: "mapbox/streets-v11",
	tileSize: 512,
	zoomOffset: -1,
	attribution: mbAttr,
});
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 20,
});

const map = L.map("map", {
	center: [-24.559, -60.403],
	zoom: 6,
	layers: [osm],
});

const satellite = L.tileLayer(mbUrl, {
	id: "mapbox/satellite-v9",
	tileSize: 512,
	zoomOffset: -1,
	attribution: mbUrl,
});

const baseLayers = {
	OpenStreetMap: osm,
	Streets: streets,
	Satelite: satellite,
};

//° Muestra datos traidos desde GeoServer
const mbGeo = "http://localhost:5200/geoserver/puntos_plagas/wms?";

const plagas = L.tileLayer.wms(
	"http://localhost:5200/geoserver/puntos_plagas/wms?",
	{
		layers: "puntos_plagas:puntos_plagas",
		format: "image/svg",
		transparent: false,
		attribution: mbGeo,
	}
);

const mbGeo2 = "http://localhost:5200/geoserver/parcelas_plagas/wms?";

const parcelas = L.tileLayer.wms(
	"http://localhost:5200/geoserver/parcelas_plagas/wms?",
	{
		layers: "parcelas_plagas:parcelas_geo",
		format: "image/svg",
		transparent: false,
		attribution: mbGeo2,
	}
);

const layerGeo = L.control
	.layers(baseLayers, {
		parcelas: parcelas,
		plagas: plagas,
	})
	.addTo(map);

//° Ubicacion
map.locate({ setView: true, maxZoom: 9 });

function onLocationFound(e) {
	L.marker(e.latlng)
		.addTo(map)
		.bindPopup("Usted se encuentra aqui ")
		.openPopup();

	L.circle(e.latlng, radius).addTo(map);
}

map.on("locationfound", onLocationFound);

function onLocationError(e) {
	alert("Ubicacion denegada");
}

map.on("locationerror", onLocationError);

//° Layer Controls
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var options = {
	position: "topright",
	draw: {
		polyline: false,
		polygon: {
			allowIntersection: true, // Restricts shapes to simple polygons
			shapeOptions: {
				color: "green",
			},
		},
		circle: false, // Turns off this drawing tool
		rectangle: false,
		marker: true,
		shapeOptions: {
			color: "red",
		},
	},
	edit: {
		featureGroup: editableLayers, //REQUIRED!!
		remove: true,
	},
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
	var type = e.layerType,
		layer = e.layer;

	if (type === "polygon") {
		layer.bindPopup(
			'<button type="button" class="btn btn-outline-success "' +
				' data-bs-toggle="modal" data-bs-target="#_modal_polygon"' +
				">Informacion</button>"
		);
	}
	if (type === "marker") {
		// layer.bindPopup(prompt("Nombre de la plaga"));
		layer.bindPopup(
			'<button type="button" class="btn btn-outline-success "' +
				' data-bs-toggle="modal" data-bs-target="#_modal_marker"' +
				">Informacion</button>"
		);
	}

	editableLayers.addLayer(layer);
});
