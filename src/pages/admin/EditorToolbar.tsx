import type { Editor } from '@tiptap/react';

type ToolbarProps = {
  editor: Editor | null;
  onUploadImage: (file: File) => void;
};

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`min-w-9 h-9 px-2 grid place-items-center rounded-lg border text-sm font-medium ${
        active ? 'bg-orbix-violet border-orbix-violet text-bone' : 'border-white/10 text-slate hover:text-bone hover:border-white/25'
      }`}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor, onUploadImage }: ToolbarProps) {
  if (!editor) return null;

  function insertImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files?.[0]) onUploadImage(input.files[0]);
    };
    input.click();
  }

  function insertLink() {
    const url = window.prompt('URL del link:');
    if (!url) return;
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  function insertYoutube() {
    const url = window.prompt('URL de YouTube:');
    if (!url) return;
    editor!.commands.setYoutubeVideo({ src: url });
  }

  function insertTable() {
    editor!.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-white/10 border-b-0 rounded-t-xl bg-white/[0.03]">
      <ToolbarButton label="Título de sección (H2)" active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
      <ToolbarButton label="Subtítulo (H3)" active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
      <ToolbarButton label="Negrita" active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolbarButton>
      <ToolbarButton label="Cursiva" active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolbarButton>
      <ToolbarButton label="Lista con viñetas" active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>• Lista</ToolbarButton>
      <ToolbarButton label="Lista numerada" active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Lista</ToolbarButton>
      <ToolbarButton label="Cita destacada" active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}>“ ”</ToolbarButton>
      <ToolbarButton label="Código en línea" active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}>{'</>'}</ToolbarButton>
      <ToolbarButton label="Bloque de código" active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{'{ }'}</ToolbarButton>
      <ToolbarButton label="Insertar link" onClick={insertLink}>🔗</ToolbarButton>
      <ToolbarButton label="Insertar imagen" onClick={insertImage}>🖼</ToolbarButton>
      <ToolbarButton label="Insertar tabla" onClick={insertTable}>▦</ToolbarButton>
      <ToolbarButton label="Insertar video de YouTube" onClick={insertYoutube}>▶</ToolbarButton>
      <ToolbarButton label="Línea divisoria" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</ToolbarButton>
      <ToolbarButton label="Deshacer" onClick={() => editor.chain().focus().undo().run()}>↺</ToolbarButton>
      <ToolbarButton label="Rehacer" onClick={() => editor.chain().focus().redo().run()}>↻</ToolbarButton>
    </div>
  );
}
