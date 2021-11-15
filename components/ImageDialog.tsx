import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Previewable } from 'libs/contracts'
import { KeyDown, KEY_DOWN_EVENT } from 'libs/constants'

interface ImageDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
  submission: Previewable | null
  onNextClick: () => void
  onPreviousClick: () => void
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  open,
  setOpen,
  submission,
  onNextClick,
  onPreviousClick,
}) => {
  const nextButtonRef = useRef(null)

  const listenForNavigationKeys = useCallback((event: KeyboardEvent) => {
    if (event.key === KeyDown.ARROW_LEFT) onPreviousClick()
    if (event.key === KeyDown.ARROW_RIGHT) onNextClick()
  }, [submission])

  useEffect(() => {
    if (submission === null) {
      document.removeEventListener(KEY_DOWN_EVENT, listenForNavigationKeys)
    } else {
      document.addEventListener(KEY_DOWN_EVENT, listenForNavigationKeys)
      return () => document.removeEventListener(KEY_DOWN_EVENT, listenForNavigationKeys)
    }
  }, [submission])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={nextButtonRef} onClose={setOpen}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <input onKeyDown={(e) => console.log(e)}/>
              <div className="mt-3 text-center sm:text-left">
                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 ml-2">
                  {submission?.title}
                </Dialog.Title>
                <div className="mt-2">
                  <img src={submission?.imageUrl} alt="highlighted submission image" />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                <button
                  type="button"
                  className="w-24 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                  onClick={onPreviousClick}
                >
                  Previous
                </button>
                <div className="text-center">by<br/><span className="text-gray-700 font-bold">{submission?.author}</span></div>
                <button
                  type="button"
                  className="w-24 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                  onClick={onNextClick}
                  ref={nextButtonRef}
                >
                  Next
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ImageDialog