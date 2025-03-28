import Card from "../ui/Card";
import Button from "../ui/Button";

import {
  XMarkIcon,
} from '@heroicons/react/24/outline';

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
          // className="fixed z-50 top-0 left-0 right-0 bottom-0"
          style={{
            position: 'fixed',
            inset: '0px',
            margin: '0px',
            display: 'grid',
            height: '100%',
            maxHeight: 'none',
            width: '100%',
            maxWidth: 'none',
            justifyItems: 'center',
            padding: '0px',
            overscrollBehavior: 'contain',
            zIndex: '999',
            backgroundColor: 'transparent',
            color: 'inherit',
            transitionDuration: '200ms',
            transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            transitionProperty: 'transform, opacity, visibility',
            overflowY: 'hidden',
          }}
        >
          <div
            className={"z-40 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full px-4 " + (wide ? "max-w-[62rem]" : "max-w-[42rem]") }
          >
            <Card className="card-compact w-full max-h-[90vh] tst-card relative">
              <Button
                color="ghost"
                size="sm"
                onClick={closeModal}
                className="btn-square absolute right-2 top-2 z-40 opacity-50 hover:opacity-100"
              >
                <XMarkIcon className="h-6 w-6 inline-block "/>
              </Button>
              <div className="card-body overflow-y-auto overflow-x-auto">
                {props.children}
              </div>
            </Card>
          </div>
          <div
            onClick={closeModal}
            className="z-30 fixed inset-0 bg-black/50"
          />
        </div>
      ) : (null)}
    </>
  );
};

export default Modal;