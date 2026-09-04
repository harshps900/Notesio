import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react';
import { useTheme } from '../../Context/ThemeProvider';

export default function Form({ fields, buttonText, onSubmit, buttonClassName, initialValue = {} }) {

    const stableInitialValue = useMemo(() => initialValue || {}, [initialValue]);
    
    const { isDark } = useTheme();
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
                className="w-full   mx-auto  justify-end    px-2 py-2  ">
                <form
                    onSubmit={handleSubmit(handleFormData)}
                    className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name} className="text-left space-y-1.5">
                            <label htmlFor={field.name} className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                {field.label}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    rows={field.rows || 4}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 placeholder-slate-400 ${
                                        isDark ? 'text-slate-100 bg-slate-800/80 border-slate-700' : 'text-slate-900 bg-slate-50 border-slate-200'
                                    } ${
                                        errors[field.name]
                                            ? 'border-rose-500 focus:ring-rose-400'
                                            : 'focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                    {...register(field.name, field.validation)}
                                    aria-invalid={errors[field.name] ? "true" : "false"}
                                />
                            ) : field.type === 'file' ? (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 placeholder-slate-400 ${
                                        isDark ? 'text-slate-100 bg-slate-800/80 border-slate-700' : 'text-slate-900 bg-slate-50 border-slate-200'
                                    } ${
                                        errors[field.name]
                                            ? 'border-rose-500 focus:ring-rose-400'
                                            : 'focus:border-indigo-500 focus:ring-indigo-500/20'
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
                                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 placeholder-slate-400 ${
                                        isDark ? 'text-slate-100 bg-slate-800/80 border-slate-700' : 'text-slate-900 bg-slate-50 border-slate-200'
                                    } ${
                                        errors[field.name]
                                            ? 'border-rose-500 focus:ring-rose-400'
                                            : 'focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                    {...register(field.name, field.validation)}
                                    aria-invalid={errors[field.name] ? "true" : "false"}
                                />
                            )}
                            {errors[field.name] && (
                                <p className="text-xs font-semibold text-rose-500 pt-0.5">{errors[field.name].message}</p>
                            )}
                        </div>
                    ))}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${buttonClassName}`}
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}