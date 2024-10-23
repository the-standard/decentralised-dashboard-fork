const Typography = (props) => {
  const type = props.variant || '';
  const classes = props.className || '';

  switch (type) {
    case 'p':
      return (
        <p
          className={`text-base font-normal ${classes ? classes : ''}`}
        >
          {props.children || ''}
        </p>
      );
    case 'h1':
      return (
        <h1
          className={`text-2xl font-semibold ${classes ? classes : ''}`}
        >
          {props.children || ''}
        </h1>
      );
    case 'h2':
      return (
        <h2
          className={`text-xl font-semibold ${classes ? classes : ''}`}
        >
          {props.children || ''}
        </h2>
      );
    case 'h3':
      return (
        <h3
          className={`text-lg font-medium ${classes ? classes : ''}`}
        >
          {props.children || ''}
        </h3>
      );
    default:
      return (
        <p
          className={`text-base ${classes ? classes : ''}`}
        >
          {props.children || ''}
        </p>
      );
    }
};

export default Typography;