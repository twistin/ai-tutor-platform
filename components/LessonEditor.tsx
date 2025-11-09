import React, { useState, useRef } from 'react';
import { XIcon, PlusIcon, ImageIcon, LinkIcon, CodeIcon, VideoIcon, TrashIcon } from './icons';

interface LessonEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: LessonData) => void;
  initialData?: LessonData;
  mode: 'create' | 'edit';
  moduleTitle?: string;
}

export interface LessonData {
  title: string;
  content: ContentBlock[];
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'code' | 'image' | 'video' | 'link';
  content: string;
  language?: string; // Para bloques de código
  alt?: string; // Para imágenes
  caption?: string; // Para imágenes/videos
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
  moduleTitle
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    initialData?.content || [
      { id: '1', type: 'text', content: '' }
    ]
  );
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: '',
      ...(type === 'code' && { language: 'python' })
    };
    setContentBlocks([...contentBlocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(contentBlocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (contentBlocks.length === 1) {
      alert('Debe haber al menos un bloque de contenido');
      return;
    }
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = contentBlocks.findIndex(block => block.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === contentBlocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  const handleImageUpload = (blockId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // En producción, aquí subirías a un servidor o cloud storage
    // Por ahora, usamos Data URL para preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBlock(blockId, { content: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const emptyBlocks = contentBlocks.filter(block => !block.content.trim());
    if (emptyBlocks.length > 0) {
      const confirm = window.confirm(
        `Hay ${emptyBlocks.length} bloque(s) vacío(s). ¿Desea continuar?`
      );
      if (!confirm) return;
    }

    onSave({
      title,
      content: contentBlocks.filter(block => block.content.trim())
    });
  };

  const getBlockIcon = (type: ContentBlock['type']) => {
    switch (type) {
      case 'text': return '📝';
      case 'code': return '💻';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'link': return '🔗';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'edit' ? '✏️ Editar Lección' : '➕ Nueva Lección'}
            </h2>
            {moduleTitle && (
              <p className="text-sm text-gray-400 mt-1">Módulo: {moduleTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Título de la Lección */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📌 Título de la Lección *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white text-lg rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Ej: Introducción a Librosa para análisis de audio"
              required
            />
          </div>

          {/* Barra de herramientas */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-3">➕ Agregar bloque de contenido:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addBlock('text')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                📝 Texto
              </button>
              <button
                onClick={() => addBlock('code')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <CodeIcon className="w-4 h-4" />
                Código
              </button>
              <button
                onClick={() => addBlock('image')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Imagen
              </button>
              <button
                onClick={() => addBlock('video')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <VideoIcon className="w-4 h-4" />
                Video
              </button>
              <button
                onClick={() => addBlock('link')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                Enlace
              </button>
            </div>
          </div>

          {/* Bloques de contenido */}
          <div className="space-y-4">
            {contentBlocks.map((block, index) => (
              <div
                key={block.id}
                className={`bg-gray-800 rounded-lg p-4 border-2 transition-all ${
                  activeBlockId === block.id
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'border-gray-700'
                }`}
                onClick={() => setActiveBlockId(block.id)}
              >
                {/* Header del bloque */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getBlockIcon(block.type)}</span>
                    <span className="text-sm font-medium text-gray-400 capitalize">
                      {block.type === 'text' && 'Texto'}
                      {block.type === 'code' && 'Código'}
                      {block.type === 'image' && 'Imagen'}
                      {block.type === 'video' && 'Video'}
                      {block.type === 'link' && 'Enlace'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Bloque {index + 1} de {contentBlocks.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Mover arriba */}
                    {index > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(block.id, 'up');
                        }}
                        className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                        title="Mover arriba"
                      >
                        ⬆️
                      </button>
                    )}
                    
                    {/* Mover abajo */}
                    {index < contentBlocks.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(block.id, 'down');
                        }}
                        className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                        title="Mover abajo"
                      >
                        ⬇️
                      </button>
                    )}
                    
                    {/* Eliminar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlock(block.id);
                      }}
                      className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white"
                      title="Eliminar bloque"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contenido del bloque */}
                {block.type === 'text' && (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 resize-y min-h-[120px]"
                    placeholder="Escribe el contenido del texto aquí. Puedes usar Markdown para formato (negrita, cursiva, listas, etc.)"
                  />
                )}

                {block.type === 'code' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={block.language || 'python'}
                        onChange={(e) => updateBlock(block.id, { language: e.target.value })}
                        className="px-3 py-2 bg-gray-900 text-white text-sm rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                      >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="sql">SQL</option>
                      </select>
                      <span className="text-xs text-gray-500 self-center">
                        Lenguaje del código
                      </span>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 text-green-400 font-mono text-sm rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 resize-y min-h-[150px]"
                      placeholder="Escribe tu código aquí..."
                    />
                  </div>
                )}

                {block.type === 'image' && (
                  <div className="space-y-3">
                    {block.content ? (
                      <div className="relative">
                        <img
                          src={block.content}
                          alt={block.alt || 'Imagen de la lección'}
                          className="w-full rounded-lg max-h-96 object-contain bg-gray-900"
                        />
                        <button
                          onClick={() => updateBlock(block.id, { content: '' })}
                          className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(block.id, e)}
                          className="hidden"
                          id={`image-upload-${block.id}`}
                        />
                        <label
                          htmlFor={`image-upload-${block.id}`}
                          className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                          <span className="text-gray-400">Click para subir imagen</span>
                          <span className="text-xs text-gray-500 mt-1">o pega una URL abajo</span>
                        </label>
                      </div>
                    )}
                    
                    <input
                      type="text"
                      value={block.content.startsWith('data:') ? '' : block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 text-white text-sm rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                      placeholder="O pega la URL de la imagen aquí"
                    />
                    
                    <input
                      type="text"
                      value={block.caption || ''}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 text-white text-sm rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                      placeholder="Pie de imagen (opcional)"
                    />
                  </div>
                )}

                {block.type === 'video' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                      placeholder="URL del video (YouTube, Vimeo, etc.)"
                    />
                    <input
                      type="text"
                      value={block.caption || ''}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 text-white text-sm rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                      placeholder="Descripción del video (opcional)"
                    />
                    {block.content && (
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                        <VideoIcon className="w-16 h-16 text-gray-600" />
                        <p className="text-gray-500 ml-3">Preview del video</p>
                      </div>
                    )}
                  </div>
                )}

                {block.type === 'link' && (
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                      placeholder="https://ejemplo.com/recurso"
                    />
                    <input
                      type="text"
                      value={block.caption || ''}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 text-white text-sm rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                      placeholder="Texto del enlace (opcional)"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {contentBlocks.length} bloque(s) de contenido
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              {mode === 'edit' ? '💾 Guardar Cambios' : '➕ Crear Lección'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
