maptilersdk.config.apiKey = 'ihShiTrlf63NEcFgmA5L';

const coordinates = listing.geometry.coordinates;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates,
    zoom: 9,
});
console.log("Coordinates:", listing.geometry.coordinates);

const marker = new maptilersdk.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new maptilersdk.Popup({offset: 25}).setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
    .addTo(map);


