import {
  Card,
} from 'react-daisyui';

const Modal = (props) => {
  const {
    open,
    closeModal
  } = props;

  return (
    <>
      {open ? (
        <div
          className="fixed z-50 top-0 left-0 right-0 bottom-0"
        >
          <div
            className="z-40 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full max-w-[32rem] px-4"
          >
            <Card
              compact
              className="bg-base-100 shadow-md w-full"
            >
              <Card.Body>
                {props.children}
              </Card.Body>
            </Card>
          </div>
          <div
            onClick={closeModal}
            className="opacity-25 z-30 fixed inset-0 bg-black"
          />
        </div>
      ) : (null)}
    </>
  );
};

export default Modal;