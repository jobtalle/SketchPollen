const GrowthModel = function() {
    this.getBranchChance = (length, maxLength) => {
        return 0.2;
    };

    this.getBranchLengthScale = () => {
        return 0.7;
    };

    this.makePhytomerLength = maxLength => {
        return (0.4 + Math.random() * 0.6) * maxLength;
    };
};