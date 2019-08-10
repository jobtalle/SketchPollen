const Phytomer = function(model, stalk, maxLength, directionOffset) {
    const noise = cubicNoiseConfig(Math.random());
    let direction;
    let x = stalk.getX();
    let y = stalk.getY();
    let length = 0;

    maxLength = Math.max(model.makePhytomerLength(maxLength), Stalk.RESOLUTION);

    const sampleDirection = () => {
        direction = (cubicNoiseSample1(noise, length * model.getNoiseScale()) - 0.5) * Math.PI;
    };

    this.update = (timeStep, growthSpeed, phytomers, flowers) => {
        const delta = growthSpeed * timeStep;

        if ((length += delta) > maxLength) {
            stalk.createFlower(flowers, direction);

            return true;
        }

        x += Math.cos(direction + directionOffset) * delta;
        y += Math.sin(direction + directionOffset) * delta;

        stalk.extrude(
            x,
            y,
            maxLength - length,
            length / maxLength,
            direction + directionOffset,
            phytomers);

        sampleDirection();

        return false;
    };

    sampleDirection();

    if (directionOffset)
        directionOffset = directionOffset - direction;
};