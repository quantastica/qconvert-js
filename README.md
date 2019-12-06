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
        -i, --input     Input file
        -s, --source    Source format (qasm)
        -o, --output    Output file
        -d, --dest      Destination format: qiskit, qasm, quil, pyquil, cirq, qsharp, quest, js, quantum-circuit, toaster, svg
        -j, --jupyter   Output jupyter notebook (for qiskit, pyquil, cirq, qsharp, and js only)
        -w, --overwrite Overwrite output file if it already exists
        -h, --help      Print this help text

```

## Examples

The following command will take `my_circuit.qasm` and output vector image of circuit diagram `my_circuit.svg`
```
q-convert -i my_circuit.qasm -s qasm -o my_circuit.svg -d svg
```

Convert from QASM to Q# (QSharp)
```
q-convert -i my_circuit.qasm -s qasm -o my_circuit.qs -d qsharp
```

Convert from QASM to jupyter notebook with pyQuil code inside:
```
q-convert -i my_circuit.qasm -s qasm -o my_circuit.ipynb -d pyquil -j
```


## Online version

Online version is available at: <a href="https://quantum-circuit.com/qconvert" target="_blank">https://quantum-circuit.com/qconvert</a>


## More languages

More input & output languages will be added soon.


That's it. Enjoy!
