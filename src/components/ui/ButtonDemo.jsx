import {
  PlusIcon,
} from '@heroicons/react/24/outline';

import Button from "./Button";
import Card from "./Card";
import Typography from "../../components/ui/Typography";

const ButtonDemo = (props) => {

  return (
    <Card className="card-compact mb-4">
      <div className="card-body">

        <Typography variant="h2">
          Solid Buttons
        </Typography>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Button
              className="flex-1"
              color="primary"
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
              Button
            </Button>
            <Button
              className="flex-1"
              color="primary"
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
            </Button>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              className="flex-1"
              color="primary"
              disabled
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
              Button
            </Button>
            <Button
              className="flex-1"
              color="primary"
              disabled
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
            </Button>
          </div>

        </div>

        <hr className="my-5" />

        <Typography variant="h2">
          Outline Buttons
        </Typography>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Button
              className="flex-1"
              // color="primary"
              variant="outline"
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
              Button
            </Button>
            <Button
              className="flex-1"
              // color="primary"
              variant="outline"
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
            </Button>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              className="flex-1"
              // color="primary"
              variant="outline"
              disabled
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
              Button
            </Button>
            <Button
              className="flex-1"
              // color="primary"
              variant="outline"
              disabled
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
            </Button>
          </div>

        </div>

        <hr className="my-5" />

        <Typography variant="h2">
          Ghost Buttons
        </Typography>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Button
              className="flex-1"
              color="ghost"
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
              Button
            </Button>
            <Button
              className="flex-1"
              color="ghost"
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
            </Button>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              className="flex-1"
              color="ghost"
              disabled
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
              Button
            </Button>
            <Button
              className="flex-1"
              color="ghost"
              disabled
            >
              <PlusIcon className="h-6 w-6 inline-block"/>
            </Button>
          </div>

        </div>


      </div>
    </Card>
  );
};

export default ButtonDemo;