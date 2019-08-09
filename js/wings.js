const Wings = function() {
    const radius = 90;
    const size = 1.7;
    const wingAngles = [-1.1, -1.25, -1.4, -1.25];
    let wingAngleIndex = 0;

    const drawWing = context => {
        context.beginPath();
        context.moveTo(0, 0);

        for (let i = 1; i < Wings.PRECISION; ++i) {
            const f = i / (Wings.PRECISION + 1);
            const r = (Math.cos((f + 0.5) * Math.PI * 2) * 0.5 + 0.5) * radius;
            const a = f * size;

            context.lineTo(
                Math.cos(a) * r,
                Math.sin(a) * r);
        }

        context.closePath();
        context.fill();
        context.stroke();
    };

    this.draw = (context, x, y, vx) => {
        const motionAngle = vx * Wings.SIDE_ANGLE;

        if (++wingAngleIndex === wingAngles.length)
            wingAngleIndex = 0;

        context.save();

        context.translate(x, y);
        context.fillStyle = "#dadada55";
        context.strokeStyle = "#00000099";

        context.save();
        context.rotate(wingAngles[wingAngleIndex] + Math.min(0, motionAngle));

        drawWing(context);

        context.restore();
        context.scale(-1, 1);
        context.save();
        context.rotate(wingAngles[wingAngleIndex] - Math.max(0, motionAngle));

        drawWing(context);

        context.restore();
        context.restore();
    };
};

Wings.PRECISION = 10;
Wings.SIDE_ANGLE = 0.005;