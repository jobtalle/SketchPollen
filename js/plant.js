const Stalk = function(x, y) {
    const Point = function(x, y) {
        this.x = x;
        this.y = y;
    };

    const points = [new Point(x, y), new Point(x, y)];

    this.getX = () => x;
    this.getY = () => y;

    this.extrude = (x, y) => {
        points[points.length - 1].x = x;
        points[points.length - 1].y = y;

        const dx = x - points[points.length - 2].x;
        const dy = y - points[points.length - 2].y;

        if (Math.sqrt(dx * dx + dy * dy) > Stalk.RESOLUTION)
            points.push(new Point(x, y));
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

Stalk.RESOLUTION = 64;

const Phytomer = function(stalk) {
    const noise = cubicNoiseConfig(Math.random());
    let direction;
    let x = stalk.getX();
    let y = stalk.getY();

    const sampleDirection = () => {
        direction = cubicNoiseSample2(
            noise,
            x * Phytomer.NOISE_SCALE,
            y * Phytomer.NOISE_SCALE) * Math.PI * 2;
    };

    this.update = (timeStep, growthSpeed) => {
        x += Math.cos(direction) * growthSpeed * timeStep;
        y += Math.sin(direction) * growthSpeed * timeStep;

        stalk.extrude(x, y);

        sampleDirection();

        return false;
    };

    sampleDirection();
};

Phytomer.NOISE_SCALE = 0.01;

const Plant = function(x, floor, ceiling) {
    const growthSpeed = Plant.GROWTH_SPEED_MIN + (Plant.GROWTH_SPEED_MAX - Plant.GROWTH_SPEED_MIN) * Math.random();
    const stalks = [new Stalk(x, floor)];
    const phytomers = [new Phytomer(stalks[0])];

    this.draw = context => {
        for (const stalk of stalks)
            stalk.draw(context);

        context.fillStyle = "blue";
        context.beginPath();
        context.arc(x, floor, 12, 0, Math.PI * 2);
        context.fill();
    };

    this.update = timeStep => {
        for (let i = phytomers.length; i-- > 0;)
            if (phytomers[i].update(timeStep, growthSpeed))
                phytomers.splice(i, 1);

        return false;
    };
};

Plant.GROWTH_SPEED_MIN = 16;
Plant.GROWTH_SPEED_MAX = 32;