var attrLevel = [0, 0, 0, 0, 0, 0, 0];

function BoostMenu(marginLeft, marginTop) {
    const menuColor = ['#e6af88', '#e666ea', '#9466e9', '#6690ea', '#ea6666', '#93ea66', '#66eae6'];
    const attrName = ['Health Regen', 'Max Health', 'Body Damage', 'Bullet Speed', 'Bullet Damage', 'Reload', 'Movement Speed'];
    const H = 20;  // Height
    const W = 220; // Width
    let Lm = marginLeft; // Left Margin
    let Tm = marginTop; // Top Margin

    for(let i = 0; i < menuColor.length; i++) {
        $('#mycanvas').drawRect({
            fillStyle: '#383838',
            x: Lm + W/2, y: Tm + H/2,
            width: W,
            height: H,
            opacity: 0.8,
            cornerRadius: H/2,
            layer: true
        }).drawRect({
            fillStyle: menuColor[i],
            x: Lm + 2, y: Tm + H/2,
            width: 0,
            height: H - 4,
            cornerRadius: H/2 - 2,
            layer: true,
            name: 'boostRect' + i,
            groups: ['boostRects']
        }).drawArc({
            fillStyle: menuColor[i],
            x: Lm + W - H/2, y: Tm + H/2,
            radius: H/2 - 2,
            layer: true,
            click: function(layer) {
                if($(this).getLayer('boostRect' + i).width >= 180)
                    return;
                $(this).setLayer('boostRect' + i, {
                    x: '+=10',
                    width: '+=20'
                }).drawLayers();
                attrLevel[i] += 1;
            }
        }).drawText({
            fillStyle: '#ffffff',
            x: Lm + W/2 - 20, y: Tm + H/2,
            fontSize: 12,
            fontStyle: 'bold',
            fontFamily: 'Ubuntu, sans-serif',
            text: attrName[i],
            align: 'center',
            mask: true,
            layer: true
        }).drawText({
            fillStyle: '#ffffff',
            x: Lm + W - 30, y: Tm + H/2,
            fontSize: 10,
            fontStyle: 'bold',
            fontFamily: 'Ubuntu, sans-serif',
            text: '[' + (i + 1) + ']',
            align: 'right',
            mask: true,
            layer: true
        }).drawLine({
            strokeStyle: '#525252',
            strokeWidth: 4,
            x1: Lm + W - H/2 - 5, y1: Tm + H/2,
            x2: Lm + W - H/2 + 5, y2: Tm + H/2,
            layer: true,
            intangible: true
        }).drawLine({
            strokeStyle: '#525252',
            strokeWidth: 4,
            x1: Lm + W - H/2, y1: Tm + H/2 - 5,
            x2: Lm + W - H/2, y2: Tm + H/2 + 5,
            layer: true,
            intangible: true
        });
        Tm += 25;
    }
};