export default function CreateAdCheckbox(props) {
    return (
        <div
            key={props.value}
            className="rounded border border-lbr flex items-center mr-2 mt-2 px-4 py-2 relative"
        >
            <input
                type="checkbox"
                id={`${props.type}_${props.value}`}
                onClick={(e) => {
                    e.preventDefault();
                }}
                className="mr-2 checked:bg-accent"
            />
            <label className="whitespace-nowrap select-none">
                {props.label}
            </label>
            <div className="absolute top-0 left-0 w-full h-full rounded opacity-70 hover:cursor-pointer"
                 onClick={() => {
                     let elem = document.getElementById(`${props.type}_${props.value}`);
                     let currentValue = elem.checked;
                     let updatedValue = !currentValue;
                     elem.checked = updatedValue;

                     if (updatedValue) {
                         props.updateArray(props.type, props.value, "add");
                     } else {
                         props.updateArray(props.type, props.value, "delete");
                     }
                 }}
            ></div>
        </div>
    );
}
