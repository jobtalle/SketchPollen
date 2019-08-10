const Stalk = function(model, xRoot, yRoot, direction, nChild, isRoot) {
    const Coordinate = function(x, y) {
        this.x = x;
        this.y = y;
    };

    const transform = new Transform();
    const windNoise = cubicNoiseConfig(Math.random());
    const flexibility = model.getFlexibility();
    const children = [];
    const leaves = [];
    const lefts = [new Coordinate(0, 0)];
    const rights = [new Coordinate(0, 0)];
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
        const dx = points[points.length - 2].x - points[points.length - 3].x;
        const dy = points[points.length - 2].y - points[points.length - 3].y;
        const f = Math.random();
        const angle = Math.atan2(dy, dx);

        const newLeaf = new Leaf(
            model.getLeafModel(),
            points[points.length - 3].x + dx * f,
            points[points.length - 3].y + dy * f,
            angle + (direction - angle) * f);

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

    const updatePoints = () => {
        const dxTip = points[points.length - 1].x - points[points.length - 2].x;
        const dyTip = points[points.length - 1].y - points[points.length - 2].y;
        const tipLength = Math.sqrt(dxTip * dxTip + dyTip * dyTip);

        for (let i = 0; i < points.length - 1; ++i) {
            const radius = model.sampleRadius(tipLength + (points.length - 2 - i) * Stalk.RESOLUTION);

            lefts[i].x = points[i].x - points[i].nx * radius;
            lefts[i].y = points[i].y - points[i].ny * radius;
            rights[i].x = points[i].x + points[i].nx * radius;
            rights[i].y = points[i].y + points[i].ny * radius;
        }
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
            lefts.push(new Coordinate(0, 0));
            rights.push(new Coordinate(0, 0));

            if (Math.random() < model.getBranchChance((points.length - 1) * Stalk.RESOLUTION, maxLength)) {
                if (maxLength > Stalk.RESOLUTION)
                    branch(phytomers, maxLength, direction);
            }
            else if (Math.random() < model.getLeafChance((points.length - 1) * Stalk.RESOLUTION, maxLength))
                makeLeaf(direction);
        }

        updatePoints();
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

        context.beginPath();
        context.moveTo(points[points.length - 1].x, points[points.length - 1].y);

        for (let i = points.length - 1; i-- > 0;)
            context.lineTo(lefts[i].x, lefts[i].y);

        for (let i = 0; i < points.length - 1; ++i)
            context.lineTo(rights[i].x, rights[i].y);

        context.closePath();
        context.fill();
        context.fillStyle = model.getLeafModel().getColor();

        for (const leaf of leaves)
            leaf.draw(context);

        context.restore();
    };
};

Stalk.RESOLUTION = 32;
Stalk.WIND_SCALE = 3;