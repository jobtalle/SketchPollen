const GrowthModel = function(
    flowerModel,
    leafModel,
    branchChanceFunction,
    branchChanceMultiplier,
    leafChanceFunction,
    leafChanceMultiplier,
    branchLengthScale,
    noiseScale,
    flexibility
) {
    this.getBranchChance = factor => {
        return branchChanceFunction(factor) * branchChanceMultiplier;
    };

    this.getLeafChance = factor => {
        return leafChanceFunction(factor) * leafChanceMultiplier;
    };

    this.getBranchLengthScale = () => {
        return branchLengthScale;
    };

    this.getNoiseScale = () => {
        return noiseScale;
    };

    this.makePhytomerLength = maxLength => {
        return (0.4 + Math.random() * 0.6) * maxLength;
    };

    this.sampleRadius = topDistance => {
        return topDistance * 0.03;
    };

    this.getFlexibility = () => {
        return flexibility;
    };

    this.getFlowerModel = () => {
        return flowerModel;
    };

    this.getLeafModel = () => {
        return leafModel;
    };
};