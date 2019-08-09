const Stalk = function(model, xRoot, yRoot, direction, nChild, isRoot) {
    const transform = new Transform();
    const windNoise = cubicNoiseConfig(Math.random());
    const flexibility = model.getFlexibility();
    const children = [];
    const leaves = [];
    let angle;
    let flower = null;
    let xTip, yTip;

    const Point = function(x, y) {
        this.x = x;
        this.y = y;
        this.nx = Math.cos(direction + Math.PI * 0.5);
        this.ny = Math.sin(direction + Math.PI * 0.5);
    };

    const points = [new Point(0, 0), new Point(0, 0)];

    const branch = (phytomers, maxLength, direction) => {
        const newStalk = new Stalk(
            model,
            points[points.length - 2].x,
            points[points.length - 2].y,
            direction,
            nChild + 1,
            false);
        const newPhytomer = new Phytomer(
            model,
            newStalk,
            maxLength * model.getBranchLengthScale(),
            direction);

        phytomers.push(newPhytomer);
        children.push(newStalk);
    };

    const makeLeaf = (direction) => {
        const newLeaf = new Leaf(
            model.getLeafModel(),
            points[points.length - 2].x,
            points[points.length - 2].y,
            direction);

        leaves.push(newLeaf);
    };

    const calculateTip = () => {
        const v = {
            x: points[points.length - 1].x,
            y: points[points.length - 1].y
        };

        transform.apply(v);

        xTip = v.x;
        yTip = v.y;

        if (flower)
            flower.setPosition(xTip, yTip);
    };

    this.getX = () => xRoot;
    this.getY = () => yRoot;

    this.createFlower = (flowers, direction) => {
        if (!isRoot)
            return;

        flower = new Flower(model.getFlowerModel(), xTip, yTip, direction);

        flowers.push(flower);
    };

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

            if (Math.random() < model.getBranchChance((points.length - 1) * Stalk.RESOLUTION, maxLength)) {
                if (maxLength > Stalk.RESOLUTION)
                    branch(phytomers, maxLength, direction);
            }
            else if (Math.random() < model.getLeafChance((points.length - 1) * Stalk.RESOLUTION, maxLength))
                makeLeaf(direction);
        }
    };

    this.update = (timeStep, lifetime) => {
        for (const child of children)
            child.update(timeStep, lifetime);

        for (const leaf of leaves)
            leaf.update(timeStep);

        if (flower)
            flower.update(timeStep);

        angle = (cubicNoiseSample1(windNoise, lifetime * Stalk.WIND_SCALE) - 0.5) * flexibility * nChild;
    };

    this.draw = (context, t) => {
        transform.set(t);

        context.save();
        context.translate(xRoot, yRoot);
        context.rotate(angle);

        transform.translate(xRoot, yRoot);
        transform.rotate(-angle);

        calculateTip();

        for (const child of children)
            child.draw(context, t);

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

        for (const leaf of leaves)
            leaf.draw(context);

        context.restore();
    };
};

Stalk.RESOLUTION = 32;
Stalk.WIND_SCALE = 3;