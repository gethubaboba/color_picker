document.addEventListener('DOMContentLoaded', () => {
const imageCanvas = document.getElementById('imageCanvas');
    const loadedImage = document.getElementById('loadedImage');
    const colorPreview = document.getElementById('colorPreview');
    const ctx = imageCanvas.getContext('2d');

    // Ползунки и числовые поля для RGB
    const rInput = document.getElementById('r');
    const gInput = document.getElementById('g');
    const bInput = document.getElementById('b');
    const rValInput = document.getElementById('r_val');
    const gValInput = document.getElementById('g_val');
    const bValInput = document.getElementById('b_val');

    // Ползунки и числовые поля для XYZ
    const xInput = document.getElementById('x');
    const yInput = document.getElementById('y');
    const zInput = document.getElementById('z');
    const xValInput = document.getElementById('x_val');
    const yValInput = document.getElementById('y_val');
    const zValInput = document.getElementById('z_val');

    // Ползунки и числовые поля для HLS
    const hInput = document.getElementById('h');
    const lInput = document.getElementById('l');
    const sInput = document.getElementById('s');
    const hValInput = document.getElementById('h_val');
    const lValInput = document.getElementById('l_val');
    const sValInput = document.getElementById('s_val');

    // Когда изображение загружено, отрисовать его на canvas
    loadedImage.onload = function () {
        imageCanvas.width = loadedImage.width;
        imageCanvas.height = loadedImage.height;
        ctx.drawImage(loadedImage, 0, 0);
    };

    // Обработчик кликов по изображению
    loadedImage.addEventListener('click', function (event) {
        const rect = loadedImage.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Извлекаем цвет пикселя
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];

        // Обновляем RGB
        rInput.value = r;
        gInput.value = g;
        bInput.value = b;
        rValInput.value = r;
        gValInput.value = g;
        bValInput.value = b;
        
        // Превью цвета
        colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        // Конвертируем RGB в XYZ и HLS и обновляем их значения
        const xyz = rgbToXyz(r, g, b);
        updateXyzInputs(xyz);

        const hls = rgbToHls(r, g, b);
        updateHlsInputs(hls);
    });



    // Обновление RGB
    function updateRgb() {
        const r = parseInt(rInput.value);
        const g = parseInt(gInput.value);
        const b = parseInt(bInput.value);


        const xyz = rgbToXyz(r, g, b);
        updateXyzInputs(xyz);

        const hls = rgbToHls(r, g, b);
        updateHlsInputs(hls);

        colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    // Обновление XYZ
    function updateXyz() {
        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);
        const z = parseFloat(zInput.value);

        const rgb = xyzToRgb(x, y, z);
        updateRgbInputs(rgb);
        updateRgb();
    }

    // Обновление HLS
    function updateHls() {
        const h = parseInt(hInput.value);
        const l = parseInt(lInput.value);
        const s = parseInt(sInput.value);

        const rgb = hlsToRgb(h, l, s);
        updateRgbInputs(rgb);
        updateRgb();
    }

    // Обновление значений RGB
    function updateRgbInputs(rgb) {
        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;
        rValInput.value = rgb.r
        gValInput.value = rgb.g
        bValInput.value = rgb.b
        }

    // Обновление значений XYZ
    function updateXyzInputs(xyz) {
        xInput.value = xyz.x.toFixed(2);
        yInput.value = xyz.y.toFixed(2);
        zInput.value = xyz.z.toFixed(2);
        xValInput.value = xyz.x.toFixed(2);
        yValInput.value = xyz.y.toFixed(2);
        zValInput.value = xyz.z.toFixed(2);
    }

    // Обновление значений HLS
    function updateHlsInputs(hls) {
        hInput.value = hls.h;
        lInput.value = hls.l;
        sInput.value = hls.s;
        hValInput.value = hls.h;
        lValInput.value = hls.l;
        sValInput.value = hls.s;
    }

    function bindInputs(slider, numInput, updateFunc) {
        slider.addEventListener('input', () => {
            numInput.value = slider.value;
            updateFunc();
        });

        numInput.addEventListener('input', () => {
            slider.value = numInput.value;
            updateFunc();
        });
    }

    // Привязываем все поля к соответствующим функциям
    bindInputs(rInput, rValInput, updateRgb);
    bindInputs(gInput, gValInput, updateRgb);
    bindInputs(bInput, bValInput, updateRgb);

    bindInputs(xInput, xValInput, updateXyz);
    bindInputs(yInput, yValInput, updateXyz);
    bindInputs(zInput, zValInput, updateXyz);

    bindInputs(hInput, hValInput, updateHls);
    bindInputs(lInput, lValInput, updateHls);
    bindInputs(sInput, sValInput, updateHls);


    // События для обновления цвета
    rInput.addEventListener('input', updateRgb);
    gInput.addEventListener('input', updateRgb);
    bInput.addEventListener('input', updateRgb);

    xInput.addEventListener('input', updateXyz);
    yInput.addEventListener('input', updateXyz);
    zInput.addEventListener('input', updateXyz);

    hInput.addEventListener('input', updateHls);
    lInput.addEventListener('input', updateHls);
    sInput.addEventListener('input', updateHls);

    updateRgb(); // Инициализация
});

// Конвертация RGB → XYZ
function rgbToXyz(r, g, b) {
    r = r / 255; g = g / 255; b = b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    return { x: x * 100, y: y * 100, z: z * 100 };
}

// Конвертация XYZ → RGB
function xyzToRgb(x, y, z) {
    x = x / 100; y = y / 100; z = z / 100;
    let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92;

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// Конвертация RGB → HLS
function rgbToHls(r, g, b) {
    r = r / 255; g = g / 255; b = b / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, l = (max + min) / 2;
    let s = 0;

    if (max !== min) {
        let delta = max - min;
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

        switch (max) {
            case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
            case g: h = (b - r) / delta + 2; break;
            case b: h = (r - g) / delta + 4; break;
        }

        h /= 6;
    }

    return { h: Math.round(h * 360), l: Math.round(l * 100), s: Math.round(s * 100) };
}

// Конвертация HLS → RGB
function hlsToRgb(h, l, s) {
    h /= 360; l /= 100; s /= 100;
    if (s === 0) return { r: l * 255, g: l * 255, b: l * 255 };

    function hueToRgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    let r = hueToRgb(p, q, h + 1 / 3);
    let g = hueToRgb(p, q, h);
    let b = hueToRgb(p, q, h - 1 / 3);

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}