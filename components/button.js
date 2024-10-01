export default function Button(props) {
    return (
        <button
            className={
                "rounded py-2 px-4 text-white w-full items-center font-bold text-sm transition-all duration-200 hover:opacity-80 " +
                (props.bgClass ? props.bgClass : "bg-accent") +
                (props.icon ? ' flex' : '')
            }
        >
            {props.icon && props.iconPosition !== "right" && (
                <span className={props.text ? "mr-2" : ""}>{props.icon}</span>
            )}
            <span className="whitespace-nowrap">{props.text}</span>
            {props.icon && props.iconPosition === "right" && (
                <span className={props.text ? "ml-2" : ""}>{props.icon}</span>
            )}
        </button>
    );
}
