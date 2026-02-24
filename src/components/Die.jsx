export default function Die({value, isHeld, holdFunction}) {
    return (
        <button className = {`die ${isHeld ? "green": ""}`}
        onClick={holdFunction}>
            {value}
        </button>
    )
}