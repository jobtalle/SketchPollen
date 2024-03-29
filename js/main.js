const PLANT_TIME_MIN = 3;
const PLANT_TIME_MAX = 10;
const PLANTS_PER_PIXEL = 0.014;
const POLLINATOR_TIME_MIN = 2;
const POLLINATOR_TIME_MAX = 5;
const POLLINATOR_SPAWN_OFFSET = 300;
const PLANT_CEILING = 0.1;
const TIME_STEP_MAX = 0.2;
const PLANT_GROUND = 16;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const growthModels = new Models();
const plants = [];
const pollinators = [];
let plantTimer = 0;
let pollinatorTimer = 0;
let lastDate = new Date();

const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;

    for (const plant of plants)
        plant.rebase(canvas.height + PLANT_GROUND);
};

const spawnPlant = center => {
    if (plants.length > PLANTS_PER_PIXEL * canvas.width)
        return;

    plants.push(new Plant(
        growthModels.get(),
        center ? canvas.width * 0.5 : Math.random() * canvas.width,
        canvas.height + PLANT_GROUND,
        canvas.height * PLANT_CEILING));
};

const spawnPollinator = () => {
    for (const plant of plants) for (const flower of plant.getFlowers()) if (flower.isGrown() && !flower.isClaimed() && flower.getPollCount() > 0) {
        pollinators.push(new Pollinator(canvas.width * Math.random(), -POLLINATOR_SPAWN_OFFSET));

        return;
    }
};

const update = timeStep => {
    if (timeStep > TIME_STEP_MAX)
        timeStep = TIME_STEP_MAX;

    if ((plantTimer -= timeStep) < 0) {
        plantTimer = PLANT_TIME_MIN + (PLANT_TIME_MAX - PLANT_TIME_MIN) * Math.random();

        spawnPlant(false);
    }

    if ((pollinatorTimer -= timeStep) < 0) {
        pollinatorTimer = POLLINATOR_TIME_MIN + (POLLINATOR_TIME_MAX - POLLINATOR_TIME_MIN) * Math.random();

        spawnPollinator();
    }

    for (let i = plants.length; i-- > 0;)
        if (plants[i].update(timeStep))
            plants.splice(i, 1);

    for (let i = pollinators.length; i-- > 0;)
        if (pollinators[i].update(timeStep, plants))
            pollinators.splice(i, 1);

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const plant of plants) {
        plant.draw(context);

        for (const flower of plant.getFlowers())
            flower.draw(context);
    }

    for (const pollinator of pollinators)
        pollinator.draw(context);
};

const loopFunction = () => {
    const date = new Date();

    update((date - lastDate) * 0.001);
    requestAnimationFrame(loopFunction);

    lastDate = date;
};

window.onresize = resize;

resize();
requestAnimationFrame(loopFunction);

spawnPlant(true);