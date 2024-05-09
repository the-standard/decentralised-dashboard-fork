const Card = (props) => {
  const {
    className,
  } = props;

  return (
    <div
      className={`card card-bordered bg-base-100 shadow-md tst-card ${className}`}
    >
      {props.children}
    </div>
  );
};

export default Card;