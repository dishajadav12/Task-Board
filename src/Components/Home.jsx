import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const ProjectBoard = () => {
  const initialColumns = {
    "Not Started": [],
    "In Progress": [],
    Done: [],
  };

  const initialNewTasks = {
    "Not Started": { title: "", description: "" },
    "In Progress": { title: "", description: "" },
    Done: { title: "", description: "" },
  };

  const [columns, setColumns] = useState(() => {
    const storedColumns = JSON.parse(localStorage.getItem("columns"));
    return storedColumns || initialColumns;
  });
  const [newTasks, setNewTasks] = useState(initialNewTasks);
  const [addingNewTask, setAddingNewTask] = useState({
    "Not Started": false,
    "In Progress": false,
    Done: false,
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [sourceColumn, setSourceColumn] = useState(null);
  const [targetColumn, setTargetColumn] = useState(null);

  const navigate = useNavigate();

  const handleColumnInputChange = (column, key, value) => {
    setNewTasks((prevNewTasks) => ({
      ...prevNewTasks,
      [column]: {
        ...prevNewTasks[column],
        [key]: value,
      },
    }));
  };

  const handleNoteDetail = (column, task) => {
    navigate(
      `/notedetail?title=${task.title}&description=${task.description}&status=${column}`
    );
  };

  const handleAddTask = (column) => {
    if (newTasks[column].title.trim() === "") return;

    const updatedColumns = { ...columns };
    updatedColumns[column] = [...updatedColumns[column], newTasks[column]];
    setColumns(updatedColumns);

    setNewTasks((prevNewTasks) => ({
      ...prevNewTasks,
      [column]: { title: "", description: "" },
    }));

    setAddingNewTask((prevState) => ({
      ...prevState,
      [column]: false,
    }));
  };
  useEffect(() => {
    try {
      // Store data in local storage whenever columns change
      localStorage.setItem("columns", JSON.stringify(columns));
    } catch (error) {
      console.error("Error storing data in localStorage:", error);
    }
  }, [columns]);

  useEffect(() => {
    try {
      // Retrieve data from local storage
      const storedColumns = JSON.parse(localStorage.getItem("columns"));
      if (storedColumns) {
        setColumns(storedColumns);
      }
    } catch (error) {
      console.error("Error retrieving data from localStorage:", error);
    }
  }, []);

  // Function to drag and drop title

  const handleDragStart = (e, column, task) => {
    e.dataTransfer.setData("text/plain", ""); // required for some browsers
    setDraggedTask(task);
    setSourceColumn(column);
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    setTargetColumn(column);
  };

  const handleDrop = (e, column) => {
    e.preventDefault();
    if (draggedTask) {
      const updatedColumns = { ...columns };
      updatedColumns[sourceColumn] = updatedColumns[sourceColumn].filter(
        (task) => task !== draggedTask
      );
      updatedColumns[column] = [...updatedColumns[column], draggedTask];
      setColumns(updatedColumns);

      setDraggedTask(null);
      setSourceColumn(null);
      setTargetColumn(null);
    }
  };

  // Function to close add new task form 
  const handleClose = (column) => {
    setNewTasks((prevNewTasks) => ({
      ...prevNewTasks,
      [column]: { title: "", description: "" },
    }));
    setAddingNewTask((prevState) => ({
      ...prevState,
      [column]: false,
    }));
  };

  return (
    <div>
      
      <div className="status-columns">
        {Object.keys(columns).map((column) => (
          <div
            key={column}
            className={`status-column${
              targetColumn === column ? " drag-over" : ""
            } status-column-style`}
            onDragOver={(e) => handleDragOver(e, column)}
            onDrop={(e) => handleDrop(e, column)}
          >
            <div className="status-heading">
              {column}{" "}
              <div className="note-count">{columns[column].length}</div>
            </div>
            {/* To print task title and drag and drop functionality */}
            <div className="task-list">
              {columns[column].map((task, index) => (
                <div
                  key={index}
                  className={`task${draggedTask === task ? " dragged" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column, task)}
                >
                  <div
                    className="note-title"
                    onClick={() => handleNoteDetail(column, task)}
                  >
                    {task.title}
                  </div>
                </div>
              ))}
            </div>
             
             {/* For adding new card */}
            {addingNewTask[column] ? (
              <div className="new-task">
                <div className="title-input">
                  <input
                  className="custom-input"
                    type="text"
                    placeholder="Card Title"
                    value={newTasks[column].title}
                    onChange={(e) => {
                      handleColumnInputChange(column, "title", e.target.value);
                    }}
                  />
                </div>
                <div className="description-input">
                  <textarea
                    className="custom-input"
                    placeholder="Description..."
                    value={newTasks[column].description}
                    onChange={(e) => {
                      handleColumnInputChange(
                        column,
                        "description",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="close-btn-container">
                  <button
                    className="btn btn-closee"
                    onClick={() => handleClose(column)}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>

                <button
                  className="btn btn-add-new btn-save-card"
                  onClick={() => handleAddTask(column)}
                >
                  <FontAwesomeIcon icon={faPlus} /> &nbsp; Add
                </button>
              </div>
            ) : (
              <button
                className="btn btn-add-new"
                onClick={() =>
                  setAddingNewTask((prevState) => ({
                    ...prevState,
                    [column]: true,
                  }))
                }
              >
                <FontAwesomeIcon icon={faPlus} /> &nbsp; New
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBoard;

