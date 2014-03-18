var coffee = require("coffee-script");

module.exports.coffee = function (path, source) {
	var match = /(.*)\.coffee$/.exec(path);
	if (match) {
		return [match[1] + ".js", coffee.compile(source)];
	} else {
		return [path, source];
	}
}

var coffeeMap = [
	[/\(\s*(<|>|<=|>=|==|!=|\+|-|\*|\/)\s*([\w\.]*)\s*\)/, "( (λ) -> λ $1 $2 )"],
	[/\(\s*([\w\.]*)\s*(<|>|<=|>=|==|!=|\+|-|\*|\/)\s*\)/, "( (λ) -> $1 $2 λ )"]
]
var jsMap = [
	[/\(\s*(<|>|<=|>=|==|!=|\+|-|\*|\/)\s*([\w\.]*)\s*\)/, "( function (λ) { return λ $1 $2; } )"],
	[/\(\s*([\w\.]*)\s*(<|>|<=|>=|==|!=|\+|-|\*|\/)\s*\)/, "( function (λ) { return $1 $2 λ; } )"]
]

module.exports.ext = function (path, source) {
	var match = /(.*(\..*?))\.ext$/.exec(path);
	if (match) {
		var map;
		if (match[2] === ".coffee") map = coffeeMap;
		else if (match[2] === ".js") map = jsMap;
		for (var i = 0; i < map.length; ++i) {
			source = source.replace(map[i][0], map[i][1]);
		}
		return [match[1], source];
	} else {
		return [path, source];
	}
}

module.exports.order = [module.exports.ext, module.exports.coffee]