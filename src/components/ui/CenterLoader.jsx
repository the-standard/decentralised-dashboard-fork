import {
  Loading,
} from 'react-daisyui';
import Typography from "./Typography";

const CenterLoader = (props) => {
  const { slim, label } = props;

  let useStyle = {minHeight: '200px'};
  
  if (slim) {
    useStyle = {minHeight: '160px'};
  }

  return (
    <div
      className="flex flex-col justify-center items-center w-full"
      style={useStyle}
    >
      <div className="flex flex-col justify-center items-center">
        <Loading variant="spinner" size="lg" className="block" />
        <Typography variant="p" className="mt-2 opacity-80">
          {label || '\u00A0'}
        </Typography>
      </div>
    </div>
  );
};

export default CenterLoader;