const Flower = function(model, x, y, direction) {
    const noise = cubicNoiseConfig(Math.random());
    const pollen = new Array(model.getPistilCount());
    let grown = 0;
    let lifetime = 0;
    let wiggle = 0;
    let pollCount = model.getPistilCount();
    let claimed = false;

    const makePollen = () => {
        for (let i = 0; i < pollen.length; ++i)
            pollen[i] = new Poll();
    };

    this.getPollCount = () => pollCount;
    this.isGrown = () => grown === 1;
    this.isClaimed = () => claimed;
    this.getX = () => x;
    this.getY = () => y;
    this.getRadius = () => model.getRadius();

    this.claim = () => {
        claimed = true;
    };

    this.unclaim = () => {
        claimed = false;
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

            const length = model.getPistilLengths()[i] * grown;
            const angle = model.getPistilAngles()[i] + direction + wiggle;

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
        context.save();
        context.translate(x, y);
        context.rotate(direction + wiggle);

        context.strokeStyle = "black";

        for (let i = 0; i < model.getPistilCount(); ++i) {
            const length = model.getPistilLengths()[i] * grown;
            const angle = model.getPistilAngles()[i];

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