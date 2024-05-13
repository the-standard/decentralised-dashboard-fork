const Card = (props) => {
  const {
    className,
  } = props;

  return (
    <div
      className={`card shadow-md tst-card ${className ? className : ''}`}
    >
      {props.children}
    </div>
  );
};

export default Card;