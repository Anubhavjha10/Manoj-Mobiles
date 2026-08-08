import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export const PremiumRichTextEditor = ({ value, onChange, placeholder = "Enter description here..." }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link'
  ];

  return (
    <div className="premium-rte-container">
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style>{`
        .premium-rte-container .quill {
          background-color: #F8FAFC;
          border-radius: 8px;
          overflow: hidden;
        }
        .premium-rte-container .ql-toolbar.ql-snow {
          border: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background-color: #F1F5F9;
          padding: 8px;
        }
        .premium-rte-container .ql-container.ql-snow {
          border: 1px solid #E2E8F0;
          border-top: none;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          background-color: #FFFFFF;
          min-height: 150px;
          font-family: inherit;
          font-size: 0.95rem;
        }
        .premium-rte-container .ql-editor {
          min-height: 150px;
          color: #334155;
        }
        .premium-rte-container .ql-editor.ql-blank::before {
          color: #94A3B8;
          font-style: normal;
        }
        .premium-rte-container .ql-editor:focus {
          outline: none;
        }
        .premium-rte-container:focus-within .ql-container.ql-snow,
        .premium-rte-container:focus-within .ql-toolbar.ql-snow {
          border-color: #3B82F6;
        }
        
        /* Dark Theme Support */
        .dark-admin .premium-rte-container .quill {
          background-color: #0F172A;
        }
        .dark-admin .premium-rte-container .ql-toolbar.ql-snow {
          background-color: #1E293B;
          border-color: #334155;
        }
        .dark-admin .premium-rte-container .ql-container.ql-snow {
          background-color: #0F172A;
          border-color: #334155;
        }
        .dark-admin .premium-rte-container .ql-editor {
          color: #F8FAFC;
        }
        .dark-admin .premium-rte-container .ql-editor.ql-blank::before {
          color: #64748B;
        }
        .dark-admin .premium-rte-container .ql-snow .ql-stroke {
          stroke: #94A3B8;
        }
        .dark-admin .premium-rte-container .ql-snow .ql-fill {
          fill: #94A3B8;
        }
        .dark-admin .premium-rte-container .ql-snow .ql-picker {
          color: #94A3B8;
        }
      `}</style>
    </div>
  );
};
