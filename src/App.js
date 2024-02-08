import React, { useState } from 'react';
import FormBuilder from './components/FormBuilder';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  const [selectedForm, setSelectedForm] = useState('');

  const handleFormSelect = (formId) => {
    setSelectedForm(formId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <h1>Form Builder</h1>
        <FormBuilder />
      </div>
      <br/>
      
    </DndProvider>
  );
}

export default App;
