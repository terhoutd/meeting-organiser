import { Dialog, Transition } from "@headlessui/react";
import { useEffect, Fragment } from "react";

interface MessageProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  autoFade: boolean;
}

export function Message({ isOpen, onClose, description, autoFade }: MessageProps) {
  const backgroundColor = autoFade ? "bg-green-700" : "bg-pink-400";
  const textColor = "text-white";

  useEffect(() => {
    if (autoFade && isOpen) {
      const fadeTimeout = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(fadeTimeout);
    }
  }, [isOpen, autoFade, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className={`fixed inset-x-0 top-10 flex items-center justify-center transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className={`relative rounded-lg p-8 shadow-md ${backgroundColor}`}>
          {!autoFade && (
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-700"
              onClick={handleClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <div className={`text-center ${textColor}`}>{description}</div>
        </div>
      </Dialog>
    </Transition>
  );
}
