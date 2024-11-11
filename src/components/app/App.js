import React, { useState, useCallback } from 'react';
import '../../App.css';
import Canvas from '../Canvas/Canvas';
import Toolbar from '../Toolbar/Toolbar';
import PropertiesPanel from '../PropertiesPanel/PropertiesPanel';
import Sidebar from '../Sidebar/Sidebar';
import CodeGenerator from '../CodeGenerator/CodeGenerator';
import DiagramManager from '../DiagramManager/DiagramManager';
import ClassEditor from '../ClassEditor/ClassEditor';

// Helper function for unique ID generation
const generateUniqueId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

function App() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [classes, setClasses] = useState([]);
  const [associations, setAssociations] = useState([]);

  // Add a new class to the diagram
  const handleAddElement = useCallback((type) => {
    const newElement = {
      id: generateUniqueId(type),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${classes.length + 1}`,
      position: { x: 100 + classes.length * 10, y: 100 + classes.length * 10 },
      attributes: [],
      methods: [],
    };
    setClasses((prevClasses) => [...prevClasses, newElement]);
  }, [classes.length]);

  // Check if an association already exists between two classes
  const associationExists = (classId1, classId2) =>
    associations.some(
      (assoc) =>
        (assoc.classId1 === classId1 && assoc.classId2 === classId2) ||
        (assoc.classId1 === classId2 && assoc.classId2 === classId1)
    );

  // Add an association between two classes
  const handleAddAssociationBetweenClasses = (classId1, classId2) => {
    if (!classId1 || !classId2 || classId1 === classId2) {
      alert('Invalid association: distinct class IDs are required.');
      return;
    }
    if (associationExists(classId1, classId2)) {
      alert('Association already exists between these classes.');
      return;
    }
    setAssociations((prevAssociations) => [
      ...prevAssociations,
      { classId1, classId2 },
    ]);
  };

  // Update a specific class in the diagram
  const handleUpdateElement = (updatedElement) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === updatedElement.id ? updatedElement : cls
      )
    );
  };

  // Update both classes and associations in the diagram
  const setDiagramData = ({ classes = [], associations = [] }) => {
    setClasses(classes);
    setAssociations(associations);
  };

  const diagramData = { classes, associations };

  return (
    <div className="app">
      <Toolbar
        onAddClass={() => handleAddElement('class')}
        onAddAssociation={() => alert('Select two classes to create an association.')}
      />

      <Sidebar />

      <Canvas
        setSelectedElement={setSelectedElement}
        classes={classes}
        associations={associations}
        onAddElement={handleAddElement}
        onUpdateElement={handleUpdateElement}
        onAddAssociation={handleAddAssociationBetweenClasses}
      />

      <PropertiesPanel
        selectedElement={selectedElement}
        onUpdateElement={handleUpdateElement}
      />

      <DiagramManager
        diagramData={diagramData}
        setDiagramData={setDiagramData}
      />

      {/* Conditional rendering for ClassEditor based on selected element */}
      {selectedElement?.type === 'class' && (
        <ClassEditor
          selectedClass={selectedElement}
          onUpdateClass={handleUpdateElement}
        />
      )}

      <CodeGenerator diagramData={diagramData} />
    </div>
  );
}

export default App;
