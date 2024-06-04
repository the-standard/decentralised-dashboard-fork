export function Checkbox(props) {
  const {
    checked,
    onChange,
    label,
    className
  } = props;
  return (
    <>
      <div className={`form-control ${className}`}>
        <label className="label cursor-pointer">
          <span className="label-text">{label}</span> 
          <input
            type="checkbox"
            checked={checked} 
            onChange={onChange}
            className="checkbox"
          />
        </label>
      </div>
    </>
  )
}

export default Checkbox;