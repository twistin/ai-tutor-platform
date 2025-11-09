import React, { useState, useEffect } from 'react';
import { 
  FolderIcon, 
  PlusIcon, 
  TrashIcon, 
  DownloadIcon, 
  SearchIcon,
  FileTextIcon,
  ImageIcon,
  CodeIcon,
  LinkIcon,
  VideoIcon,
  LibraryIcon,
  CalendarIcon,
  ExternalLinkIcon
} from './icons';

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'image' | 'code' | 'link' | 'video';
  category: string;
  url: string;
  size?: string;
  uploadDate: string;
  lessonIds: number[];
  description: string;
  tags: string[];
}

const ContentLibrary: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image' | 'code' | 'link' | 'video'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: '',
    type: 'pdf',
    category: 'general',
    description: '',
    tags: []
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/resources');
      const data = await response.json();
      if (data.success) {
        setResources(data.resources);
      }
    } catch (error) {
      console.error('Error al cargar recursos:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', newResource.title || file.name);
    formData.append('type', newResource.type || 'pdf');
    formData.append('category', newResource.category || 'general');
    formData.append('description', newResource.description || '');

    try {
      const response = await fetch('http://localhost:8080/api/resources/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setResources([...resources, data.resource]);
        setShowUploadModal(false);
        setNewResource({
          title: '',
          type: 'pdf',
          category: 'general',
          description: '',
          tags: []
        });
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este recurso?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/resources/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setResources(resources.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      pdf: FileTextIcon,
      image: ImageIcon,
      code: CodeIcon,
      link: LinkIcon,
      video: VideoIcon
    };
    const Icon = icons[type] || FolderIcon;
    return <Icon className="w-5 h-5" strokeWidth={1.5} />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-500/20 text-red-400 border-red-500/30',
      image: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      code: 'bg-green-500/20 text-green-400 border-green-500/30',
      link: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      video: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <LibraryIcon className="w-7 h-7 text-purple-400" strokeWidth={1.5} />
              Biblioteca de Contenidos
            </h2>
            <p className="text-gray-400">Administra todos tus recursos y materiales educativos</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Subir Recurso
          </button>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[250px] relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'pdf', 'image', 'code', 'link', 'video'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {getTypeIcon(type)} {type === 'all' ? 'Todos' : type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold">{resources.length}</p>
        </div>
        {['pdf', 'image', 'code', 'video'].map(type => (
          <div key={type} className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">{getTypeIcon(type)} {type.toUpperCase()}</p>
            <p className="text-2xl font-bold">
              {resources.filter(r => r.type === type).length}
            </p>
          </div>
        ))}
      </div>

      {/* Grid de recursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(resource => (
          <div key={resource.id} className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-colors">
            {/* Header del recurso */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{getTypeIcon(resource.type)}</span>
                <div>
                  <h3 className="font-bold text-lg">{resource.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(resource.type)}`}>
                    {resource.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {resource.description || 'Sin descripción'}
            </p>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {resource.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-gray-500 mb-3 space-y-1">
              <p className="flex items-center gap-1">
                <FolderIcon className="w-3 h-3" strokeWidth={1.5} />
                Categoría: {resource.category}
              </p>
              {resource.size && (
                <p className="flex items-center gap-1">
                  <FileTextIcon className="w-3 h-3" strokeWidth={1.5} />
                  Tamaño: {resource.size}
                </p>
              )}
              <p className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" strokeWidth={1.5} />
                Subido: {new Date(resource.uploadDate).toLocaleDateString('es-ES')}
              </p>
              {resource.lessonIds.length > 0 && (
                <p className="flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" strokeWidth={1.5} />
                  Usado en {resource.lessonIds.length} lección(es)
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center justify-center gap-1 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Ver/Descargar
              </a>
              <button
                onClick={() => handleDeleteResource(resource.id)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-xl">
          <FolderIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg mb-2">No se encontraron recursos</p>
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'Intenta con otro término de búsqueda' : 'Sube tu primer recurso para comenzar'}
          </p>
        </div>
      )}

      {/* Modal de subir archivo */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">📤 Subir Nuevo Recurso</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Nombre del recurso"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({...newResource, type: e.target.value as any})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="image">Imagen</option>
                  <option value="code">Código</option>
                  <option value="link">Enlace</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <input
                  type="text"
                  value={newResource.category}
                  onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="general, ejercicios, teoría..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Describe el recurso..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Archivo</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>

            {isUploading && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-400 mt-2">Subiendo archivo...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
