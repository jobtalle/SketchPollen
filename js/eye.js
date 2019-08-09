const Eye = function() {
    const noise = cubicNoiseConfig(Math.random());
    const radius = 5;
    const pupilRadius = 2;

    this.draw = (context, x, y, lifetime) => {
        context.save();
        context.translate(x, y);

        context.fillStyle = "white";

        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();

        context.rotate(cubicNoiseSample1(noise, lifetime * Eye.NOISE_SCALE) * Math.PI);
        context.translate(radius - pupilRadius, 0);
        context.fillStyle = "#333333";

        context.beginPath();
        context.arc(0, 0, pupilRadius, 0, Math.PI * 2);
        context.fill();

        context.restore();
    };
};

Eye.NOISE_SCALE = 0.2;