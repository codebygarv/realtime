const socket = io(); // backend par requet bheji or io.on() ne print kardiya connected . bcz it makes request 


// watchpostion se uske postion le like co ordinates x , y means mera divice kaha par khda hai usse backend me bhej diya , koi error aya toh use recieve krke print kardiya and last some settings like mujhe high accuracy chahiye , or timout hoga means  haar baar user ki details ko 5000 ms ke baad user ki co ordinates update kro means watch position duabra check krega hamri postions ko 

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
    );
}
const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetmap"
}).addTo(map);

const markers = {};

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})