import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNoteSticky, faClock } from "@fortawesome/free-regular-svg-icons";
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import './Style.css'

const NoteDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get('title');
  const description = queryParams.get('description');
  const status = queryParams.get('status');

  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);


  const navigate = useNavigate();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Retrieve the list of columns from local storage
    const columns = JSON.parse(localStorage.getItem('columns')) || {};
  
    if (!columns[status]) {
      console.log('Invalid column:', status);
      return;
    }
  
    // Create an updated note object with the edited data
    const updatedNote = {
      title: editedTitle,
      description: editedDescription,

    };

  
    // Find index of the note to edit
    const noteIndex = columns[status].findIndex(
      (note) => note.title === title && note.description === description
    );
      //Replace old note with updated
    if (noteIndex !== -1) {
      columns[status][noteIndex] = updatedNote;
    } else {
      console.log('Note not found:', title, description, status);
      return;
    }
  
    // Store the updated columns back in local storage
    localStorage.setItem('columns', JSON.stringify(columns));
  
    navigate('/');
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    const columns = JSON.parse(localStorage.getItem('columns')) || {};
  
    if (!columns[status]) {
      console.log('Invalid column:', status);
      return;
    }
  
    const updatedColumn = columns[status].filter((note) => {
      return note.title !== title || note.description !== description ;
    });
  
    columns[status] = updatedColumn;
  
    localStorage.setItem('columns', JSON.stringify(columns));
  
    navigate('/');
  };
  

  return (
    <div className='note-detail-container'>
      {isEditing ? (
        <div className='edit-form'>
          <h3 className='title-edit'>
          <FontAwesomeIcon icon={faNoteSticky} /> &nbsp;
          <input
            type="text"
            className='custom-input'
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          </h3>
          <div className="desc-edit my-3">
            <p>Description:</p>
          <textarea
            className='custom-input'
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          </div>
        </div>
      ) : (
        <div>
          <h3 className='detail-title'> <FontAwesomeIcon icon={faNoteSticky} /> &nbsp;
             {title}</h3>
          <div className='detail-desc'> 
          <FontAwesomeIcon icon={faListUl} style={{color: "#ffffff",}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {description}</div>
        </div>
      )}
      <div className="lower-container">
      <div className='detail-status'><FontAwesomeIcon icon={faClock} spinPulse /> &nbsp;
       {status}</div>
       <div className="edit-save">
      {isEditing ? (
        <div className="save-btn">
        <button  className='btn btn-low' onClick={handleSave}>Save</button>
        </div>
      ) : (
        <button className='btn btn-low' onClick={handleEdit}>Edit</button>
      )}
      </div>
      <button className='btn btn-low' onClick={handleDelete}>Delete</button>
    </div>
    </div>
  );
};

export default NoteDetail;
