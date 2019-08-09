const FlowerModel = function() {
    const pistilCount = 24;
    const pistilAngles = [];
    const pistilLengths = [];
    const petalCount = 12;
    const petalLength = 140;
    const petalWidth = 10;
    const petalWidths = [];
    const petalColors = [
        "#abdded",
        "#97c2d0"];
    let radius = 0;

    const initializePistils = () => {
        for (let i = 0; i < pistilCount; ++i) {
            const length = 48 * Math.random();

            pistilAngles.push(Math.PI * 2 * (i / pistilCount));
            pistilLengths.push(length);

            if (radius < length)
                radius = length;
        }
    };

    const initializePetals = () => {
        for (let i = 0; i < FlowerModel.PETAL_PRECISION; ++i) {
            const x = 2 * (i / (FlowerModel.PETAL_PRECISION - 1)) - 1;

            petalWidths[i] = (1 - x * x) * petalWidth;
        }
    };

    this.getPetalWidths = () => {
        return petalWidths;
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
        return radius;
    };

    this.getPistilCount = () => {
        return pistilCount;
    };

    this.getPistilAngles = () => {
        return pistilAngles;
    };

    this.getPistilLengths = () => {
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

    initializePistils();
    initializePetals();
};

FlowerModel.PETAL_PRECISION = 8;