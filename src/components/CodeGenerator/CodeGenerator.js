import React, { useState } from 'react';

function CodeGenerator({ diagramData }) {
  const [generatedCode, setGeneratedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // Generates code when the "Generate Code" button is clicked
  const handleGenerateCode = () => {
    if (!diagramData || !diagramData.classes || diagramData.classes.length === 0) {
      setGeneratedCode("// No data available to generate code.");
      return;
    }
    const code = generateCode(diagramData.classes);
    setGeneratedCode(code);
  };

  // Helper function for code indentation
  const indent = (level = 0) => '  '.repeat(level);

  // Main code generation function
  const generateCode = (elements) => {
    return elements.map((element) => {
      switch (element.type) {
        case 'class': return generateClassCode(element);
        case 'interface': return generateInterfaceCode(element);
        default:
          console.warn(`Unsupported element type: ${element.type}`);
          return '';
      }
    }).join('\n\n');
  };

  // Generate code for a class element
  const generateClassCode = (element) => {
    let classCode = `class ${element.name} {\n`;
    classCode += generateAttributesCode(element.attributes);
    classCode += generateMethodsCode(element.methods);
    classCode += '}\n';
    return classCode;
  };

  // Generate code for an interface element
  const generateInterfaceCode = (element) => {
    let interfaceCode = `interface ${element.name} {\n`;
    interfaceCode += generateMethodsCode(element.methods, true);
    interfaceCode += '}\n';
    return interfaceCode;
  };

  // Generate code for attributes of a class
  const generateAttributesCode = (attributes = []) => {
    return attributes.map(attr => {
      const visibility = attr.visibility || 'public';
      const type = attr.type || 'var';
      const name = attr.name || 'attribute';
      return `${indent(1)}${visibility} ${type} ${name};\n`;
    }).join('');
  };

  // Generate code for methods of a class or interface
  const generateMethodsCode = (methods = [], isInterface = false) => {
    return methods.map(method => {
      const visibility = method.visibility || 'public';
      const returnType = method.returnType || 'void';
      const methodName = method.name || 'method';
      const params = (method.parameters || [])
        .map(param => `${param.type || 'var'} ${param.name || 'param'}`)
        .join(', ');

      return isInterface
        ? `${indent(1)}${visibility} ${returnType} ${methodName}(${params});\n`
        : `${indent(1)}${visibility} ${returnType} ${methodName}(${params}) {\n` +
          `${indent(2)}// TODO: Implement\n` +
          `${indent(1)}}\n`;
    }).join('');
  };

  // Copy generated code to clipboard
  const handleCopyToClipboard = () => {
    if (!generatedCode) return;

    navigator.clipboard.writeText(generatedCode)
      .then(() => {
        setCopySuccess("Code copied to clipboard!");
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error("Failed to copy code:", err);
        setCopySuccess("Failed to copy code.");
      });
  };

  return (
    <div className="code-generator">
      <button onClick={handleGenerateCode} aria-label="Generate UML Code">Generate Code</button>

      {generatedCode && (
        <>
          <textarea
            readOnly
            value={generatedCode}
            className="generated-code-preview"
            rows={10}
            aria-label="Generated Code Preview"
          />
          <button onClick={handleCopyToClipboard} aria-label="Copy to Clipboard">Copy to Clipboard</button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </>
      )}
    </div>
  );
}

export default CodeGenerator;
