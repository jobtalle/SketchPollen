const LeafModel = function(
    radius,
    length,
    offsetAngle,
    growTime,
    stalkColor,
    leafColor
) {
    this.getRadius = () => {
        return radius;
    };

    this.getLength = () => {
        return length;
    };

    this.getWidths = radius => {
        const widths = [];

        for (let i = 0; i < Leaf.PRECISION; ++i) {
            const x = 2 * (i / (Leaf.PRECISION - 1)) - 1;

            widths[i] = (1 - x * x) * radius;
        }

        return widths;
    };

    this.getOffsetAngle = () => {
        return offsetAngle;
    };

    this.getGrowTime = () => {
        return growTime;
    };

    this.getStalkColor = () => {
        return stalkColor;
    };

    this.getColor = () => {
        return leafColor;
    };
};