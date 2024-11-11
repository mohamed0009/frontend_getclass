import React, { useCallback } from 'react';

const elements = [
  { type: 'class', label: 'Class', tooltip: 'Drag to add a class' },
  { type: 'attribute', label: 'Attribute', tooltip: 'Drag to add an attribute' },
  { type: 'method', label: 'Method', tooltip: 'Drag to add a method' },
];

function Sidebar() {
  // Memoized drag start handler
  const handleDragStart = useCallback((e, type) => {
    e.dataTransfer.setData("elementType", type);
    e.target.setAttribute("aria-grabbed", "true");
    e.target.classList.add("dragging");
  }, []);

  // Memoized drag end handler
  const handleDragEnd = useCallback((e) => {
    e.target.removeAttribute("aria-grabbed");
    e.target.classList.remove("dragging");
  }, []);

  // Keyboard-based drag initiation
  const handleKeyDown = useCallback((e, type) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.dataTransfer.setData("elementType", type);
      e.target.setAttribute("aria-grabbed", "true");
      e.target.classList.add("dragging");
    }
  }, []);

  return (
    <div className="sidebar" role="list" aria-label="Sidebar with draggable elements">
      {elements.map((element) => (
        <div
          key={element.type}
          className={`sidebar-item ${element.type}-item`}
          draggable
          onDragStart={(e) => handleDragStart(e, element.type)}
          onDragEnd={handleDragEnd}
          onKeyDown={(e) => handleKeyDown(e, element.type)}
          role="listitem"
          tabIndex="0"
          aria-label={`Draggable ${element.label}`}
          aria-grabbed="false"
          title={element.tooltip}
        >
          {element.label}
        </div>
      ))}
    </div>
  );
}

export default React.memo(Sidebar);
