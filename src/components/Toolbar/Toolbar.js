import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faLink } from '@fortawesome/free-solid-svg-icons';

function Toolbar({ onAddClass, onAddAssociation, isDisabled = false }) {
  // Memoized handlers to avoid re-renders
  const handleAddClass = useCallback(() => {
    onAddClass();
  }, [onAddClass]);

  const handleAddAssociation = useCallback(() => {
    onAddAssociation();
  }, [onAddAssociation]);

  return (
    <div className="toolbar" role="toolbar" aria-label="Toolbar with add options">
      <button
        onClick={handleAddClass}
        aria-label="Add Class"
        title="Add a new class"
        className="toolbar-button add-class-button"
        type="button"
        disabled={isDisabled}
      >
        <FontAwesomeIcon icon={faPlus} size="sm" style={{ marginRight: '5px' }} />
        <span className="button-label">Add Class</span>
      </button>

      <button
        onClick={handleAddAssociation}
        aria-label="Add Association"
        title="Add a new association"
        className="toolbar-button add-association-button"
        type="button"
        disabled={isDisabled}
      >
        <FontAwesomeIcon icon={faLink} size="sm" style={{ marginRight: '5px' }} />
        <span className="button-label">Add Association</span>
      </button>
    </div>
  );
}

// Define PropTypes for type safety
Toolbar.propTypes = {
  onAddClass: PropTypes.func.isRequired,
  onAddAssociation: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default React.memo(Toolbar);
