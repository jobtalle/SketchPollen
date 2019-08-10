const Models = function() {
    const models = [];
    let newCounter = Models.NEW_INTERVAL_MIN + (Models.NEW_INTERVAL_MAX - Models.NEW_INTERVAL_MIN) * Math.random();

    const makeFlowerModel = () => {
        return new FlowerModel(
            Models.FLOWER_PALETTES[Math.floor(Math.random() * Models.FLOWER_PALETTES.length)],
            Models.FLOWER_POWER_MIN + (Models.FLOWER_POWER_MAX - Models.FLOWER_POWER_MIN) * Math.random(),
            Models.FLOWER_WIDTH_MIN + (Models.FLOWER_WIDTH_MAX - Models.FLOWER_WIDTH_MIN) * Math.random(),
            Models.FLOWER_PETALS_MIN + Math.floor((Models.FLOWER_PETALS_MAX - Models.FLOWER_PETALS_MIN) * Math.random()),
            Models.FLOWER_LENGTH_MIN + (Models.FLOWER_LENGTH_MAX - Models.FLOWER_LENGTH_MIN) * Math.random()
        );
    };

    const makeLeafModel = () => {
        return new LeafModel();
    };

    const makeModel = () => {
        return new GrowthModel(
            makeFlowerModel(),
            makeLeafModel());
    };

    this.get = () => {
        if ((newCounter -= 1) < 0) {
            if (Math.random() < Models.SINGLETON_CHANCE)
                newCounter = 0;
            else
                newCounter = Models.NEW_INTERVAL_MIN + (Models.NEW_INTERVAL_MAX - Models.NEW_INTERVAL_MIN) * Math.random();

            models.shift();
            models.push(makeModel());
        }

        return models[Math.floor(Math.random() * models.length)];
    };

    for (let i = 0; i < Models.MODEL_COUNT; ++i)
        models.push(makeModel());
};

Models.MODEL_COUNT = 2;
Models.SINGLETON_CHANCE = 0.05;
Models.NEW_INTERVAL_MIN = 6;
Models.NEW_INTERVAL_MAX = 10;

Models.FLOWER_POWER_MIN = 0.3;
Models.FLOWER_POWER_MAX = 2;
Models.FLOWER_WIDTH_MIN = 7;
Models.FLOWER_WIDTH_MAX = 22;
Models.FLOWER_PETALS_MIN = 10;
Models.FLOWER_PETALS_MAX = 24;
Models.FLOWER_LENGTH_MIN = 60;
Models.FLOWER_LENGTH_MAX = 100;
Models.FLOWER_PALETTES = [
    ["#c0a7da", "#9c7fc0"],
    ["#dad68b", "#b4b074"],
    ["#da6c6f", "#a65354"],
    ["#66d0da", "#57b0bb"]
];