const GrowthModel = function(
    flowerModel,
    leafModel,
    branchChanceFunction,
    branchChanceMultiplier,
    leafChanceFunction,
    leafChanceMultiplier
) {
    const getFactor = (length, maxLength) => {
        return length / maxLength;
    };

    this.getBranchChance = factor => {
        return branchChanceFunction(factor) * branchChanceMultiplier;
    };

    this.getLeafChance = factor => {
        return leafChanceFunction(factor) * leafChanceMultiplier;
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