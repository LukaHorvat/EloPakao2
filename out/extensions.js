module.exports.extend = function () {
	Math.log2 = function (x) {
		return Math.log(x) / Math.LN2;
	}

	Array.prototype.last = function () {
		return this[this.length - 1];
	}

	Array.prototype.contains = function (element) {
		return this.indexOf(element) !== -1;
	}

	Array.prototype.containsAll = function () {
		for (var i = 0; i < arguments.length; ++i) {
			if (!this.contains(arguments[i])) return false;
		}
		return true;
	}

	Array.prototype.containsAny = function () {
		for (var i = 0; i < arguments.length; ++i) {
			if (this.contains(arguments[i])) return true;
		}
		return false;
	}
}