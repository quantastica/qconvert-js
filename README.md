# Q-Convert

Quantum Computing Language Converter

## Install

```
npm -g install q-convert
```

## Usage

```

Q-Convert - Quantum Language Converter

Usage:
    q-convert -i input_file -s source_format -o output_file -d destination_format [-j] [-w]
        -i, --input	Input file
        -s, --source	Source format: qasm, quil, qobj, ionq, quantum-circuit, toaster
        -o, --output	Output file
        -d, --dest	Destination format: qiskit, qasm, qobj, quil, pyquil, braket, cirq, tfq, qsharp, quest, cudaq, js, quantum-circuit, toaster, svg, svg-inline
        -j, --jupyter	Output jupyter notebook (for qiskit, pyquil, braket, cirq, tfq, qsharp, cudaq and js only)
        -w, --overwrite	Overwrite output file if it already exists
        -h, --help	Print this help text

```

## Examples

The following command will take `my_circuit.qasm` and will output vector image of a circuit diagram `my_circuit.svg`
```
q-convert -i my_circuit.qasm -s qasm -o my_circuit.svg -d svg -w
```

Convert from QASM to Q# (QSharp)
```
q-convert -i my_circuit.qasm -s qasm -o my_circuit.qs -d qsharp -w
```

Convert from QASM to a jupyter notebook with pyQuil code inside:
```
q-convert -i my_circuit.qasm -s qasm -o my_circuit.ipynb -d pyquil -j -w
```


## Online version

Online version is available at: <a href="https://quantum-circuit.com/qconvert" target="_blank">https://quantum-circuit.com/qconvert</a>


## More languages

More input & output languages will be added soon.

## License

[MIT](LICENSE.txt)


That's it. Enjoy!
