const GrowthModel = function(flowerModel, leafModel) {
    this.getBranchChance = (length, maxLength) => {
        return 0.2;
    };

    this.getLeafChance = (length, maxLength) => {
        return 0.8;
    };

    this.getBranchLengthScale = () => {
        return 0.7;
    };

    this.getNoiseScale = () => {
        return 0.012;
    };

    this.makePhytomerLength = maxLength => {
        return (0.4 + Math.random() * 0.6) * maxLength;
    };

    this.sampleRadius = topDistance => {
        return topDistance * 0.03;
    };

    this.getFlexibility = () => {
        return 0.05;
    };

    this.getFlowerModel = () => {
        return flowerModel;
    };

    this.getLeafModel = () => {
        return leafModel;
    };
};