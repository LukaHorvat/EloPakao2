var exec = require("child_process").exec;
var fs = require("fs");
var preprocessors = require("./preprocessors");
var mkdirp = require("mkdirp");

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json")
	});	
	grunt.registerTask("node", "Starting node server", function () {
		var done = this.async();
		var sp = grunt.util.spawn(
			{
				cmd: "node",
				args: ["./out/index"]
			}, 
			function (err, res, stderr) {
				//if (res.stderr) console.log(res.stderr);
				done();
			}
		);
		sp.stdout.on("data", function (data) {
			fs.writeSync(1, data.toString());
		});
		sp.stderr.on("data", function (data) {
			fs.writeSync(1, data.toString());
		});
		process.on("SIGINT", function (data) {
			sp.kill();
		});
	});
	grunt.registerTask("process", "Preprocessing", function () {
		var count = 0;
		var searchFolder = function (folderPath) {
			mkdirp.sync("out" + folderPath.substring(1));
			var files = fs.readdirSync(folderPath)
			files
			.map(function (file) { return folderPath + "/" + file; })
			.forEach(function (file) { 
				if (fs.lstatSync(file).isDirectory()) return;
				res = [file, fs.readFileSync(file).toString()]
				for (var i = 0; i < preprocessors.order.length; ++i) {
					var res = preprocessors.order[i](res[0], res[1]);
				}
				fs.writeFileSync("out" + res[0].substring(1), res[1]);
			});

			fs
			.readdirSync(folderPath)
			.map(function (path) { return folderPath + "/" + path })
			.filter(function (path) {
				return fs.lstatSync(path).isDirectory() && 
					!/.*node_modules.*/.test(path) &&
					!/.*\.git.*/.test(path) &&
					!/.*out(\/|$).*/.test(path);
			})
			.forEach(searchFolder);
		};
		searchFolder(".");
	});

	grunt.registerTask("default", ["process", "node"]);
};