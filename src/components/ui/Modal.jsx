import Card from "../ui/Card";

const Modal = (props) => {
  const {
    open,
    closeModal,
    wide,
  } = props;

  return (
    <>
      {open ? (
        <div
          className="fixed z-50 top-0 left-0 right-0 bottom-0"
        >
          <div
            className={"z-40 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full px-4 " + (wide ? "max-w-[48rem]" : "max-w-[34rem]") }
          >
            <Card className="card-compact w-full max-h-[90vh] overflow-scroll">
              <div className="card-body">
                {props.children}
              </div>
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