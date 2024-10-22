import { useState } from "react";
import moment from 'moment';

import {
  useCurrentTheme,
} from "../../store/Store";

import {
  BellIcon,
} from '@heroicons/react/24/outline';

import discordlogo from "../../assets/discordlogo.svg";
import telegramlogo from "../../assets/telegramlogo.svg";

import Button from "./Button";
import Modal from "./Modal";
import Typography from "./Typography";

const notifDate = '20240722';

const Notifications = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme } = useCurrentTheme();
  const isLight = currentTheme && currentTheme.includes('light');

  const notifRead = localStorage.getItem("notifRead");

  const now = moment();
  const daysSince = now.diff(notifDate, 'days');

  const handleOpen = () => {
    localStorage.setItem("notifRead", now);
    setIsOpen(true);
  };

  let hasUnread = false;

  if (daysSince < 14) {
    hasUnread = true;
  }

  if (moment(notifRead).isAfter(notifDate)) {
    hasUnread = false;
  }

  if (daysSince >= 14) {
    hasUnread = false;
  }

  return (
    <>
      <Button
        className="md:mr-2"
        color="ghost"
        onClick={() => handleOpen()}
      >
        <div className="relative">
          {hasUnread ? (
            <span class="absolute flex h-3 w-3 -top-1 -end-1">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
            </span>
          ) : null}
          <BellIcon className="w-6 h-6 inline-block"/>
        </div>
      </Button>
      <Modal
        open={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        {/* <div className="card-body"> */}
          <Typography variant="h2" className="card-title flex justify-between">
            <span>
              <BellIcon className="w-6 h-6 inline-block mr-2"/>
              Important Update: Smart Vaults
            </span>
            <span className="text-sm font-normal opacity-50">
              &nbsp; {moment(notifDate).format('DD/MMMM/YYYY') || ''}
            </span>
          </Typography>
          <div className="overflow-x-auto">
            <Typography variant="p" className="mb-2">
              Dear Users,
            </Typography>

            <Typography variant="p" className="mb-2">
              We are pausing the creation of new vaults until the V4 Vaults launch with yield generation (ETA: 1 month). You can still manage, pay back debt, and trade collateral in your existing vaults. Take advantage of the slight de-peg to settle debts at a discount!
            </Typography>

            <Typography variant="p" className="flex items-center mb-2">
              Join the Community & Connect with us for updates and support:
            </Typography>
            <div className="flex align-center">
              <Button
                size="sm"
                color="ghost"
                onClick={() => window.open('https://discord.gg/THWyBQ4RzQ', "_blank")}
              >
                <img
                  className={
                    isLight ? (
                      'h-4 w-4 inline-block invert'
                    ) : (
                      'h-4 w-4 inline-block'
                    )
                  }
                  src={discordlogo} alt={`Discord logo`}
                />
                Discord
              </Button>
              <Button
                size="sm"
                color="ghost"
                onClick={() => window.open('https://t.me/TheStandard_io', "_blank")}
              >
                <img
                  className={
                    isLight ? (
                      'h-4 w-4 inline-block'
                    ) : (
                      'h-4 w-4 inline-block invert'
                    )
                  }
                  src={telegramlogo} alt={`Telegram logo`}
                />
                Telegram
              </Button>
            </div>

          </div>
          <div className="card-actions flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-64"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
      </Modal>
    </>
  )
};

export default Notifications;