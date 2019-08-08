const TIME_STEP_MAX = 0.2;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
let lastDate = new Date();

const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
};

const update = timeStep => {
    if (timeStep > TIME_STEP_MAX)
        timeStep = TIME_STEP_MAX;

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);


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