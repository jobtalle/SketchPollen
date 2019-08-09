const Leaf = function(model, x, y, direction) {
    const noise = cubicNoiseConfig(Math.random());
    const widths = [];
    const length = model.getLength();
    const radius = model.getRadius();
    const offsetAngle = model.getOffsetAngle() * (Math.random() < 0.5 ? 1 : -1);
    const growTime = model.getGrowTime();
    let lifetime = 0;
    let angle = 0;
    let scale = 0;

    const makeWidths = () => {
        for (let i = 0; i < Leaf.PRECISION; ++i) {
            const x = 2 * (i / (Leaf.PRECISION - 1)) - 1;

            widths[i] = (1 - x * x) * radius;
        }
    };

    this.update = timeStep => {
        lifetime += timeStep;

        angle = (cubicNoiseSample1(noise, lifetime * Leaf.NOISE_SCALE) - 0.5) * Leaf.WIGGLE_AMPLITUDE;
        scale = Math.min(1, lifetime / growTime);
    };

    this.draw = (context) => {
        context.save();
        context.translate(x, y);
        context.rotate(direction + angle + offsetAngle);
        context.scale(scale, scale);

        context.fillStyle = Leaf.COLOR;
        context.beginPath();
        context.moveTo(0, 0);

        for (let i = 1; i < widths.length; ++i)
            context.lineTo((i / (widths.length - 1)) * length, -widths[i]);

        for (let i = widths.length; i-- > 1;)
            context.lineTo((i / (widths.length - 1)) * length, widths[i]);

        context.closePath();
        context.fill();

        context.restore();
    };

    makeWidths();
};

Leaf.NOISE_SCALE = 2;
Leaf.WIGGLE_AMPLITUDE = 0.5;
Leaf.COLOR = "rgb(174,223,95)";
Leaf.PRECISION = 8;