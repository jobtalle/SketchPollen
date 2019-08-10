const Wings = function() {
    let wingAngleIndex = 0;

    const drawWing = context => {
        context.beginPath();
        context.moveTo(0, 0);

        for (let i = 1; i < Wings.PRECISION; ++i) {
            const f = i / (Wings.PRECISION + 1);
            const r = (Math.cos((f + 0.5) * Math.PI * 2) * 0.5 + 0.5) * Wings.RADIUS;
            const a = f * Wings.SIZE;

            context.lineTo(
                Math.cos(a) * r,
                Math.sin(a) * r);
        }

        context.closePath();
        context.fill();
    };

    this.draw = (context, x, y, vx) => {
        const motionAngle = vx * Wings.SIDE_ANGLE;

        if (++wingAngleIndex === Wings.ANGLES.length)
            wingAngleIndex = 0;

        context.save();

        context.translate(x, y);
        context.fillStyle = "rgba(246,246,246,0.5)";

        context.save();
        context.rotate(Wings.ANGLES[wingAngleIndex] + Math.min(0, motionAngle));

        drawWing(context);

        context.restore();
        context.scale(-1, 1);
        context.save();
        context.rotate(Wings.ANGLES[wingAngleIndex] - Math.max(0, motionAngle));

        drawWing(context);

        context.restore();
        context.restore();
    };
};

Wings.ANGLES = [-1.1, -1.3, -1.5, -1.3];
Wings.RADIUS = 80;
Wings.SIZE = 2;
Wings.PRECISION = 10;
Wings.SIDE_ANGLE = 0.006;