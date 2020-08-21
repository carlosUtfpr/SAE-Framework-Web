const requestUri = "http://localhost:8000/";

state = {
    gridWidth: 250,
    gridHeight: 380,
    space: 15,
    numberBlockX: 5,
    numberBlockY: 7,
    grid: [],
    routes: []
}

simulator = {
    width: 0,
    height: 0,
    widthContainer: 0,
    heightContainer: 0
}

window.addEventListener('load', load);

// function update() {
//     plotCar("myCanvas", 10, 15, 13, "south", state.gridWidth, state.gridHeight, state.space, state.numberBlockX, state.numberBlockY);
//     plotDestiny("myCanvas", 6, 5, state.gridWidth, state.gridHeight, state.space, state.numberBlockX, state.numberBlockY);
//     plotTraject("myCanvas", 10, 15, 6, 5, state.grid, state.gridWidth, state.gridHeight, state.numberBlockX, state.numberBlockY);
// }

async function update(){
    const res = await axios.get(requestUri);
    const data = res.data[0];
    let car = data.car;

    plotCar("myCanvas", car, 13, state.gridWidth, state.gridHeight, state.space, state.numberBlockX, state.numberBlockY);
    if(data.service.status.hasService){
        plotDestiny("myCanvas", data.service, state.gridWidth, state.gridHeight, state.space, state.numberBlockX, state.numberBlockY);
        plotTraject("myCanvas", car.location.street, car.location.number, data.service.destination.street, data.service.destination.number, state.grid, state.gridWidth, state.gridHeight, state.numberBlockX, state.numberBlockY);
    }
}

function clear(id){
    const canvas = document.getElementById(id);
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

}

function load() {
    let grid = state.grid;
    for (let i = 0; i < 29; i++) {
        grid.push([]);
        for (let j = 0; j < 21; j++) {
            if (parseInt(i % 4) == 0 && parseInt(j % 4) == 0) {
                let sentidoI = parseInt((parseInt(i / 4) + 1) % 2) == 0 ? -3 : -2;
                let sentidoJ = parseInt((parseInt(j / 4) + 9) % 2) == 0 ? -3 : -2;

                grid[i].push([-1, sentidoI, sentidoJ]);
            } else if (parseInt(i % 4) == 0 || parseInt(j % 4) == 0) {
                let verificaRua = parseInt(i % 4) == 0 ? parseInt(i / 4) + 1 : parseInt(j / 4) + 9;
                let verificaSentido = parseInt(verificaRua % 2) == 0 ? -3 : -2;
                let verficaNumero = parseInt(i % 4) == 0 ? j : i;

                grid[i].push([verificaSentido, verificaRua, verficaNumero]);
            } else {
                grid[i].push(['a']);
            }
        }

    }

    const img = document.getElementById("Map");

    const width = img.offsetWidth;
    const height = img.offsetHeight;

    simulator.width = width;
    simulator.height = height;

    const container = document.getElementById("simulator");

    const widthContainer = container.offsetWidth;
    const heightContainer = container.offsetHeight;

    simulator.widthContainer = widthContainer;
    simulator.heightContainer = heightContainer;

    plotSimulator("myCanvas", state.gridWidth, state.gridHeight, state.space, state.numberBlockX, state.numberBlockY);
    setInterval(update, 1000);
}

function plotSimulator(id, gWidth, gHeight, space, nw, nh) {
    canvasBlock(0, 0, gWidth, gHeight, id, "#eee");

    let h = space;
    let width = (gWidth - space * (nw + 1)) / nw;
    let height = (gHeight - h * (nh + 1)) / nh;

    for (let j = 0; j < nh; j++) {
        let leftI = 0;
        for (let i = 0; i < nw; i++) {
            canvasBlock(leftI + space, h, width, height, id, "#4caf50");
            leftI = leftI + width + space;
        }
        h = h + height + space;
    }

    let iniArrowTop = 20;
    for (let i = 0; i < nh * 2; i++) {
        let iniArrowLeft = 5;
        arrowUp(id, 9, 9, iniArrowLeft, iniArrowTop);
        iniArrowLeft = iniArrowLeft + (space) + (width);
        arrowDown(id, 9, 9, iniArrowLeft, iniArrowTop);
        iniArrowLeft = iniArrowLeft + (space) + (width);
        arrowUp(id, 9, 9, iniArrowLeft, iniArrowTop);
        iniArrowLeft = iniArrowLeft + (space) + (width);
        arrowDown(id, 9, 9, iniArrowLeft, iniArrowTop);
        iniArrowLeft = iniArrowLeft + (space) + (width);
        arrowUp(id, 9, 9, iniArrowLeft, iniArrowTop);
        iniArrowLeft = iniArrowLeft + (space) + (width);
        arrowDown(id, 9, 9, iniArrowLeft, iniArrowTop);

        iniArrowTop = iniArrowTop + 10.5 + space;
    }

    iniArrowTop = 8;
    for (let i = 0; i < nh; i++) {
        let iniArrowLeft = 17;
        for (let j = 0; j < nw * 2; j++) {
            arrowRight(id, 9, 9, iniArrowLeft, iniArrowTop);
            iniArrowLeft = iniArrowLeft + space + 8;
        }
        iniArrowTop = iniArrowTop + height + space;
        iniArrowLeft = 17;
        for (let j = 0; j < nw * 2; j++) {
            arrowLeft(id, 9, 9, iniArrowLeft, iniArrowTop);
            iniArrowLeft = iniArrowLeft + space + 8;
        }
        iniArrowTop = iniArrowTop + height + space;
    }

    plotGarage(id, 10, 17, width, height, space);
}

function canvasBlock(l, t, wd, hg, id, color) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.fillRect(l, t, wd, hg);

    ctx.stroke();
}

function plotDestiny(id, service, gWidth, gHeight, space, nw, nh) {
    let width = (gWidth - space * (nw + 1)) / nw;
    let height = (gHeight - space * (nh + 1)) / nh;

    let street = service.destination.street;
    let number = service.destination.number;

    let radius = space / 2.2;
    number = number - 1;
    if (street < 9) {
        var top = (street - 1) * (height + space) + space / 2;
        var left = parseInt(number / 3) * (width + space) + space + space / 2 + (parseInt(number % 3) * width / 3);
    } else {
        var top = parseInt(number / 3) * (height + space) + space + space / 2 + (parseInt(number % 3) * height / 3);
        var left = (street - 9) * (width + space) + space / 2;
    }

    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = "#0626f7";
    ctx.beginPath();
    ctx.arc(left, top, radius, 0, Math.PI * 2, true);

    ctx.fill();
}

function plotCar(id, car, size, gWidth, gHeight, space, nw, nh) {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');

    let street = car.location.street;
    let number = car.location.number;
    let orientation = car.location.orientation;

    let width = (gWidth - space * (nw + 1)) / nw;
    let height = (gHeight - space * (nh + 1)) / nh;

    let carSimulator = {
        width: 0,
        height: 0
    }

    if (street < 9) {
        var top = (street - 1) * (height + space) + (space - size) / 2;
        var left = number * (width + space) / 4;
    } else {
        var top = number * (height + space) / 4;
        var left = (street - 9) * (width + space) + (space - size) / 2;
    }

    if(!car.status.inGarage){
    
        ctx.fillStyle = "#1b3a56";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = "#1b3a56";
        ctx.shadowBlur = 1;
    
        ctx.beginPath();
    
        switch (orientation) {
            case 'west': {
                ctx.moveTo(left + size, top + size);
                ctx.lineTo(left, top + size / 2);
                ctx.lineTo(left + size, top);
                var img = "car_left_side.png";
                carSimulator.width = 100;
                carSimulator.height = 80;
            } break;
            case 'east': {
                ctx.moveTo(left, top + size);
                ctx.lineTo(left + size, top + size / 2);
                ctx.lineTo(left, top);
                var img = "car_right_side.png";
                carSimulator.width = 100;
                carSimulator.height = 80;
            } break;
            case 'north': {
                ctx.moveTo(left, top + size);
                ctx.lineTo(left + size, top + size);
                ctx.lineTo((left + size / 2), top);
                var img = "car_up.png";
                carSimulator.width = 80;
                carSimulator.height = 100;
            } break;
            case 'south': {
                ctx.moveTo(left, top);
                ctx.lineTo(left + size, top);
                ctx.lineTo((left + size / 2), top + size);
                var img = "car_down.png";
                carSimulator.width = 80;
                carSimulator.height = 100;
            } break;
        }
    
        ctx.fill();
    
        space = 100;
        width = ((simulator.width - 10) - space * (nw + 1)) / nw;
        height = ((simulator.height - 10) - space * (nh + 1)) / nh;
    
        if (street < 9) {
            top = (street - 1) * ((space) / 2 + (width + space / 2)) + 5;
            left = number * ((height + space) / 4) + 8;
        } else {
            top = number * ((height + space) / 4) + 5;
            left = (street - 9) * ((space) / 2 + (width + space / 2)) + 17;
        }
        plotCarSimulator(top, left, img, carSimulator);    
    }else{
        let radius = space / 3;
        ctx.fillStyle = "#0626f7";
        ctx.beginPath();
        
        ctx.arc(left+19, top+7, radius, 0, Math.PI * 2, true);

        ctx.fill();
    }
}

var plotCarSimulator = (positionY, positionX, carUri, size) => {
    const canvas = document.getElementById("cars");
    const ctx = canvas.getContext('2d');

    var car = new Image();
    car.src = `assets/img/${carUri}`;
    car.onload = () => {
        ctx.drawImage(car, 0, 0, size.width, size.height);
    };

    canvas.style.top = `${positionY}px`;
    canvas.style.left = `${positionX}px`;

    let left = positionX < 100 ? 0 : positionX - (simulator.widthContainer - 100) / 2;
    let top = positionY < 100 ? 0 : positionY - (simulator.heightContainer - 100) / 2;
    left = positionX + 100 > (simulator.width - 100) ? simulator.width - (simulator.widthContainer) : left;
    top = positionY + 100 > (simulator.height - 100) ? simulator.height - (simulator.heightContainer) : top;
    const container = document.getElementById("simulator");
    container.scrollTop = top;
    container.scrollLeft = left;
};

function plotTraject(id, carStreet, carNumber, destinyStreet, destinyNumber, grid, gridWidth, gridHeight, numberBlockX, numberBlockY) {
    let destinyNumberVerify = parseInt((destinyNumber - 1) / 3) + destinyNumber;
    let aux = grid.slice();

    if (carStreet < 9) {
        var carPositionI = (carStreet - 1) * 4;
        var carPositionJ = carNumber;
    } else {
        var carPositionI = carNumber;
        var carPositionJ = (carStreet - 9) * 4;
    }
    if (destinyStreet < 9) {
        var destinyPositionI = (destinyStreet - 1) * 4;
        var destinyPositionJ = destinyNumberVerify;
    } else {
        var destinyPositionI = destinyNumberVerify;
        var destinyPositionJ = (destinyStreet - 9) * 4;
    }
    let queue = [0];


    let rota = traject(aux, carPositionI, carPositionJ, queue, [[destinyPositionI, destinyPositionJ]]);

    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');

    let space = 15;
    let size = 14;
    let width = (gridWidth - space * (numberBlockX + 1)) / numberBlockX;
    let height = (gridHeight - space * (numberBlockY + 1)) / numberBlockY;

    ctx.fillStyle = "#55c0ef";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;

    rota.map((route, index) => {
        if (index > 0 && index < rota.length - 1) {
            ctx.beginPath();
            if (grid[route[1]][route[2]][1] < 9) {
                var top = (route[1] / 4) * (height + space) + (space - size) / 4;
                var left = (route[2]) * (width + space) / 4;
            } else {
                var top = (route[1]) * (height + space) / 4;
                var left = (route[2] / 4) * (width + space) + (space - size) / 4;
            }
            ctx.fillRect(left, top, size, size);
            ctx.fill();
        }
    });

    return rota;
}

function traject(grid, carPositionI, carPositionJ, queue, listOfPosition) {
    var list = listOfPosition;
    var temp = [];
    let ver = 0;
    let count = 0;
    let res = [];

    while (grid[carPositionI][carPositionJ][0] <= 0) {
        for (let i = 0; i < list.length; i++) {
            ver = list[i];
            if (((ver[0] > -1) && (ver[0] < 29)) && ((ver[1] > -1) && (ver[1] < 21))) {
                if (grid[ver[0]][ver[1]][0] == -1) {
                    var k = grid[ver[0]][ver[1]][1] == -2 ? [ver[0], ver[1] - 1] : [ver[0], ver[1] + 1];
                    var j = grid[ver[0]][ver[1]][2] == -2 ? [ver[0] + 1, ver[1]] : [ver[0] - 1, ver[1]];
                    temp.push(k);
                    temp.push(j);
                    grid[ver[0]][ver[1]][0] = count;
                } else if (grid[ver[0]][ver[1]][0] < 0) {
                    if (grid[ver[0]][ver[1]][1] < 9) {
                        var pos = grid[ver[0]][ver[1]][0] == -3 ? [ver[0], ver[1] + 1] : [ver[0], ver[1] - 1];
                    } else {
                        var pos = grid[ver[0]][ver[1]][0] == -3 ? [ver[0] - 1, ver[1]] : [ver[0] + 1, ver[1]];
                    }
                    temp.push(pos);

                    grid[ver[0]][ver[1]][0] = count;
                }
            }
        }
        list = temp;
        temp = [];
        count++;
    }
    let rI = carPositionI;
    let rJ = carPositionJ;
    while (count >= 0) {
        let v = true;
        for (let m = -1; m < 2 && v; m++) {
            if (rI + m >= 0 && rI + m < 29) {
                for (let n = -1; n < 2 && v; n++) {
                    if (rJ + n >= 0 && rJ + n < 21) {
                        let se = (grid[rI][rJ][0] - grid[rI + m][rJ + n][0]) === 1;
                        if (se) {
                            res.unshift([count, rI, rJ]);
                            rI = rI + m;
                            rJ = rJ + n;
                            v = false;
                        }
                    }
                }
            }
        }
        count--;
    }
    return res;
}

function plotGarage(id, street, number, width, height, space) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');

    let sideA = width / 3;
    let sideB = height / 3;

    number = number - 1;

    if (street < 9) {
        var top = (street - 1) * (height + space) + space;
        var left = parseInt(number / 3) * (width + space) + space + (parseInt(number % 3) * width / 3);
    } else {
        var top = parseInt(number / 3) * (height + space) + space + (parseInt(number % 3) * height / 3);
        var left = (street - 9) * (width + space) + space;
    }

    ctx.fillStyle = "red";
    ctx.fillRect(left, top, sideA, sideB);

    ctx.stroke();

    if (street < 9) {
        var top = (street - 1) * (height + space) + space;
        var left = parseInt(number / 3) * (width + space) + space + (parseInt(number % 3) * width / 3);
    } else {
        var top = parseInt(number / 3) * (height + space) + space + (parseInt(number % 3) * height / 3);
        var left = (street - 9) * (width + space) + space;
    }

    const container = document.getElementById("simulator");
    container.scrollTop = top*7.3;
    container.scrollLeft = left;
}

function arrowUp(id, wd, hg, pl, pt) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
    var w = wd / 3;
    var h = hg / 2;

    ctx.beginPath();

    ctx.moveTo(pl + w, pt);
    ctx.lineTo(pl + w, pt + hg);
    ctx.moveTo(pl + w * 2, pt + h);
    ctx.lineTo(pl + w, pt);
    ctx.lineTo(pl, pt + h);

    ctx.strokeStyle = "#000";
    ctx.stroke();
}

function arrowDown(id, wd, hg, pl, pt) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
    var w = wd / 3;
    var h = hg / 2;

    ctx.beginPath();

    ctx.moveTo(pl + w, pt);
    ctx.lineTo(pl + w, pt + hg);
    ctx.moveTo(pl + w * 2, pt + h);
    ctx.lineTo(pl + w, pt + hg);
    ctx.lineTo(pl, pt + h);

    ctx.strokeStyle = "#000";
    ctx.stroke();
}

function arrowRight(id, wd, hg, pl, pt) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
    var w = wd / 3;
    var h = hg / 2;

    ctx.beginPath();

    ctx.moveTo(pl, pt);
    ctx.lineTo(pl + wd, pt);
    ctx.moveTo(pl, pt);
    ctx.moveTo(pl + h, pt - w);
    ctx.lineTo(pl + wd, pt);
    ctx.lineTo(pl + h, pt + w);

    ctx.strokeStyle = "#000";
    ctx.stroke();
}

function arrowLeft(id, wd, hg, pl, pt) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
    var w = wd / 3;
    var h = hg / 2;

    ctx.beginPath();

    ctx.moveTo(pl, pt);
    ctx.lineTo(pl + wd, pt);
    ctx.moveTo(pl, pt);
    ctx.moveTo(pl + h, pt - w);
    ctx.lineTo(pl, pt);
    ctx.lineTo(pl + h, pt + w);

    ctx.strokeStyle = "#000";
    ctx.stroke();
}