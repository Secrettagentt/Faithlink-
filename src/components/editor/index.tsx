import { Editor } from '@tinymce/tinymce-react';
import React from 'react';

interface TinyEditorProps {
  initialValue: string;
  onEditorChange: (content: string, editor: any) => void;
  id: string;
  [key: string]: any;
}

const TinyEditor: React.FC<TinyEditorProps> = ({ initialValue, onEditorChange, id, ...rest }) => {
  return (
    <Editor
      {...rest}
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      initialValue={initialValue || ''}
      onEditorChange={onEditorChange}
      id={id}
      init={{
        max_height: 300,
        menubar: false,
        plugins: [
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
        ],
        toolbar:
          'undo redo | styles | bold italic underline| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons',
      }}
    />
  );
};

export default TinyEditor;
