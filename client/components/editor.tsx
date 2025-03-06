'use client';

import 'quill/dist/quill.snow.css';

import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import Quill, { type QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import { RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';

type EditorValue = {
  content: string;
};

interface EditorProps {
  onSubmit: (body: EditorValue) => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
  variant?: 'create' | 'update';
}

const Editor = ({
  onSubmit,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = 'create'
}: EditorProps) => {
  const [text, $text] = useState('');
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
        toolbar: false,
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill
                  .getText()
                  .replace(/<(.|\n)*?>/g, '')
                  .trim();
                if (!text.length) return;
                submitRef.current?.({ content: text });
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
    $text(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      $text(quill.getText());
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

  const isEmpty = useMemo(() => {
    return text.replace(/<(.|\n)*?>/g, '').trim().length === 0;
  }, [text]);

  return (
    <div className="flex flex-col w-full">
      <div
        className={cn(
          'flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white',
          disabled && 'opacity-50'
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-10">
          {variant === 'create' && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  content: text
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
