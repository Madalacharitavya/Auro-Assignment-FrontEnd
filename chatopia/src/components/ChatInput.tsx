
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile, Bold, Italic, Link, List, Mic } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSendVoice?: (audioBlob: Blob) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSending: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onSendVoice,
  onKeyDown,
  isSending,
}) => {
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current && !showVoiceRecorder) {
      inputRef.current.focus();
    }
  }, [showVoiceRecorder]);

  const handleFormatText = (format: 'bold' | 'italic' | 'link' | 'list') => {
    let newText = value;
    const selection = window.getSelection();
    
    if (selection && selection.toString()) {
      const selectedText = selection.toString();
      
      switch (format) {
        case 'bold':
          newText = value.replace(selectedText, `**${selectedText}**`);
          break;
        case 'italic':
          newText = value.replace(selectedText, `*${selectedText}*`);
          break;
        case 'link':
          newText = value.replace(selectedText, `[${selectedText}](url)`);
          break;
        case 'list':
          newText = value.replace(selectedText, `\n- ${selectedText}`);
          break;
        default:
          break;
      }
      
      onChange(newText);
    } else {
      switch (format) {
        case 'bold':
          onChange(`${value}**bold text**`);
          break;
        case 'italic':
          onChange(`${value}*italic text*`);
          break;
        case 'link':
          onChange(`${value}[link text](url)`);
          break;
        case 'list':
          onChange(`${value}\n- list item`);
          break;
        default:
          break;
      }
    }
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText;
    onChange(content);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleVoiceRecordingComplete = (audioBlob: Blob) => {
    if (onSendVoice) {
      onSendVoice(audioBlob);
    }
    setShowVoiceRecorder(false);
  };

  return (
    <div className="px-4 pb-4">
      <div className="max-w-2xl mx-auto">
        {showVoiceRecorder ? (
          <VoiceRecorder 
            onRecordingComplete={handleVoiceRecordingComplete}
            onCancel={() => setShowVoiceRecorder(false)}
          />
        ) : (
          <div className="glass rounded-xl p-2">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormatText('bold')}
                type="button"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormatText('italic')}
                type="button"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormatText('link')}
                type="button"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormatText('list')}
                type="button"
              >
                <List className="h-4 w-4" />
              </Button>
              <div className="text-xs text-muted-foreground ml-auto">
                Press Shift + Enter for new line
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <div
                ref={inputRef}
                contentEditable="true"
                className="message-input flex-1 p-2 rounded-lg outline-none border border-input focus:ring-1 focus:ring-primary"
                onInput={handleContentChange}
                onKeyDown={onKeyDown}
                onPaste={handlePaste}
                dangerouslySetInnerHTML={{ __html: value }}
              />
              
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 flex-shrink-0"
                type="button"
              >
                <Smile className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 flex-shrink-0"
                onClick={() => setShowVoiceRecorder(true)}
                type="button"
              >
                <Mic className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={onSend}
                className="h-10 w-10 rounded-full flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!value.trim() || isSending}
                type="button"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-xs text-center text-muted-foreground mt-2">
          {showVoiceRecorder ? 'Record a voice message' : 'Type /help for available commands'}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
