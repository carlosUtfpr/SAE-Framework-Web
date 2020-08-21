
const express = require('express');
const cors = require('cors');
const app = express();

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

var id = 1;

var msg = [
    {
        "id": 1,
        "car":{
            "location":{
                "street": 10,
                "number": 24,
                "orientation": "south"
            },
            "status":{
                "moving": false,
                "turnIntentions": false,
                "stop": false,
                "embarkOrDisembark": false,
                "inGarage": false
            }
        },
        "service":{
            "status":{
                "hasService": true,
                "hasPassenger": false
            },
            "destination":{
                "street": 10,
                "number": 10
            }
    }
}];

socket.on('error', err => {
    console.error(`Server error:\n ${err.stack}`);
    socket.close();
});

socket.on('message', (mensage, rinfo) => {
    let json =`{"id":${id}, "mensagem":"${mensage}"}`;
    msg.push(JSON.parse(json));
    id++;
});

socket.on('listening', () => {
    const address = socket.address();
    console.log(`Server listening ${address.address}:${address.port}`);
});   
socket.bind(9999);

app.use(cors());

app.get('/', (req, res) => {
    res.send(msg);
});

app.listen(8000, function() {
    console.log(`Servidor rodando na porta 8000`);
});