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
    onClick,
    active,
  } = props;

  let useClass = '';
  if (className) {
    useClass = className;
  }
  if (active) {
    useClass = `${useClass} active`;
  }

  return (
    <DaisyButton
      className={useClass}
      shape={shape || ''}
      size={size || ''}
      variant={variant || null}
      color={color || null}
      glass={glass || false}
      wide={wide || false}
      fullWidth={fullWidth || false}
      loading={loading || false}
      disabled={disabled || false}
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