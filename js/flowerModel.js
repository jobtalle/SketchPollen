const FlowerModel = function() {
    const petalCount = 12;
    const petalLength = 140;
    const petalColors = [
        "#c0a7da",
        "#9c7fc0"];

    this.getPetalWidths = () => {
        const petalWidth = 10;
        const widths = [];

        for (let i = 0; i < FlowerModel.PETAL_PRECISION; ++i) {
            const x = 2 * (i / (FlowerModel.PETAL_PRECISION - 1)) - 1;

            widths.push((1 - x * x) * petalWidth);
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
        return 48;
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
};

FlowerModel.PETAL_PRECISION = 8;