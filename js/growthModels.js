const GrowthModels = function() {
    this.get = () => {
        return new GrowthModel(
            new FlowerModel(),
            new LeafModel());
    };
};