import React, { useState, useEffect } from 'react';

function PropertiesPanel({ selectedElement, onUpdateElement }) {
  const [elementData, setElementData] = useState(selectedElement || {});
  const [error, setError] = useState(null);

  useEffect(() => {
    setElementData(selectedElement || {});
    setError(null); // Clear errors when a new element is selected
  }, [selectedElement]);

  if (!selectedElement) {
    return <div className="properties-panel">Select an element to edit</div>;
  }

  /**
   * Handle changes in input fields, parsing attributes and methods as arrays
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setElementData((prevData) => ({
      ...prevData,
      [name]: ['attributes', 'methods'].includes(name)
        ? value.split(',').map(item => item.trim()).filter(Boolean)
        : value
    }));
  };

  /**
   * Save the updated element data
   */
  const handleSave = () => {
    if (!elementData.name) {
      setError('Name is required.');
      return;
    }
    setError(null); // Clear error if validation passes
    onUpdateElement(elementData);
  };

  /**
   * Reset changes to the initial selected element data
   */
  const handleReset = () => {
    setElementData(selectedElement);
    setError(null);
  };

  /**
   * Render input fields for class type elements
   */
  const renderClassFields = () => (
    <>
      <label>
        Attributes:
        <input
          type="text"
          name="attributes"
          value={(elementData.attributes || []).join(', ')}
          onChange={handleChange}
          placeholder="Comma-separated attributes"
        />
      </label>
      <label>
        Methods:
        <input
          type="text"
          name="methods"
          value={(elementData.methods || []).join(', ')}
          onChange={handleChange}
          placeholder="Comma-separated methods"
        />
      </label>
    </>
  );

  /**
   * Render input fields for attribute type elements
   */
  const renderAttributeFields = () => (
    <label>
      Data Type:
      <input
        type="text"
        name="dataType"
        value={elementData.dataType || ''}
        onChange={handleChange}
        placeholder="e.g., String, Integer"
      />
    </label>
  );

  /**
   * Render input fields for method type elements
   */
  const renderMethodFields = () => (
    <label>
      Return Type:
      <input
        type="text"
        name="returnType"
        value={elementData.returnType || ''}
        onChange={handleChange}
        placeholder="e.g., void, int"
      />
    </label>
  );

  return (
    <div className="properties-panel">
      <h3>Edit Properties</h3>

      <label>
        Name:
        <input
          type="text"
          name="name"
          value={elementData.name || ''}
          onChange={handleChange}
          required
        />
      </label>

      {error && <p className="error-message">{error}</p>}

      {/* Render fields based on element type */}
      {elementData.type === 'class' && renderClassFields()}
      {elementData.type === 'attribute' && renderAttributeFields()}
      {elementData.type === 'method' && renderMethodFields()}

      <div className="properties-panel-buttons">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default PropertiesPanel;
