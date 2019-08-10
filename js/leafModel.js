const LeafModel = function() {
    this.getRadius = () => {
        return 12;
    };

    this.getLength = () => {
        return 70;
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
        return Math.PI * 0.3;
    };

    this.getGrowTime = () => {
        return 7;
    };

    this.getStalkColor = () => {
        return "#76ae4d";
    };

    this.getColor = () => {
        return "rgb(174,223,95)";
    };
};