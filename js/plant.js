const Stalk = function(model, x, y, root) {
    const Point = function(x, y) {
        this.x = x;
        this.y = y;
        this.nx = 1;
        this.ny = 0;
    };

    const points = [new Point(x, y), new Point(x, y)];

    const branch = (stalks, phytomers, maxLength, direction) => {
        const newStalk = new Stalk(
            model,
            points[points.length - 2].x,
            points[points.length - 2].y,
            false);
        const newPhytomer = new Phytomer(
            model,
            newStalk,
            maxLength * model.getBranchLengthScale(),
            direction);

        phytomers.push(newPhytomer);
        stalks.unshift(newStalk);
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
        const dxTip = points[points.length - 1].x - points[points.length - 2].x;
        const dyTip = points[points.length - 1].y - points[points.length - 2].y;
        const tipLength = Math.sqrt(dxTip * dxTip + dyTip * dyTip);
        let radius;

        context.fillStyle = "#65bf71";
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(points[points.length - 1].x, points[points.length - 1].y);

        for (let i = points.length - 1; i-- > 0;) {
            radius = model.sampleRadius(tipLength + (points.length - 2 - i) * Stalk.RESOLUTION);

            context.lineTo(
                points[i].x - points[i].nx * radius,
                points[i].y - points[i].ny * radius);
        }

        if (root)
            context.arc(x, y, radius, Math.PI, Math.PI * 2, true);

        for (let i = 0; i < points.length - 1; ++i) {
            radius = model.sampleRadius(tipLength + (points.length - 2 - i) * Stalk.RESOLUTION);

            context.lineTo(
                points[i].x + points[i].nx * radius,
                points[i].y + points[i].ny * radius);
        }

        context.closePath();
        context.fill();
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
    const stalks = [new Stalk(model, x, floor, true)];
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