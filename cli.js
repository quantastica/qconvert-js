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
  { name: "jupyter", alias: "j", type: Boolean},
  { name: "overwrite", alias: "w", type: Boolean},
  { name: "help", alias: "h", type: Boolean}
];

const args = commandLineArgs(optionDefinitions);


var printUsage = function() {
	console.log("Q-Convert - Quantum Language Converter");
	console.log("");
	console.log("Usage:");
	console.log("    q-convert -i input_file -s source_format -o output_file -d destination_format [-j] [-w]");
	console.log("        -i, --input\tInput file");
	console.log("        -s, --source\tSource format: qasm, quil, qobj, quantum-circuit, toaster");
	console.log("        -o, --output\tOutput file");
	console.log("        -d, --dest\tDestination format: qiskit, qasm, qobj, quil, pyquil, cirq, tfq, qsharp, quest, js, quantum-circuit, toaster, svg, svg-inline");
	console.log("        -j, --jupyter\tOutput jupyter notebook (for qiskit, pyquil, cirq, tfq, qsharp, and js only)");
	console.log("        -w, --overwrite\tOverwrite output file if it already exists");
	console.log("        -h, --help\tPrint this help text");
	console.log("");
	console.log("Enjoy! :)");
	console.log("");
};

if(args.help) {
	printUsage();

	if(!args.input) {
		process.exit(1);
	}
}

if(!args.input) {
	console.log("Error: please specify input file.");
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
	console.log("Error: please specify output file.");
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
	console.log("Error: please specify source file format.");
	process.exit(1);
}

if(!args.dest) {
	console.log("Error: please specify destination file format.");
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

var jupyter = !!args.jupyter;


var writeOutput = function(circuit) {
	var outputStr = "";
	switch(args.dest) {
		case "qiskit": outputStr = circuit.exportQiskit("", false, null, null, null, null, jupyter); break;
		case "qasm": outputStr = circuit.exportQASM(); break;
		case "qobj": outputStr = JSON.stringify(circuit.exportQobj()); break;
		case "quil": outputStr = circuit.exportQuil(); break;
		case "pyquil": outputStr = circuit.exportPyquil("", false, null, null, null, null, jupyter); break;
		case "cirq": outputStr = circuit.exportCirq("", false, null, null, jupyter); break;
		case "tfq": outputStr = circuit.exportTFQ("", false, null, null, jupyter); break;
		case "qsharp": outputStr = circuit.exportQSharp("", false, null, null, jupyter); break;
		case "js": outputStr = circuit.exportJavaScript("", false, null, jupyter); break;
		case "quest": outputStr = circuit.exportQuEST("", false, null, null); break;
		case "quantum-circuit": outputStr = JSON.stringify(circuit.save()); break;
		case "toaster": outputStr = JSON.stringify(circuit.exportRaw()); break;
		case "svg": outputStr = circuit.exportSVG(false); break;
		case "svg-inline": outputStr = circuit.exportSVG(true); break;
		default: {
			console.log("Error: unknown destination format \"" + args.dest + "\".");
			process.exit(1);
		}
	}

	try {
		fs.writeFileSync(args.output, outputStr, "utf8");
	} catch(e) {
		console.log("Error: cannot write output \"" + args.output + "\". " + e.message);
		process.exit(1);
	}

};

var convert = function() {
	var circuit = new QuantumCircuit();

	switch(args.source) {
		case "qasm": {
			circuit.importQASM(inputFile, function(errors) {
				if(errors && errors.length) {
					console.log(errors);
					process.exit(1);		
				}

				writeOutput(circuit);
			});
		}; break;

		case "quil": {
			circuit.importQuil(inputFile, function(errors) {
				if(errors && errors.length) {
					console.log(errors);
					process.exit(1);
				}
			});

			writeOutput(circuit);
		}; break;

		case "qobj": {
			var inputJson = null;
			try {
				inputJson = JSON.parse(inputFile);
			} catch(err) {
				console.log("Error parsing input file as JSON. " + err.message);
				process.exit(1);
			}

			circuit.importQobj(inputJson, function(errors) {
				if(errors && errors.length) {
					console.log(errors);
					process.exit(1);		
				}

				writeOutput(circuit);			
			});

		}; break;

		case "quantum-circuit": {
			var inputJson = null;
			try {
				inputJson = JSON.parse(inputFile);
			} catch(err) {
				console.log("Error parsing input file as JSON. " + err.message);
				process.exit(1);
			}

			try {
				circuit.load(inputJson);
			} catch(err) {
				console.log(err);
				process.exit(1);
			}

			writeOutput(circuit);
		}; break;

		case "toaster": {
			var inputJson = null;
			try {
				inputJson = JSON.parse(inputFile);
			} catch(err) {
				console.log("Error parsing input file as JSON. " + err.message);
				process.exit(1);
			}

			circuit.importRaw(inputJson, function(errors) {
				if(errors && errors.length) {
					console.log(errors);
					process.exit(1);
				}

				writeOutput(circuit);
			});

		}; break;

		default: {
			console.log("Error: unknown input file format \"" + args.source + "\".");
			process.exit(1);
		}
	};
};

convert();
