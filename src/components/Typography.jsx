const Typography = (props) => {
  const type = props.variant || '';
  const customClasses = props.className || '';

  let useClass = 'text-base font-normal';

  switch (type) {
    case 'p':
      useClass = 'inline-block text-base font-normal';
      break;
    case 'h1':
      useClass = 'inline-block text-2xl font-semibold';
      break;
    case 'h2':
      useClass = 'inline-block text-xl font-semibold';
      break;
    case 'h3':
      useClass = 'inline-block text-lg font-medium';
      break;  
    default:
      useClass = 'inline-block text-base font-normal';
      break;
  }

  return (
    <div
      className={useClass + ' ' + customClasses}
    >
      {props.children || ''}
    </div>
  );
};

export default Typography;