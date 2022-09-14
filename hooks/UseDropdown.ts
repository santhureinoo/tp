import React, { useCallback, useState, useRef } from 'react'
import { useDocumentEvent } from './UseDocumentEvent'

/**
 * Functions which performs a click outside event listener
 * @param {*} initialState initialState of the dropdown
 * @param {*} onAfterClose some extra function call to do after closing dropdown
 */
export const useDropdown = (initialState = false, onAfterClose: () => void): [React.MutableRefObject<any>, boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
    const ref = useRef<any>(null)
    const [isOpen, setIsOpen] = useState(initialState)

    const handleClickOutside = useCallback(
        (event) => {
            if (ref.current && ref.current.contains(event.target)) {
                return
            }
            setIsOpen(false)
            onAfterClose && onAfterClose()
        },
        [ref, onAfterClose]
    )

    const handleHideDropdown = useCallback(
        (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
                onAfterClose && onAfterClose()
            }
        },
        [onAfterClose]
    )

    useDocumentEvent([
        { type: 'click', callback: handleClickOutside },
        { type: 'keydown', callback: handleHideDropdown },
    ])

    return [ref, isOpen, setIsOpen]
}