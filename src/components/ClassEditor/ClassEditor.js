import React, { useState, useEffect } from 'react';

function ClassEditor({ selectedClass, onUpdateClass }) {
  const [className, setClassName] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [methods, setMethods] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedClass) {
      setClassName(selectedClass.name);
      setAttributes(selectedClass.attributes || []);
      setMethods(selectedClass.methods || []);
    }
  }, [selectedClass]);

  // Handle updates for the class name
  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  // Handle adding a new attribute
  const handleAddAttribute = () => {
    const newAttribute = { name: '', type: '', visibility: 'public' };
    setAttributes([...attributes, newAttribute]);
  };

  // Handle editing an existing attribute
  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
    setAttributes(updatedAttributes);
  };

  // Handle deleting an attribute
  const handleDeleteAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes);
  };

  // Handle adding a new method
  const handleAddMethod = () => {
    const newMethod = { name: '', returnType: '', visibility: 'public', parameters: [] };
    setMethods([...methods, newMethod]);
  };

  // Handle editing an existing method
  const handleMethodChange = (index, field, value) => {
    const updatedMethods = [...methods];
    updatedMethods[index] = { ...updatedMethods[index], [field]: value };
    setMethods(updatedMethods);
  };

  // Handle deleting a method
  const handleDeleteMethod = (index) => {
    const updatedMethods = methods.filter((_, i) => i !== index);
    setMethods(updatedMethods);
  };

// Handle saving the updated class data
const handleSave = () => {
  if (!className || !className.trim()) {
    setError('Class name is required.');
    return;
  }

  if (attributes.some(attr => !attr.name || !attr.name.trim())) {
    setError('All attributes must have a name.');
    return;
  }

  if (methods.some(method => !method.name || !method.name.trim())) {
    setError('All methods must have a name.');
    return;
  }

  setError(''); // Clear any existing errors
  onUpdateClass({ ...selectedClass, name: className, attributes, methods });
};


  return (
    <div className="class-editor">
      <h2>Class Editor</h2>

      {/* Class Name */}
      <div className="field">
        <label>Class Name:</label>
        <input
          type="text"
          value={className}
          onChange={handleClassNameChange}
          placeholder="Enter class name"
        />
      </div>

      {/* Display validation error if any */}
      {error && <p className="error-message">{error}</p>}

      {/* Attributes */}
      <div className="attributes-section">
        <h3>Attributes</h3>
        {attributes.map((attribute, index) => (
          <div key={index} className="attribute">
            <input
              type="text"
              value={attribute.name}
              onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
              placeholder="Attribute Name"
            />
            <input
              type="text"
              value={attribute.type}
              onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
              placeholder="Type"
            />
            <select
              value={attribute.visibility}
              onChange={(e) => handleAttributeChange(index, 'visibility', e.target.value)}
            >
              <option value="public">public</option>
              <option value="private">private</option>
              <option value="protected">protected</option>
            </select>
            <button onClick={() => handleDeleteAttribute(index)}>Delete</button>
          </div>
        ))}
        <button onClick={handleAddAttribute}>Add Attribute</button>
      </div>

      {/* Methods */}
      <div className="methods-section">
        <h3>Methods</h3>
        {methods.map((method, index) => (
          <div key={index} className="method">
            <input
              type="text"
              value={method.name}
              onChange={(e) => handleMethodChange(index, 'name', e.target.value)}
              placeholder="Method Name"
            />
            <input
              type="text"
              value={method.returnType}
              onChange={(e) => handleMethodChange(index, 'returnType', e.target.value)}
              placeholder="Return Type"
            />
            <select
              value={method.visibility}
              onChange={(e) => handleMethodChange(index, 'visibility', e.target.value)}
            >
              <option value="public">public</option>
              <option value="private">private</option>
              <option value="protected">protected</option>
            </select>
            <button onClick={() => handleDeleteMethod(index)}>Delete</button>
          </div>
        ))}
        <button onClick={handleAddMethod}>Add Method</button>
      </div>

      {/* Save Button */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default ClassEditor;
