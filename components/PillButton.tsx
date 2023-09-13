interface Props {
    className: string;
    height?: string;
    isLoading?: boolean;
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const PillButton = ({ className, text, isLoading = false, disabled = false, height = "h-8", onClick }: Props) => {
    return (
        <button disabled={disabled} onClick={(event: any) => {
            if (onClick) {
                onClick();
            }
        }} className={`rounded-full my-auto ${height} disabled:opacity-50 ${className}`}>
            {text}
        </button>
    )
}

export default PillButton;