const NoteField = [
    {
        name: "title",
        label: "Note Title*",
        type: "text",
        placeholder: "My Awesome Note",
        validation: {
            required: "Title is required",
            minLength: { value: 2, message: "Title must be at least 2 characters" },
            maxLength: { value: 100, message: "Title cannot exceed 100 characters" },
        },
    },
    {
        name: "description",
        label: "Note Description*",
        type: "textarea",
        placeholder: "Description of the Note",
        rows: 5,
        validation: {
            required: "Description is required",
            minLength: {
                value: 5,
                message: "Message must be at least 5 characters",
            },
        },
    },
    {
        name: "image",
        label: "Note Image",
        type: "file",
        validation: {
            
        },
        
    },
    {
        name:'tags',
        label:'Tags',
    }
    
]
export default NoteField