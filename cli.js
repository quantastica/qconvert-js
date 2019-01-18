#! /usr/bin/env node

const commandLineArgs = require("command-line-args");
const fs = require("fs");
const path = require("path");
const replaceExt = require("replace-ext");
const QuantumCircuit = require("quantum-circuit");

const optionDefinitions = [
  { name: "input", alias: "i", type: String },
  { name: "source", alias: "s", type: String },
  { name: "output", alias: "o", type: String },
  { name: "dest", alias: "d", type: String },
  { name: "overwrite", alias: "w", type: Boolean}
];

const args = commandLineArgs(optionDefinitions);


var printUsage = function() {
	console.log("Q-Convert - Quantum Language Converter");
	console.log("");
	console.log("Usage:");
	console.log("\tq-convert -i input_file -s source_format -o output_file -d destination_format [-w]");
	console.log("\t\t-i, --input\tInput file");
	console.log("\t\t-s, --source\tSource format (qasm)");
	console.log("\t\t-o, --output\tOutput file");
	console.log("\t\t-d, --dest\tDestination format (qasm, quil, pyquil, quantum-circuit, toaster, svg)");
	console.log("\t\t-w, --overwrite\tOverwrite output file if it already exists");
	console.log("");
	console.log("Enjoy! :)");
	console.log("");
};

if(!args.input) {
	printUsage();
	process.exit(1);
}

if(!fs.existsSync(args.input)) {
	console.log("Error: input file \"" + args.input + "\" not found.");
	process.exit(1);
}

var inputStat = fs.lstatSync(args.input);

if(!inputStat.isFile()) {
	console.log("Error: input \"" + args.input + "\" is not a file.");
	process.exit(1);
}

if(!args.output) {
	printUsage();
	process.exit(1);
}

if(fs.existsSync(args.output)) {
	if(!args.overwrite) {
		console.log("Error: output file \"" + args.output + "\" already exists.");
		console.log("Use -w switch to overwrite.");
		process.exit(1);
	}

	var outputStat = fs.lstatSync(args.output);

	if(outputStat.isDirectory()) {
		console.log("Error: output \"" + args.output + "\" is not a file.");
		process.exit(1);
	}
}

if(!args.source) {
	console.log("Error: unknown input file format.");
	process.exit(1);
}

// read input file
var inputFile = "";
try {
	inputFile = fs.readFileSync(args.input, "utf8");
} catch(e) {
	console.log("Error: cannot read input file \"" + args.input + "\". " + e.message);
	process.exit(1);
}

var circuit = new QuantumCircuit();

circuit.importQASM(inputFile, function(errors) {
	if(errors.length) {
		console.log(errors);
		process.exit(1);		
	}

	var outputStr = "";
	switch(args.dest) {
		case "qasm": outputStr = circuit.exportQASM(); break;
		case "quil": outputStr = circuit.exportQuil(); break;
		case "pyquil": outputStr = circuit.exportPyquil(); break;
		case "quantum-circuit": outputStr = JSON.stringify(circuit.save()); break;
		case "toaster": outputStr = JSON.stringify(circuit.exportRaw()); break;
		case "svg": outputStr = circuit.exportSVG(); break;
		default: {
			console.log("Error: unknown destination format.");
			process.exit(1);
		}
	}

	try {
		fs.writeFileSync(args.output, outputStr, "utf8");
	} catch(e) {
		console.log("Error: cannot write output \"" + args.output + "\". " + e.message);
		process.exit(1);
	}
});
