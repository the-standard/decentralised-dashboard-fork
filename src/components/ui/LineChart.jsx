import {
  Button as DaisyButton,
} from 'react-daisyui';

const LineChart = (props) => {
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

  return (
    <DaisyButton
      className={` ${className ? className : ''}`}
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

export default LineChart;