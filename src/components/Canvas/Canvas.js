import React, { useRef, useCallback } from 'react';

function Canvas({ setSelectedElement, classes, associations, onAddElement, onUpdateElement, onAddAssociation }) {
  const canvasRef = useRef(null);

  // Handler to deselect an element when clicking on an empty area of the canvas
  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
    }
  }, [setSelectedElement]);

  // Handler for dropping a new element onto the canvas
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData("elementType");

    if (!elementType) return; // Guard clause to avoid errors if elementType is undefined

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const position = {
      x: e.clientX - canvasRect.left,
      y: e.clientY - canvasRect.top,
    };

    const newElement = {
      id: `class-${classes.length + 1}`,
      type: elementType,
      name: elementType.charAt(0).toUpperCase() + elementType.slice(1),
      position,
      attributes: ['attribute1', 'attribute2'], // Example attributes
      methods: ['method1()', 'method2()'] // Example methods
    };

    onAddElement(newElement);
  }, [classes.length, onAddElement]);

  // Allows dragging elements over the canvas
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handler for starting the drag process
  const handleDragStart = useCallback((e, element) => {
    e.dataTransfer.setData("draggedElementId", element.id);
  }, []);

  // Handler for dropping an element at a new position
  const handleDragEnd = useCallback((e, element) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const updatedPosition = {
      x: e.clientX - canvasRect.left,
      y: e.clientY - canvasRect.top,
    };

    const updatedElement = { ...element, position: updatedPosition };
    onUpdateElement(updatedElement);
  }, [onUpdateElement]);

  // Render individual UML class components with draggable and selectable features
  const renderClass = (classItem) => (
    classItem.position && (
      <div 
        key={classItem.id}
        className="uml-class"
        style={{ 
          position: 'absolute', 
          left: classItem.position.x, 
          top: classItem.position.y,
          border: '1px solid black',
          padding: '10px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}
        draggable
        onDragStart={(e) => handleDragStart(e, classItem)}
        onDragEnd={(e) => handleDragEnd(e, classItem)}
        onClick={(e) => {
          e.stopPropagation(); // Prevents deselecting element on canvas click
          setSelectedElement(classItem);
        }}
      >
        <div><strong>{classItem.name}</strong></div>
        <hr />
        <div>
          <strong>Attributes:</strong>
          <ul>
            {classItem.attributes.map((attr, index) => (
              <li key={index}>{attr}</li>
            ))}
          </ul>
        </div>
        <hr />
        <div>
          <strong>Methods:</strong>
          <ul>
            {classItem.methods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  );

  // Render association lines between UML classes
  const renderAssociationLines = () => {
    return associations.map((assoc, index) => {
      const class1 = classes.find((cls) => cls.id === assoc.classId1);
      const class2 = classes.find((cls) => cls.id === assoc.classId2);

      if (!class1 || !class2) return null; // Skip if any class is missing

      return (
        <svg key={index} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
          <line 
            x1={class1.position.x + 50} y1={class1.position.y + 50}
            x2={class2.position.x + 50} y2={class2.position.y + 50}
            stroke="black" strokeWidth="2"
            markerEnd="url(#arrowhead)" 
          />
        </svg>
      );
    });
  };

  return (
    <div 
      ref={canvasRef}
      className="canvas" 
      onClick={handleCanvasClick} 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {/* Render UML classes */}
      {classes.map(renderClass)}
      
      {/* Render associations */}
      {renderAssociationLines()}
    </div>
  );
}

export default Canvas;
