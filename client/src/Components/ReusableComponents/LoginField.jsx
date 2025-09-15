const LoginField = [
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
        name: "password",
        label: "Password *",
        type: "password",
        autoComplete: "off",
        placeholder: "Enter your password",
        validation: {
            required: "Password is required",
        },
    },
]
export default LoginField