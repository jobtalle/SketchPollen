const FlowerModel = function() {
    const pistilCount = 24;
    const pistilAngles = [];
    const pistilLengths = [];

    const initializePistils = () => {
        for (let i = 0; i < pistilCount; ++i) {
            pistilAngles.push(Math.PI * 2 * (i / pistilCount));
            pistilLengths.push(48 * Math.random());
        }
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