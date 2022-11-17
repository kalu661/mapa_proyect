const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 20,
});

const baseLayers = {
	OpenStreetMap: osm,
};

const map = L.map("map", {
	center: [-24.559, -60.403],
	zoom: 6,
	layers: [osm],
});

L.control
	.layers(baseLayers, {
		position: "topright", // 'topleft', 'bottomleft', 'bottomright' // true
	})
	.addTo(map);

// const group = {
// 	Plagas: plagas,
// 	Parcelas: parcelas,
// 	Radio: radio,
// };
