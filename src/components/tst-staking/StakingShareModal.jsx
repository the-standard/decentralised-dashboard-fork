import { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';

import {
  useLocalThemeModeStore,
} from "../../store/Store";

import {
  DocumentDuplicateIcon,
} from '@heroicons/react/24/solid';

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";

import twitterLogo from "../../assets/twitterlogo.svg";
import facebookLogo from "../../assets/facebooklogo.svg";
import linkedinLogo from "../../assets/linkedinlogo.svg";

const StakingShareModal = ({
  isOpen,
  handleCloseModal,
  shareText,
}) => {
  const { localThemeModeStore } = useLocalThemeModeStore();
  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  const handleCopyText = () => {
    const textElement = shareText;

    if (navigator.clipboard && textElement) {
      const text = textElement;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success('Copied to clipboard!');
        })
        .catch((error) => {
          toast.error('There was a problem');
        });
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        closeModal={() => {
          handleCloseModal();
        }}
      >
        <div>
          <Typography variant="h2" className="card-title">
            Share Your Success
          </Typography>
          <pre className="bg-base-300/40 mt-4 mb-3 p-4 rounded-lg w-full">
            {shareText.toString()}
          </pre>
        </div>

        <div className="flex gap-4 mb-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`)}
          >
            <img
              className={
                isLight ? (
                  'h-4 w-4 inline-block invert'
                ) : (
                  'h-4 w-4 inline-block'
                )
              }
              src={twitterLogo}
              alt={`Twitter Share`}
            />
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https://thestandard.io&quote=${encodeURIComponent(shareText)}`)}
          >
            <img
              className={
                isLight ? (
                  'h-4 w-4 inline-block invert'
                ) : (
                  'h-4 w-4 inline-block'
                )
              }
              src={facebookLogo}
              alt={`Facebook Share`}
            />
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://thestandard.io')}`)}
          >
            <img
              className={
                isLight ? (
                  'h-4 w-4 inline-block invert'
                ) : (
                  'h-4 w-4 inline-block'
                )
              }
              src={linkedinLogo}
              alt={`Linkedin Share`}
            />
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleCopyText()}
          >
            <DocumentDuplicateIcon
              className="h-4 w-4 inline-block"
            />
          </Button>

        </div>

        <div className="card-actions flex flex-row justify-end">
          <Button
            color="ghost"
            onClick={() => {
              handleCloseModal();
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )

};

export default StakingShareModal;
