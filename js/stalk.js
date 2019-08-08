const Stalk = function(model, xRoot, yRoot) {
    const windNoise = cubicNoiseConfig(Math.random());
    const children = [];

    const Point = function(x, y) {
        this.x = x;
        this.y = y;
        this.nx = 0;
        this.ny = 1;
    };

    const points = [new Point(0, 0), new Point(0, 0)];

    const branch = (phytomers, maxLength, direction) => {
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
        children.push(newStalk);
    };

    this.getX = () => xRoot;
    this.getY = () => yRoot;

    this.extrude = (x, y, maxLength, direction, phytomers) => {
        x -= xRoot;
        y -= yRoot;

        points[points.length - 1].x = x;
        points[points.length - 1].y = y;

        const dx = x - points[points.length - 2].x;
        const dy = y - points[points.length - 2].y;

        if (Math.sqrt(dx * dx + dy * dy) > Stalk.RESOLUTION) {
            const normalDirection = Math.atan2(
                points[points.length - 1].y - points[points.length - 2].y,
                points[points.length - 1].x - points[points.length - 2].x) + Math.PI * 0.5;

            points[points.length - 1].nx = Math.cos(normalDirection);
            points[points.length - 1].ny = Math.sin(normalDirection);

            points.push(new Point(x, y));

            if (Math.random() < model.getBranchChance((points.length - 1) * Stalk.RESOLUTION, maxLength))
                if (maxLength > Stalk.RESOLUTION)
                    branch(phytomers, maxLength, direction);
        }
    };

    this.update = timeStep => {

    };

    this.draw = (context, lifetime) => {
        context.save();
        context.translate(xRoot, yRoot);
        context.rotate((cubicNoiseSample1(windNoise, lifetime * Stalk.WIND_SCALE) - 0.5) * model.getFlexibility());

        for (const child of children)
            child.draw(context, lifetime);

        const dxTip = points[points.length - 1].x - points[points.length - 2].x;
        const dyTip = points[points.length - 1].y - points[points.length - 2].y;
        const tipLength = Math.sqrt(dxTip * dxTip + dyTip * dyTip);
        let radius;

        context.beginPath();
        context.moveTo(points[points.length - 1].x, points[points.length - 1].y);

        for (let i = points.length - 1; i-- > 0;) {
            radius = model.sampleRadius(tipLength + (points.length - 2 - i) * Stalk.RESOLUTION);

            context.lineTo(
                points[i].x - points[i].nx * radius,
                points[i].y - points[i].ny * radius);
        }

        for (let i = 0; i < points.length - 1; ++i) {
            radius = model.sampleRadius(tipLength + (points.length - 2 - i) * Stalk.RESOLUTION);

            context.lineTo(
                points[i].x + points[i].nx * radius,
                points[i].y + points[i].ny * radius);
        }

        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    };
};

Stalk.RESOLUTION = 48;
Stalk.WIND_SCALE = 2;