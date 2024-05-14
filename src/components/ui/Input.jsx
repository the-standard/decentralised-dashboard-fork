const Input = (props) => {
  const {
    className,
    placeholder,
    type,
    onChange,
    disabled,
    useRef,
    value,
    variant
  } = props;

  switch (variant) {
    default:
      return (
        <input
          className={`input ${className ? className : ''}`}
          placeholder={placeholder || ''}
          type={type || 'text'}
          onChange={onChange ? (
            onChange
          ) : (
            () => null
          )}
          disabled={disabled || false}
          ref={useRef || null}
          value={value || undefined}
        >
          {props.children}
        </input>
      );
    }

};

export default Input;