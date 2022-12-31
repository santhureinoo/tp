interface Props {
    className: string;
    isLoading?: boolean;
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const PillButton = ({ className, text, isLoading = false, disabled = false, onClick }: Props) => {
    return (
        <button disabled={disabled} onClick={(event: any) => {
            if (onClick) {
                onClick();
            }
        }} className={`rounded-full my-auto h-8 disabled:opacity-50 ${className}`}>
            {text}
        </button>
    )
}

export default PillButton;