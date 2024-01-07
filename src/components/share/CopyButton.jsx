import { Button } from '@/components/ui/button.jsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx'
import { cn } from '@/utils.js'
import { IconCheck, IconCopy, IconX } from '@tabler/icons-react'
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            className={cn(
              'px-3',
              copyState === COPY_STATE.SUCCESS ? 'bg-lime-500 hover:bg-lime-500/90' : '',
              copyState === COPY_STATE.ERROR ? 'bg-red-500 hover:bg-red-500/90' : '',
            )}
            disabled={!value}
            onClick={onCopyClick}>
            <span className="sr-only">Copy</span>

            <Switch>
              <Case condition={copyState === COPY_STATE.INITIAL}>
                <IconCopy size={20} stroke={1.5} />
              </Case>
              <Case condition={copyState === COPY_STATE.SUCCESS}>
                <IconCheck size={20} stroke={1.5} />
              </Case>
              <Case condition={copyState === COPY_STATE.ERROR}>
                <IconX size={20} stroke={1.5} />
              </Case>
            </Switch>
          </Button>
        </TooltipTrigger>

        <TooltipContent onPointerDownOutside={event => event.preventDefault()}>
          <Switch>
            <Case condition={copyState === COPY_STATE.INITIAL}>Copy</Case>
            <Case condition={copyState === COPY_STATE.SUCCESS}>Copied</Case>
            <Case condition={copyState === COPY_STATE.ERROR}>Failed to copy</Case>
          </Switch>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
