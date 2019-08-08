const GrowthModel = function() {
    this.getBranchChance = (length, maxLength) => {
        return 0.1;
    };

    this.makePhytomerLength = maxLength => {
        return (0.4 + Math.random() * 0.6) * maxLength;
    };
};