var mapDataString = "";

document.getElementById('switchpallette').addEventListener('click', function() {
    let pallette = document.getElementById('wrap__pallette');

    if (pallette.hidden === false) {
        pallette.hidden = true;
    } else {
        document.getElementById('pallette').style.cssText = `display: flex;`;
        pallette.hidden = false;
    }
});

document.getElementById('pallette').querySelectorAll('li').forEach(e => {
    e.addEventListener('click', () => {
        let color = document.getElementById('user__pallette');
        let a = e.cloneNode(true);
        a.style.cssText = `list-style: none;`;

        let flag = true;
        color.querySelectorAll('li').forEach(el => {
            if (a.getAttribute('id') === el.getAttribute('id')) {
                flag = false;
            }
        })

        if (flag) {
            color.append(a);
        }

    });
});

document.getElementById('button__reset').addEventListener('click', () => {
    let userPallette = document.getElementById('user__pallette').querySelectorAll('li').forEach((e) => {
        e.remove();
    });
});

document.getElementById('button__save').addEventListener('click', () => {
    let button = document.getElementById('button__save');

    let pallette = document.getElementById('wrap__pallette');
    pallette.hidden = true;
});

document.getElementById('button__draw').addEventListener('click', () => {
    let colors = "";
    
    document.getElementById('user__pallette').querySelectorAll('li').forEach((e) => {
        colors += e.dataset.value;
    });

    if (mapDataString === undefined) return;

    // let mapDataString = ganeration(10);

    let parseData = parse(mapDataString),
        normalizationData = dataNormalization(parseData),
        lastData = makeStruct(normalizationData);
    
    let canvas = heatmapfromdata('canvas');

    let dataColors = canvas.parseColors(colors),
        gradientData = canvas.linearInterpolation(dataColors);


    canvas.gradient(gradientData);
    canvas.data(lastData);
    canvas.draw();   


    let test_colors = document.getElementById('test_canvas'),
        ctx = test_colors.getContext('2d');

    for(let i = 0, color = 0; i < gradientData.length; i+=8, color++) {
        ctx.fillStyle = 'rgb(' + gradientData[i] + ',' + gradientData[i + 1] + ',' + gradientData[i + 2] + ')';
        ctx.fillRect(0, i, 600,7);
    }


});

document.getElementById('button__select__file').addEventListener('change', () => {
    let file = document.querySelector('input[type=file]').files[0];
        reader = new FileReader();

    reader.readAsText(file);
    
    reader.onload = function(e) {
        mapDataString = e.target.result;  
    }
});






