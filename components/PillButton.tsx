interface Props {
    className: string;
    text: string;
}

const PillButton = ({className, text}: Props) => {
    return (
        <button className={`rounded-full my-auto h-8 ${className}`}>
            {text}
        </button>
    )
}

export default PillButton;