import {
  Button as DaisyButton,
} from 'react-daisyui';

const Button = (props) => {
  const {
    className,
    shape,
    size,
    variant,
    color,
    glass,
    wide,
    fullWidth,
    loading,
    disabled,
    onClick
  } = props;

  console.log()

  return (
    <DaisyButton
      className={` ${className ? className : ''}`}
      shape={'' || shape}
      size={'' || size}
      variant={null || variant}
      color={null || color}
      glass={false || glass}
      wide={false || wide}
      fullWidth={false || fullWidth}
      loading={false || loading}
      disabled={false || disabled}
      onClick={onClick ? (
        onClick
      ) : (
        () => null
      )}
    >
      {props.children}
    </DaisyButton>
  );
};

export default Button;