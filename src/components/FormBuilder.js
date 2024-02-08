import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import axios from 'axios';

const components = [
    { type: 'text', label: 'Text Input' },
    { type: 'date', label: 'Date Input' },
    { type: 'select', label: 'Selection Dropdown' },
    { type: 'radio', label: 'Radio Button' },
    { type: 'checkbox', label: 'Checkbox Group' },
    { type: 'textarea', label: 'Textarea' },
    { type: 'label', label: 'Label' },
];

const FormBuilder = () => {
    const [formComponents, setFormComponents] = useState([]);
    const [formName, setFormName] = useState('');
    const [selectedForm, setSelectedForm] = useState('');

    const handleDrop = (type) => {
        setFormComponents([...formComponents, { type, id: Date.now(), label: '', placeholder: '' }]);
    };

    const handleChangeLabel = (id, e) => {
        const updatedComponents = formComponents.map((component) =>
            component.id === id ? { ...component, label: e.target.value } : component
        );
        setFormComponents(updatedComponents);
    };

    const handleChangePlaceholder = (id, e) => {
        const updatedComponents = formComponents.map((component) =>
            component.id === id ? { ...component, placeholder: e.target.value } : component
        );
        setFormComponents(updatedComponents);
    };

    const [forms, setForms] = useState([]);
   

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/getData');
                console.log(response.data.formData)
                const modifiedData = response.data.formData.map(item => ({
                    ...item,
                    components: JSON.parse(item.components)
                }));
                setForms(modifiedData);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        fetchForms();
    }, []);

    

    const handleFormChange = (e) => {
        const selectedFormId = e.target.value;
        setSelectedForm(selectedFormId);

        console.log(selectedFormId)
        const response =  axios.get("http://127.0.0.1:8000/api/forms/" + selectedFormId);
        console.log(response);
        // setFormComponents(response.data.formData);
        // setSelectedForm(selectedFormId);
        // try {
        //     const response = axios.get("http://127.0.0.1:8000/api/forms/" + selectedFormId);
        //     console.log('Form components:', response.data.components);
            // setFormComponents(response.data.components);
            // setSelectedForm(selectedFormId);
        // } catch (error) {
        //     console.error('Error fetching form components:', error);
        // }
        
      };

    const handleSaveForm = () => {
        const formData = {
            name: formName,
            components: formComponents,
        };
        console.log(formData);

        axios.post('http://localhost:8000/api/save-form', formData)
            .then(response => {
                console.log(response.data);
                alert('Form saved successfully!');
            })
            .catch(error => {
                console.error('Error saving form:', error);
                alert('Failed to save form. Please try again.');
            });
    };

    return (
        <div>
            <div className='row'>
                <div className='card sm p-4'>
                    <div style={{ marginBottom: '20px' }}>
                        <h2>Form Components</h2>
                        {components.map((component, index) => (
                            <FormComponent key={index} component={component} onDrop={handleDrop} />
                        ))}
                    </div>
                </div>
            </div>
            <br />
            <div style={{ border: '1px solid #ccc', minHeight: '200px' }}>
                <h2>Form Canvas</h2>
                {/* Render form components on the canvas */}
                {formComponents.map((component) => (
                    <div key={component.id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
                        <p>{component.type}</p>
                        <input
                            type="text"
                            placeholder="Label"
                            value={component.label}
                            onChange={(e) => handleChangeLabel(component.id, e)}
                        />
                        <input
                            type="text"
                            placeholder="Placeholder"
                            value={component.placeholder}
                            onChange={(e) => handleChangePlaceholder(component.id, e)}
                        />
                    </div>
                ))}
            </div>
            <br />
            <div className="">
                <label className="form-label">Form Name:</label>
                <input type="text" onChange={e => setFormName(e.target.value)} id="name" placeholder="Enter Your Form Name" />
            </div>
            <button onClick={handleSaveForm}>Save</button>

            <div className='container'>
                <h2>Select Form:</h2>
                {forms.length > 0 ? (
                    <select value={selectedForm} onChange={handleFormChange}>
                        {forms.map((form) => (
                            <option key={form.id} value={form.id}>{form.name}</option>
                        ))}
                    </select>
                ) : (
                    <p>Loading forms...</p>
                )}
            </div>
        </div>
    );
};

const FormComponent = ({ component, onDrop }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'form-component',
        item: { type: component.type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div
            style={{ cursor: 'pointer', opacity: isDragging ? 0.5 : 1 }}
            onDragEnd={() => onDrop(component.type)}
            ref={drag}
        >
            {component.label}
        </div>
    );
};

export default FormBuilder;
