const FlowerModel = function(
    petalColors,
    power,
    width,
    petalCount,
    petalLength
) {
    this.getPetalWidths = () => {
        const widths = [];

        for (let i = 1; i < FlowerModel.PETAL_PRECISION - 1; ++i) {
            const x = 2 * (i / (FlowerModel.PETAL_PRECISION - 1)) - 1;

            widths.push(Math.pow(1 - x * x, power) * width);
        }

        return widths;
    };

    this.getPetalLength = () => {
        return petalLength;
    };

    this.getPetalCount = () => {
        return petalCount;
    };

    this.getPetalColors = () => {
        return petalColors;
    };

    this.getRadius = () => {
        return petalLength * FlowerModel.PISTIL_FACTOR;
    };

    this.getPistilCount = () => {
        return 24;
    };

    this.getPistilAngles = pistilCount => {
        const pistilAngles = [];

        for (let i = 0; i < pistilCount; ++i)
            pistilAngles.push(Math.PI * 2 * (i / pistilCount));

        return pistilAngles;
    };

    this.getPistilLengths = (pistilCount, radius) => {
        const pistilLengths = [];

        for (let i = 0; i < pistilCount; ++i)
            pistilLengths.push(radius * Math.random());

        return pistilLengths;
    };

    this.getGrowTime = () => {
        return 5;
    };

    this.getWiggleSpeed = () => {
        return 2;
    };

    this.getWiggleAmplitude = () => {
        return 0.35;
    };

    petalCount = Math.floor(petalCount / petalColors.length) * petalColors.length;
};

FlowerModel.PETAL_PRECISION = 8;
FlowerModel.PISTIL_FACTOR = 0.7;