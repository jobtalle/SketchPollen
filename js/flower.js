const Flower = function(model, x, y, direction) {
    const noise = cubicNoiseConfig(Math.random());
    const pollen = new Array(model.getPistilCount());
    let grown = 0;
    let lifetime = 0;
    let wiggle = 0;

    const makePollen = () => {
        for (let i = 0; i < pollen.length; ++i)
            pollen[i] = new Poll();
    };

    this.setPosition = (newX, newY) => {
        x = newX;
        y = newY;

        for (let i = 0; i < pollen.length; ++i) {
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
            grown = Math.min(1, lifetime / model.getGrowTime());
        }
        else {
            for (const poll of pollen)
                poll.grow(timeStep);
        }
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

        for (const poll of pollen)
            poll.draw(context);
    };

    makePollen();
};