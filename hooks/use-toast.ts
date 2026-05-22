'use client'

import * as React from 'react'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: 'default' | 'destructive'
}

let count = 0
function genId() { return (++count).toString() }

type ActionType =
  | { type: 'ADD_TOAST'; toast: Omit<ToasterToast, 'id'> & { id?: string } }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

interface State { toasts: ToasterToast[] }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [{ ...action.toast, id: action.toast.id ?? genId() }, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'UPDATE_TOAST':
      return { ...state, toasts: state.toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t) }
    case 'DISMISS_TOAST': {
      const { toastId } = action
      if (toastId) {
        if (!toastTimeouts.has(toastId)) {
          toastTimeouts.set(toastId, setTimeout(() => {
            toastTimeouts.delete(toastId)
            dispatch({ type: 'REMOVE_TOAST', toastId })
          }, TOAST_REMOVE_DELAY))
        }
      } else {
        state.toasts.forEach(toast => {
          if (!toastTimeouts.has(toast.id)) {
            toastTimeouts.set(toast.id, setTimeout(() => {
              toastTimeouts.delete(toast.id)
              dispatch({ type: 'REMOVE_TOAST', toastId: toast.id })
            }, TOAST_REMOVE_DELAY))
          }
        })
      }
      return { ...state, toasts: state.toasts.map(t => toastId === undefined || t.id === toastId ? { ...t, open: false } : t) }
    }
    case 'REMOVE_TOAST':
      return { ...state, toasts: action.toastId ? state.toasts.filter(t => t.id !== action.toastId) : [] }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => listener(memoryState))
}

type Toast = Omit<ToasterToast, 'id' | 'open' | 'onOpenChange'>

function toast(props: Toast) {
  const id = genId()
  const update = (p: Partial<ToasterToast>) => dispatch({ type: 'UPDATE_TOAST', toast: { ...p, id } })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })
  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props, id, open: true,
      onOpenChange: (open) => { if (!open) dismiss() },
    },
  })
  return { id, dismiss, update }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const idx = listeners.indexOf(setState)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])
  return { ...state, toast, dismiss: (id?: string) => dispatch({ type: 'DISMISS_TOAST', toastId: id }) }
}

export { useToast, toast }
