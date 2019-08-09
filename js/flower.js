const Flower = function(model, x, y, direction) {
    const noise = cubicNoiseConfig(Math.random());
    const radius = model.getRadius();
    const pistilCount = model.getPistilCount();
    const pistilAngles = model.getPistilAngles(pistilCount);
    const pistilLengths = model.getPistilLengths(pistilCount, radius);
    const pollen = new Array(pistilCount);
    const petalCount = model.getPetalCount();
    const petalLength = model.getPetalLength();
    const petalWidths = model.getPetalWidths();
    const petalColors = model.getPetalColors();
    let grown = 0;
    let lifetime = 0;
    let wiggle = 0;
    let pollCount = model.getPistilCount();
    let claimed = 0;

    const makePollen = () => {
        for (let i = 0; i < pollen.length; ++i)
            pollen[i] = new Poll();
    };

    const drawPetals = context => {
        context.save();
        context.scale(grown, grown);

        for (let i = 0; i < petalCount; ++i) {
            context.fillStyle = petalColors[i % petalColors.length];

            context.beginPath();
            context.moveTo(0, 0);

            for (let i = 1; i <  petalWidths.length; ++i)
                context.lineTo((i / (petalCount - 1)) * petalLength, -petalWidths[i]);

            for (let i =  petalWidths.length; i-- > 1;)
                context.lineTo((i / (petalCount - 1)) * petalLength, petalWidths[i]);

            context.closePath();
            context.fill();

            context.rotate((Math.PI * 2) / petalCount);
        }

        context.restore();
    };

    this.getPollCount = () => pollCount;
    this.isGrown = () => grown === 1;
    this.isClaimed = () => claimed !== 0;
    this.getX = () => x;
    this.getY = () => y;
    this.getRadius = () => radius;

    this.claim = () => {
        ++claimed;
    };

    this.unclaim = () => {
        --claimed;
    };

    this.grabPoll = poll => {
        for (let i = 0; i < pollen.length; ++i) if (pollen[i] === poll) {
            pollen[i] = null;

            --pollCount;

            break;
        }
    };

    this.findPoll = (x, y, reach, yMin) => {
        const reachSquared = reach * reach;
        let shortest = null;
        let candidate = null;

        for (const poll of pollen) if (poll) {
            if (poll.getY() < yMin)
                continue;

            const dx = poll.getX() - x;
            const dy = poll.getY() - y;
            const d = dx * dx + dy * dy;

            if (d < reachSquared && (shortest === null || d < shortest)) {
                shortest = d;

                candidate = poll;
            }
        }

        return candidate;
    };

    this.setPosition = (newX, newY) => {
        x = newX;
        y = newY;

        for (let i = 0; i < pollen.length; ++i) {
            if (!pollen[i])
                continue;

            const length = pistilLengths[i] * grown * grown;
            const angle = pistilAngles[i] + direction + wiggle;

            pollen[i].setPosition(
                x + Math.cos(angle) * length,
                y + Math.sin(angle) * length);
        }
    };

    this.update = timeStep => {
        lifetime += timeStep;
        wiggle = (cubicNoiseSample1(noise, lifetime * model.getWiggleSpeed()) - 0.5) * model.getWiggleAmplitude();

        if (grown !== 1) {
            if (lifetime > model.getGrowTime())
                grown = 1;
            else
                grown = Math.min(1, 0.5 + 0.5 * Math.cos((lifetime / model.getGrowTime() + 1) * Math.PI));
        }

        for (const poll of pollen) if (poll)
            poll.grow(timeStep);
    };

    this.draw = context => {
        context.lineWidth = 2;
        context.strokeStyle = Poll.COLOR;

        context.save();
        context.translate(x, y);
        context.rotate(direction + wiggle);

        drawPetals(context);

        for (let i = 0; i < pistilCount; ++i) {
            const length = pistilLengths[i] * grown * grown;
            const angle = pistilAngles[i];

            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(
                Math.cos(angle) * length,
                Math.sin(angle) * length);
            context.stroke();
        }

        context.restore();

        for (const poll of pollen) if (poll)
            poll.draw(context);
    };

    makePollen();
};