import {
  Loading,
} from 'react-daisyui';

const CenterLoader = (props) => {
  return (
    <div
      className="flex justify-center w-full"
      style={{minHeight: '200px'}}
    >
      <Loading variant="spinner" size="lg" />
    </div>
  );
};

export default CenterLoader;