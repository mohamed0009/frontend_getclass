import React, { useState, useRef, useEffect, useCallback } from 'react';

function DiagramManager({ diagramData, setDiagramData }) {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  // Validate that diagram data has the expected structure
  const isValidDiagramData = useCallback((data) => {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.classes) &&
      Array.isArray(data.associations)
    );
  }, []);

  // Display a temporary message for feedback, clears after 3 seconds
  const setTemporaryMessage = useCallback((msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    clearTimeout(messageTimeoutRef.current); // Clear any existing timeouts
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
      setIsError(false);
    }, 3000);
  }, []);

  // Save the diagram data to localStorage
  const handleSave = () => {
    if (!isValidDiagramData(diagramData)) {
      setTemporaryMessage('Invalid diagram data. Unable to save.', true);
      return;
    }
    try {
      const jsonData = JSON.stringify(diagramData);
      localStorage.setItem('savedDiagram', jsonData);
      setTemporaryMessage('Diagram saved successfully!');
    } catch (error) {
      console.error("Error saving diagram:", error);
      setTemporaryMessage('Failed to save the diagram.', true);
    }
  };

  // Load the diagram data from localStorage
  const handleLoad = () => {
    try {
      const jsonData = localStorage.getItem('savedDiagram');
      if (jsonData) {
        const loadedData = JSON.parse(jsonData);
        if (isValidDiagramData(loadedData)) {
          setDiagramData(loadedData);
          setTemporaryMessage('Diagram loaded successfully!');
        } else {
          setTemporaryMessage('Saved diagram data is corrupted.', true);
        }
      } else {
        setTemporaryMessage('No saved diagram found.', true);
      }
    } catch (error) {
      console.error("Error loading diagram:", error);
      setTemporaryMessage('Failed to load the diagram.', true);
    }
  };

  // Clear the current diagram data
  const handleClear = () => {
    setDiagramData({ classes: [], associations: [] });
    setTemporaryMessage('Diagram cleared.');
  };

  // Export the diagram data as a JSON file
  const handleExport = () => {
    if (!isValidDiagramData(diagramData)) {
      setTemporaryMessage('Invalid diagram data. Unable to export.', true);
      return;
    }
    try {
      const jsonData = JSON.stringify(diagramData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.json';
      link.click();
      URL.revokeObjectURL(url);
      setTemporaryMessage('Diagram exported as JSON file.');
    } catch (error) {
      console.error("Error exporting diagram:", error);
      setTemporaryMessage('Failed to export the diagram.', true);
    }
  };

  // Import JSON file as diagram data
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setTemporaryMessage('Unsupported file type. Please upload a JSON file.', true);
      return;
    }

    if (file.size > 1000000) {
      setTemporaryMessage('File too large. Please upload a JSON file under 1MB.', true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (isValidDiagramData(importedData)) {
          setDiagramData(importedData);
          setTemporaryMessage('Diagram imported successfully!');
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (error) {
        console.error("Error importing diagram:", error);
        setTemporaryMessage('Invalid file format. Please upload a valid JSON file.', true);
      }
    };

    reader.readAsText(file);
    fileInputRef.current.value = ''; // Reset the file input
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => clearTimeout(messageTimeoutRef.current);
  }, []);

  // Trigger hidden file input for importing a file
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="diagram-manager">
      <button onClick={handleSave} aria-label="Save Diagram">Save Diagram</button>
      <button onClick={handleLoad} aria-label="Load Diagram">Load Diagram</button>
      <button onClick={handleClear} aria-label="Clear Diagram">Clear Diagram</button>
      <button onClick={handleExport} aria-label="Export Diagram as JSON">Export as JSON</button>
      <button onClick={handleFileInputClick} aria-label="Import Diagram from JSON" className="import-button">
        Import JSON
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
        aria-label="Import JSON file"
      />

      {message && (
        <div
          className={`message ${isError ? 'error-message' : 'success-message'}`}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default DiagramManager;
