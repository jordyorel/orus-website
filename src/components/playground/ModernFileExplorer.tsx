import React, { useState } from 'react';
import { 
  FileText, 
  FolderOpen, 
  Folder, 
  Plus, 
  MoreHorizontal, 
  ChevronRight, 
  ChevronDown,
  File,
  Settings,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  isOpen?: boolean;
}

interface ModernFileExplorerProps {
  currentFile?: string;
  onFileSelect: (fileName: string) => void;
  onNewFile: () => void;
  onNewFolder: () => void;
}

const ModernFileExplorer = ({ currentFile, onFileSelect, onNewFile, onNewFolder }: ModernFileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['project']));
  
  const [fileTree] = useState<FileItem[]>([
    {
      id: 'project',
      name: 'My Project',
      type: 'folder',
      children: [
        { id: 'main', name: 'main.orus', type: 'file' },
        { id: 'utils', name: 'utils.orus', type: 'file' },
        {
          id: 'examples',
          name: 'examples',
          type: 'folder',
          children: [
            { id: 'hello', name: 'hello.orus', type: 'file' },
            { id: 'variables', name: 'variables.orus', type: 'file' },
          ]
        }
      ]
    }
  ]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.orus')) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    return <File className="w-4 h-4 text-slate-500" />;
  };

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
            item.type === 'file' && currentFile === item.name 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
              : ''
          }`}
          style={{ marginLeft: `${depth * 12}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              onFileSelect(item.name);
            }
          }}
        >
          {item.type === 'folder' && (
            <div className="w-4 h-4 flex items-center justify-center">
              {expandedFolders.has(item.id) ? (
                <ChevronDown className="w-3 h-3 text-slate-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-500" />
              )}
            </div>
          )}
          
          <div className="w-4 h-4 flex items-center justify-center">
            {item.type === 'folder' ? (
              expandedFolders.has(item.id) ? (
                <FolderOpen className="w-4 h-4 text-yellow-500" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-500" />
              )
            ) : (
              getFileIcon(item.name)
            )}
          </div>
          
          <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">
            {item.name}
          </span>
          
          {item.type === 'folder' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                // Handle folder actions
              }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {item.type === 'folder' && item.children && expandedFolders.has(item.id) && (
          <div>
            {renderFileTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Files</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewFile}
            className="h-6 w-6 p-0"
            title="New File"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewFolder}
            className="h-6 w-6 p-0"
            title="New Folder"
          >
            <Folder className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            title="More Options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-0.5">
          {renderFileTree(fileTree)}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start h-8">
          <Download className="w-4 h-4 mr-2" />
          Download Project
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start h-8">
          <Settings className="w-4 h-4 mr-2" />
          Project Settings
        </Button>
      </div>
    </div>
  );
};

export default ModernFileExplorer;