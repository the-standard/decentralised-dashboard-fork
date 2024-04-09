import {
  Loading,
} from 'react-daisyui';

const CenterLoader = (props) => {
  const { slim } = props;

  let useStyle = {minHeight: '200px'};
  
  if (slim) {
    useStyle = {minHeight: '160px'};
  }

  return (
    <div
      className="flex justify-center w-full"
      style={useStyle}
    >
      <Loading variant="spinner" size="lg" />
    </div>
  );
};

export default CenterLoader;