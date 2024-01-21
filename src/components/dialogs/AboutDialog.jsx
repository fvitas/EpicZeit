import { Button } from '@/components/ui/button.jsx'
import { Dialog, DialogContent } from '@/components/ui/dialog.jsx'

export function AboutDialog({ isOpen, onOpenChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[410px] max-h-[500px] overflow-hidden">
        <div className="text-center">
          <h3 className="text-center text-2xl font-semibold">Epic Zeit</h3>

          <p className="text-center text-sm text-gray-600">Free. Open-source.</p>
          <p className="text-center text-sm text-gray-600">No ads. No Server.</p>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Version</span>
              <span className="text-gray-900">1.2.3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Developed by</span>
              <a
                href="https://twitter.com/vitasdev"
                rel="noreferrer"
                target="_blank"
                className="text-gray-900 transition hover:opacity-75">
                Filip Vitas
              </a>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-700">License</span>
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                rel="noreferrer"
                target="_blank"
                className="text-gray-900 transition hover:opacity-75">
                GPL-3.0 License
              </a>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-700">Source code</span>
              <span className="text-gray-900">
                <a
                  href="https://github.com/fvitas/EpicZeit"
                  rel="noreferrer"
                  target="_blank"
                  className="transition hover:opacity-75">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
              </span>
            </div>
          </div>

          <p className="mt-4 text-start"></p>

          <div className="bg-gray-100 px-6 py-3 text-center text-sm">
            <p>© 2024 Filip Vitas</p>
          </div>

          <Button className="mt-4 w-full text-center" variant="default" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
