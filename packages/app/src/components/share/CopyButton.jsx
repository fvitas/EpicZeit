import { Button } from '@/components/ui/button.jsx'
import { cn } from '@/utils.js'
import copyToClipboard from 'clipboard-copy'
import { useState } from 'react'
import { Case, Switch } from 'react-if'

const COPY_STATE = {
  INITIAL: 'INITIAL',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

export function CopyButton({ value }) {
  const [copyState, setCopyState] = useState(COPY_STATE.INITIAL)

  async function onCopyClick(event) {
    event.preventDefault()

    try {
      await copyToClipboard(value)
      setCopyState(COPY_STATE.SUCCESS)
    } catch {
      setCopyState(COPY_STATE.ERROR)
    }

    setTimeout(() => setCopyState(COPY_STATE.INITIAL), 2_000)
  }

  return (
    <Button
      size="sm"
      className={cn(
        'min-w-[90px] px-3',
        copyState === COPY_STATE.SUCCESS ? 'bg-lime-500 hover:bg-lime-500/90' : '',
        copyState === COPY_STATE.ERROR ? 'bg-red-500 hover:bg-red-500/90' : '',
      )}
      disabled={!value}
      onClick={onCopyClick}>
      <Switch>
        <Case condition={copyState === COPY_STATE.INITIAL}>Copy link</Case>
        <Case condition={copyState === COPY_STATE.SUCCESS}>Copied</Case>
        <Case condition={copyState === COPY_STATE.ERROR}>Failed to copy</Case>
      </Switch>
    </Button>
  )
}
