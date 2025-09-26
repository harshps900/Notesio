import { min } from "date-fns"

const ContactField = [
    {
        name: "name",
        label: "Name*",
        type: "text",
        placeholder: "Name",
        validation: {
            required: "Name is required",
        }

    },
    {
        name: "email",
        label: "Email Address *",
        type: "email",
        placeholder: "john@example.com",
        autoComplete: "off",
        validation: {
            required: "Email is required",
            pattern: {
                value: /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
            },
        },
    },
    {
        name: "message",
        label: "Message*",
        type: "textarea",
        placeholder: "Describe your ideas",
        rows: 5,
        validation: {
            required: "Description is required",
            minLength: {
                value: 5,
                message: "Message must be at least 5 characters",
            },
        },
    },
]
export default ContactField
