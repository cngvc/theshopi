import 'quill/dist/quill.snow.css';

import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import Quill, { type QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

type EditorValue = {
  body: string;
};

interface EditorProps {
  onSubmit: ({ body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
  variant?: 'create' | 'update';
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = 'create'
}: EditorProps) => {
  const [text, setText] = useState('');
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body });
              }
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              }
            }
          }
        }
      }
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className="flex flex-col w-full">
      <div
        className={cn(
          'flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white',
          disabled && 'opacity-50'
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />

        <div className="flex px-2 pb-2 z-[5]">
          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant="outline" size="sm" onClick={onCancel} disabled={disabled}>
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents())
                  });
                }}
                size="sm"
                className="bg-blue-500 hover:bg-blue-500/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents())
                });
              }}
              size="icon"
              className={cn(
                'ml-auto',
                isEmpty ? 'bg-white hover:bg-white text-muted-foreground' : 'bg-blue-500 hover:bg-blue-500/80 text-white'
              )}
            >
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div className={cn('p-2 text-sm text-muted-foreground flex justify-end opacity-0 transition', !isEmpty && 'opacity-100')}>
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
