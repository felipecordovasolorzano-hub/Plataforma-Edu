import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Package,
  Check,
  Share2,
  Sparkles,
  ShoppingBag,
  Info,
  Calendar,
  AlertCircle,
  Copy,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ParentMaterialsViewProps {
  onSelectTask: (task: Task) => void;
}

interface AiDetailedCategory {
  categoryName: string;
  storeType: string;
  items: {
    name: string;
    quantity: string;
    specs: string;
    course: string;
    dateNeeded: string;
    alternativeHome?: string;
  }[];
}

export const ParentMaterialsView: React.FC<ParentMaterialsViewProps> = ({ onSelectTask }) => {
  const {
    activeChildTasks,
    toggleMaterialAcquired,
    activeChild,
    sendWhatsAppAlert,
    setIsWhatsAppDrawerOpen,
    themeColor,
    showToast,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  const [filterMode, setFilterMode] = useState<'pending' | 'acquired' | 'all'>('pending');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiBreakdown, setShowAiBreakdown] = useState<boolean>(false);
  const [customItems, setCustomItems] = useState<{ id: string; name: string; course: string; acquired: boolean; dateNeeded: string }[]>([]);
  const [newItemName, setNewItemName] = useState<string>('');
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);

  // Gather all materials from active child tasks
  const allTaskItems: {
    materialId: string;
    name: string;
    acquired: boolean;
    requiredForDate: string;
    task: Task;
    isCustom?: boolean;
  }[] = [];

  activeChildTasks.forEach((task) => {
    if (task.materials && task.materials.length > 0) {
      task.materials.forEach((m) => {
        allTaskItems.push({
          materialId: m.id,
          name: m.name,
          acquired: m.acquired,
          requiredForDate: m.requiredForDate,
          task,
        });
      });
    }
  });

  // Custom added items
  customItems.forEach((ci) => {
    allTaskItems.push({
      materialId: ci.id,
      name: ci.name,
      acquired: ci.acquired,
      requiredForDate: ci.dateNeeded,
      task: {
        id: `custom-task-${ci.id}`,
        childId: activeChild.id,
        title: 'Anotación familiar en casa',
        course: ci.course,
        type: 'material',
        schoolDueDate: ci.dateNeeded,
        schoolDueTimestamp: '',
        status: 'pending',
        teacherName: activeChild.teacherName,
        instructions: 'Material complementario anotado en casa.',
        materials: [],
      },
      isCustom: true,
    });
  });

  const filteredItems = allTaskItems.filter((item) => {
    if (filterMode === 'pending') return !item.acquired;
    if (filterMode === 'acquired') return item.acquired;
    return true;
  });

  // Dynamic AI generated breakdown based on active child
  const getAiDetailedList = (): AiDetailedCategory[] => {
    if (activeChild.id === 'mateo') {
      return [
        {
          categoryName: '🎨 Papelería y Artes Plásticas',
          storeType: 'Librería escolar',
          items: [
            {
              name: 'Cartulina blanca escolar',
              quantity: '1 pliego estándar (70x100 cm)',
              specs: 'Gramaje 150g o duplex para que soporte pintura sin arquearse.',
              course: 'Ciencia y Tecnología',
              dateNeeded: 'Mañana viernes, 8:00 a. m.',
              alternativeHome: 'Si tienes papel bond grueso de 120g o cartón cartulina limpio, es válido.',
            },
            {
              name: 'Témpera lavable azul + pincel plano N.° 6',
              quantity: '1 pote (250 ml) o frasco individual',
              specs: 'No tóxica, con sello DIGESA. Pincel de cerda sintética suave.',
              course: 'Ciencia y Tecnología (Agregado recientemente)',
              dateNeeded: 'Mañana viernes, 8:00 a. m.',
              alternativeHome: 'Pintura dactilar o acrílico escolar base agua.',
            },
          ],
        },
        {
          categoryName: '📐 Útiles de Cartuchera y Medición',
          storeType: 'Librería / Casa',
          items: [
            {
              name: 'Regla graduada de 30 cm',
              quantity: '1 unidad',
              specs: 'Borde biselado milimetrado, acrílico transparente preferente para trazo de fracciones.',
              course: 'Matemática',
              dateNeeded: 'Mañana viernes',
              alternativeHome: 'Cualquier regla de 20 o 30 cm en buen estado.',
            },
            {
              name: 'Lápiz bicolor rojo/azul',
              quantity: '1 unidad',
              specs: 'Para subrayado de equivalencias y respuestas finales.',
              course: 'Matemática',
              dateNeeded: 'Mañana viernes',
            },
          ],
        },
      ];
    }

    return [
      {
        categoryName: '📚 Útiles Académicos de Secundaria',
        storeType: 'Librería técnica',
        items: [
          {
            name: 'Calculadora científica estándar',
            quantity: '1 unidad',
            specs: 'Modelo Casio fx-82MS o similar para sistemas 2x2.',
            course: 'Álgebra',
            dateNeeded: 'Lunes',
          },
          {
            name: 'Hojas bond A4 de 75g para ensayo',
            quantity: '1 paquete de 50 hojas',
            specs: 'Para borrador e impresión final del ensayo de Cultura Chavín en APA.',
            course: 'Historia y Geografía',
            dateNeeded: 'Viernes',
          },
        ],
      },
    ];
  };

  const aiCategories = getAiDetailedList();

  const handleGenerateAiList = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setShowAiBreakdown(true);
      showToast('Lista de compras detallada y categorizada con IA', 'success');
    }, 450);
  };

  const handleSendDetailedToWhatsApp = () => {
    let message = `🏫 *EduSense — Colegio San Agustín*\n_Lista Inteligente de Materiales con IA_\n`;
    message += `📋 *Estudiante:* ${activeChild.name} (${activeChild.grade})\n\n`;

    aiCategories.forEach((cat) => {
      message += `*${cat.categoryName}* (${cat.storeType}):\n`;
      cat.items.forEach((item) => {
        message += `• *${item.name}* [${item.quantity}]\n`;
        message += `  └ _Para:_ ${item.course} (${item.dateNeeded})\n`;
        if (item.specs) {
          message += `  └ _Detalle:_ ${item.specs}\n`;
        }
      });
      message += `\n`;
    });

    message += `💡 *Consejo de ahorro:* Lista generada para evitar compras duplicadas o materiales no permitidos.`;

    sendWhatsAppAlert('assignment_new', message);
    setIsWhatsAppDrawerOpen(true);
  };

  const handleAddCustomItem = () => {
    if (!newItemName.trim()) return;
    const item = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      course: 'Anotación familiar',
      acquired: false,
      dateNeeded: 'Próxima semana',
    };
    setCustomItems((prev) => [...prev, item]);
    setNewItemName('');
    setIsAddingItem(false);
    showToast(`Material "${item.name}" agregado a tu lista`, 'success');
  };

  const toggleCustomItem = (id: string) => {
    setCustomItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, acquired: !item.acquired } : item))
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>{activeChild.name}</span>
            <span>·</span>
            <span>{activeChild.grade} ({activeChild.section})</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5 tracking-tight">
            Materiales y Útiles Escolares
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Consolidación automática y estructurada con IA para optimizar compras y evitar gastos dobles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* AI Generator CTA */}
          <button
            onClick={handleGenerateAiList}
            disabled={isAiLoading}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-2xl transition-all shadow-xs ${
              showAiBreakdown
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : `${theme.primaryBg} ${theme.primaryHover} text-white`
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiLoading ? 'Analizando con IA...' : 'Armar lista detallada con IA'}</span>
          </button>

          <button
            onClick={handleSendDetailedToWhatsApp}
            className="flex items-center gap-2 py-2.5 px-4 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition-all shadow-2xs"
            title="Enviar lista estructurada a WhatsApp"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Compartir WhatsApp</span>
          </button>
        </div>
      </div>

      {/* AI Detailed Breakdown Panel */}
      {showAiBreakdown && (
        <div className="p-6 bg-white border border-blue-200/90 rounded-3xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl ${theme.lightBg} ${theme.primaryText} flex items-center justify-center`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Lista Detallada y Agrupada por IA para {activeChild.name.split(' ')[0]}
                </h2>
                <p className="text-xs text-slate-500">
                  Generada a partir de las tareas de la semana · Incluye marcas seguras, gramajes y alternativas del hogar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendDetailedToWhatsApp}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Enviar a WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowAiBreakdown(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Ocultar
              </button>
            </div>
          </div>

          {/* AI Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{cat.categoryName}</span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {cat.storeType}
                  </span>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-3 bg-white rounded-xl border border-slate-200/90 space-y-1.5 text-xs shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <span className={`text-[11px] font-bold ${theme.primaryText} ${theme.lightBg} px-2 py-0.5 rounded-md border ${theme.lightBorder}`}>
                          {item.quantity}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span><strong>Curso:</strong> {item.course}</span>
                        <span>·</span>
                        <span><strong>Requerido:</strong> {item.dateNeeded}</span>
                      </div>

                      {item.specs && (
                        <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                          <strong className="text-slate-900">Especificación:</strong> {item.specs}
                        </div>
                      )}

                      {item.alternativeHome && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Alternativa en casa:</strong> {item.alternativeHome}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>💡 Las especificaciones técnicas evitan compras innecesarias de útiles que ya se tienen en casa.</span>
            <button
              onClick={handleGenerateAiList}
              className={`font-bold ${theme.primaryText} hover:underline flex items-center gap-1`}
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerar con IA</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Checklist Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMode === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por conseguir ({allTaskItems.filter((i) => !i.acquired).length})
            </button>
            <button
              onClick={() => setFilterMode('acquired')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMode === 'acquired'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              En la mochila ({allTaskItems.filter((i) => i.acquired).length})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({allTaskItems.length})
            </button>
          </div>

          {/* Quick Add Custom Material */}
          {!isAddingItem ? (
            <button
              onClick={() => setIsAddingItem(true)}
              className={`flex items-center gap-1.5 text-xs font-bold ${theme.primaryText} hover:underline`}
            >
              <Plus className="w-4 h-4" />
              <span>Anotar útil o material adicional</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Ej. Borrador de repuesto..."
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
                autoFocus
              />
              <button
                onClick={handleAddCustomItem}
                className={`py-1.5 px-3 text-xs font-bold text-white rounded-xl ${theme.primaryBg} ${theme.primaryHover}`}
              >
                Agregar
              </button>
              <button
                onClick={() => setIsAddingItem(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 border border-slate-200/80 rounded-3xl">
              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                {filterMode === 'pending'
                  ? '¡Excelente! No hay materiales pendientes por comprar.'
                  : 'No hay materiales en esta categoría.'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                La mochila de {activeChild.name.split(' ')[0]} tiene todo lo necesario para sus clases.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={`${item.task.id}-${item.materialId}`}
                onClick={() => {
                  if (item.isCustom) {
                    toggleCustomItem(item.materialId);
                  } else {
                    toggleMaterialAcquired(item.task.id, item.materialId);
                  }
                }}
                className={`flex items-start justify-between p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  item.acquired
                    ? 'bg-slate-50 border-slate-200/80 opacity-75'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      item.acquired
                        ? `${theme.primaryBg} border-transparent text-white`
                        : 'border-slate-300 bg-white hover:border-blue-600'
                    }`}
                  >
                    {item.acquired && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <h3
                      className={`text-xs font-bold ${
                        item.acquired ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {item.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-semibold text-slate-700">{item.task.course}</span>
                      <span>·</span>
                      <span>Para: {item.requiredForDate}</span>
                      {item.name.includes('Agregado recientemente') && (
                        <>
                          <span>·</span>
                          <span className="font-bold text-amber-600">⚠️ Actualizado por docente</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!item.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTask(item.task);
                    }}
                    className={`text-xs font-bold ${theme.primaryText} hover:underline shrink-0 ml-3`}
                  >
                    Ver tarea →
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
