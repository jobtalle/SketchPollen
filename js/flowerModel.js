const FlowerModel = function() {
    const pistilCount = 24;
    const pistilAngles = [];
    const pistilLengths = [];
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
};