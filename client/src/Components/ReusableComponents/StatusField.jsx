const NoteStatus=[
    {
        name:'name',
        label:'Status Column Name',
        type:'text',
        placeholder:'Enter Status Name',
        validation: {
            required: "Status name is required",
            minLength: { value: 2, message: "Status name must be at least 2 characters" },

        }
    }
]
export default NoteStatus;