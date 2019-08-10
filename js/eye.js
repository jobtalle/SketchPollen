const Eye = function() {
    const noise = cubicNoiseConfig(Math.random());

    this.draw = (context, x, y, lifetime) => {
        context.save();
        context.translate(x, y);

        context.fillStyle = "white";

        context.beginPath();
        context.arc(0, 0, Eye.RADIUS, 0, Math.PI * 2);
        context.fill();

        context.rotate(cubicNoiseSample1(noise, lifetime * Eye.NOISE_SCALE) * Math.PI);
        context.translate(Eye.RADIUS - Eye.PUPIL_RADIUS, 0);
        context.fillStyle = "#333333";

        context.beginPath();
        context.arc(0, 0, Eye.PUPIL_RADIUS, 0, Math.PI * 2);
        context.fill();

        context.restore();
    };
};

Eye.RADIUS = 6;
Eye.PUPIL_RADIUS = 2.5;
Eye.NOISE_SCALE = 0.75;