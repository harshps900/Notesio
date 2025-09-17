import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react';

export default function Form({ fields, buttonText, onSubmit, buttonClassName, initialValue = {} }) {
    
    const stableInitialValue = useMemo(() => initialValue || {}, [initialValue]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: stableInitialValue
    });

    useEffect(() => {
        reset(stableInitialValue);
    }, []);

    const handleFormData = (data) => {
        onSubmit(data);
    };
    return (
        <>
            <div
                className="w-full   mx-auto shadow-md justify-end   rounded-xl px-2 py-2  ">
                <form
                    onSubmit={handleSubmit(handleFormData)}
                    className="space-y-2 h-auto">
                    {fields.map((field) => (
                        <div key={field.name} >
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-800 mb-1">
                                {field.label}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    rows={field.rows || 4}
                                    className={`w-full text-gray-800 px-4 py-3 bg-white border rounded-lg 
                                                    focus:outline-none focus:ring-2 placeholder-gray-400 
                                                        ${errors[field.name]
                                            ? 'border-red-500 focus:ring-red-300'
                                            : 'border-gray-300 focus:ring-indigo-400'
                                        }`}
                                    {...register(field.name, field.validation)}
                                    aria-invalid={errors[field.name] ? "true" : "false"}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    autoComplete="off"
                                    placeholder={field.placeholder}
                                    className={`w-full text-gray-800 px-4 py-3 bg-white border rounded-lg 
                                            focus:outline-none focus:ring-2 placeholder-gray-400 
                                                        ${errors[field.name]
                                            ? 'border-red-500 focus:ring-red-300'
                                            : 'border-gray-300 focus:ring-indigo-400'
                                        }`}
                                    {...register(field.name, field.validation)}
                                    aria-invalid={errors[field.name] ? "true" : "false"}
                                />
                            )}
                            {errors[field.name] && (
                                <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
                            )}
                        </div>
                    ))}
                    <div >
                        <button
                            type="submit"
                            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${buttonClassName}`}
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}