import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
}

export default function Button({
children,
isLoading,
className = '',
variant = 'primary',
...props
}: ButtonProps) {

    const baseStyles = "flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"; 

    const variants ={
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400"
    };

    return (
        <>
        <button 
        className={`${baseStyles} ${variants[variant]}  ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
        </>
    )
}