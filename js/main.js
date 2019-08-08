const PLANT_TIME_MIN = 1;
const PLANT_TIME_MAX = 4;
const PLANT_CEILING = 0.5;
const TIME_STEP_MAX = 0.2;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const plants = [];
let plantTimer = 0;
let lastDate = new Date();

const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
};

const spawnPlant = center => {
    plants.push(new Plant(
        center ? canvas.width * 0.5 : Math.random() * canvas.width,
        canvas.height,
        canvas.height * PLANT_CEILING));
};

const update = timeStep => {
    if (timeStep > TIME_STEP_MAX)
        timeStep = TIME_STEP_MAX;

    if ((plantTimer -= timeStep) < 0) {
        plantTimer = PLANT_TIME_MIN + (PLANT_TIME_MAX - PLANT_TIME_MIN) * Math.random();

        spawnPlant(false);
    }

    for (let i = plants.length; i-- > 0;)
        if (plants[i].update(timeStep))
            plants.splice(i, 1);

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const plant of plants)
        plant.draw(context);
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