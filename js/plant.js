const Stalk = function(model, x, y) {
    const Point = function(x, y) {
        this.x = x;
        this.y = y;
    };

    const points = [new Point(x, y), new Point(x, y)];

    const branch = (stalks, phytomers, maxLength, direction) => {
        const newStalk = new Stalk(
            model,
            points[points.length - 2].x,
            points[points.length - 2].y);
        const newPhytomer = new Phytomer(
            model,
            newStalk,
            maxLength * model.getBranchLengthScale(),
            direction);

        phytomers.push(newPhytomer);
        stalks.push(newStalk);
    };

    this.getX = () => x;
    this.getY = () => y;

    this.extrude = (x, y, maxLength, direction, stalks, phytomers) => {
        points[points.length - 1].x = x;
        points[points.length - 1].y = y;

        const dx = x - points[points.length - 2].x;
        const dy = y - points[points.length - 2].y;

        if (Math.sqrt(dx * dx + dy * dy) > Stalk.RESOLUTION) {
            points.push(new Point(x, y));

            if (Math.random() < model.getBranchChance((points.length - 1) * Stalk.RESOLUTION, maxLength))
                branch(stalks, phytomers, maxLength, direction);
        }
    };

    this.update = timeStep => {

    };

    this.draw = context => {
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; ++i)
            context.lineTo(points[i].x, points[i].y);

        context.stroke();
    };
};

Stalk.RESOLUTION = 32;

const Phytomer = function(model, stalk, maxLength, directionOffset) {
    const noise = cubicNoiseConfig(Math.random());
    let direction;
    let x = stalk.getX();
    let y = stalk.getY();
    let length = 0;

    maxLength = Math.max(model.makePhytomerLength(maxLength), Stalk.RESOLUTION);

    const sampleDirection = () => {
        direction = Math.PI + cubicNoiseSample2(
            noise,
            x * Phytomer.NOISE_SCALE,
            y * Phytomer.NOISE_SCALE) * Math.PI;
    };

    this.update = (timeStep, growthSpeed, stalks, phytomers) => {
        const delta = growthSpeed * timeStep;

        if ((length += delta) > maxLength)
            return true;

        x += Math.cos(direction + directionOffset) * delta;
        y += Math.sin(direction + directionOffset) * delta;

        stalk.extrude(
            x,
            y,
            maxLength - length,
            direction + directionOffset,
            stalks,
            phytomers);

        sampleDirection();

        return false;
    };

    sampleDirection();

    if (directionOffset)
        directionOffset = directionOffset - direction;
};

Phytomer.NOISE_SCALE = 0.01;

const Plant = function(model, x, floor, ceiling) {
    const growthSpeed = Plant.GROWTH_SPEED_MIN + (Plant.GROWTH_SPEED_MAX - Plant.GROWTH_SPEED_MIN) * Math.random();
    const stalks = [new Stalk(model, x, floor)];
    const phytomers = [new Phytomer(model, stalks[0], floor - ceiling, null)];

    this.draw = context => {
        for (const stalk of stalks)
            stalk.draw(context);
    };

    this.update = timeStep => {
        for (let i = phytomers.length; i-- > 0;)
            if (phytomers[i].update(timeStep, growthSpeed, stalks, phytomers))
                phytomers.splice(i, 1);

        return false;
    };
};

Plant.GROWTH_SPEED_MIN = 16;
Plant.GROWTH_SPEED_MAX = 32;