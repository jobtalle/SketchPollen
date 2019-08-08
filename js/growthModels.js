const GrowthModels = function() {
    const models = [
        new GrowthModel()
    ];

    this.get = () => {
        return models[Math.floor(Math.random() * models.length)];
    };
};