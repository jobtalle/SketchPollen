Transform = function(_00, _10, _20, _01, _11, _21) {
    if(_00 === undefined)
        this.identity();
    else {
        this._00 = _00;
        this._10 = _10;
        this._20 = _20;
        this._01 = _01;
        this._11 = _11;
        this._21 = _21;
    }
};

Transform.prototype.apply = function(vector) {
    const x = vector.x;
    const y = vector.y;

    vector.x = this._00 * x + this._10 * y + this._20;
    vector.y = this._01 * x + this._11 * y + this._21;
};

Transform.prototype.copy = function() {
    return new Myr.Transform(this._00, this._10, this._20, this._01, this._11, this._21);
};

Transform.prototype.identity = function() {
    this._00 = 1;
    this._10 = 0;
    this._20 = 0;
    this._01 = 0;
    this._11 = 1;
    this._21 = 0;
};

Transform.prototype.set = function(transform) {
    this._00 = transform._00;
    this._10 = transform._10;
    this._20 = transform._20;
    this._01 = transform._01;
    this._11 = transform._11;
    this._21 = transform._21;
};

Transform.prototype.multiply = function(transform) {
    const _00 = this._00;
    const _10 = this._10;
    const _01 = this._01;
    const _11 = this._11;

    this._00 = _00 * transform._00 + _10 * transform._01;
    this._10 = _00 * transform._10 + _10 * transform._11;
    this._20 += _00 * transform._20 + _10 * transform._21;
    this._01 = _01 * transform._00 + _11 * transform._01;
    this._11 = _01 * transform._10 + _11 * transform._11;
    this._21 += _01 * transform._20 + _11 * transform._21;
};

Transform.prototype.rotate = function(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const _00 = this._00;
    const _01 = this._01;

    this._00 = _00 * cos - this._10 * sin;
    this._10 = _00 * sin + this._10 * cos;
    this._01 = _01 * cos - this._11 * sin;
    this._11 = _01 * sin + this._11 * cos;
};

Transform.prototype.shear = function(x, y) {
    const _00 = this._00;
    const _01 = this._01;

    this._00 += this._10 * y;
    this._10 += _00 * x;
    this._01 += this._11 * y;
    this._11 += _01 * x;
};

Transform.prototype.translate = function(x, y) {
    this._20 += this._00 * x + this._10 * y;
    this._21 += this._01 * x + this._11 * y;
};

Transform.prototype.scale = function(x, y) {
    this._00 *= x;
    this._10 *= y;
    this._01 *= x;
    this._11 *= y;
};