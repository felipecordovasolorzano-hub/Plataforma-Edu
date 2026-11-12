import React, { useState } from 'react';
import { BellRing, ChevronRight, Lamp, Link2, Lock, MessageCircle, Plus, RefreshCcw, ShieldCheck, Trash2, Video, Users } from 'lucide-react';
import { useEdu } from '../store';
import { Avatar, Card, EduDevice, SectionTitle, Sheet, Toggle, RING_LABEL } from '../ui';
import { CHILDREN, fmtTime24 } from '../data';

const Row: React.FC<{ icon: React.ElementType; title: string; sub?: string; right?: React.ReactNode; onClick?: () => void }> = ({ icon: I, title, sub, right, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? 'cursor-pointer' : ''}`}>
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-edu-soft text-edu"><I className="h-4.5 w-4.5" /></span>
    <div className="min-w-0 flex-1"><p className="text-[14px] font-bold text-slate-900">{title}</p>{sub && <p className="text-[12px] text-slate-500">{sub}</p>}</div>
    {right ?? (onClick && <ChevronRight className="h-4 w-4 text-slate-400" />)}
  </div>
);

export const More: React.FC = () => {
  const { setOverlay, connections, settings, setSettings, restartOnboarding, resetDemo, session, workshops } = useEdu();
  const conn = connections.filter(c => c.connected).length;
  return (
    <div className="pb-6">
      <h1 className="px-1 text-[24px] font-black text-slate-900">Más</h1>
      <SectionTitle>Familia</SectionTitle>
      <Card className="divide-y divide-slate-100">
        {CHILDREN.map(c => <div key={c.id} className="flex items-center gap-3 px-4 py-3"><Avatar name={c.name} color={c.color} /><div className="flex-1"><p className="text-[14px] font-bold">{c.fullName}</p><p className="text-[12px] text-slate-500">{c.grade} · {c.school}</p></div>{c.hasDevice && <span className="rounded-full bg-edu-soft px-2 py-0.5 text-[11px] font-bold text-edu">con EDU</span>}</div>)}
        <Row icon={Users} title="Otro apoderado" sub="Jorge (papá) recibe el resumen diario" />
      </Card>

      <SectionTitle>Lo que EDU lee</SectionTitle>
      <Card className="divide-y divide-slate-100">
        <Row icon={Link2} title="Conexiones" sub={`${conn} conectadas · SieWeb, Classroom y talleres`} onClick={() => setOverlay({ kind: 'connections' })} />
        <Row icon={Plus} title="Talleres y academias" sub={`${workshops.length} registrados · aviso 30 min antes`} onClick={() => setOverlay({ kind: 'workshops' })} />
      </Card>

      <SectionTitle>Lámpara EDU de Mateo</SectionTitle>
      <Card className="divide-y divide-slate-100">
        <Row icon={Lamp} title="Dispositivo" sub={`En línea · ${session.lampOn ? 'encendido' : 'en reposo'} · ${RING_LABEL[session.ring]}`} onClick={() => setOverlay({ kind: 'device' })} />
        <Row icon={BellRing} title="Hora de tareas" sub={`EDU llama a Mateo a las ${fmtTime24(settings.homeworkTime)}`} right={
          <select value={settings.homeworkTime} onChange={e => setSettings(s => ({ ...s, homeworkTime: e.target.value }))} className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-[13px] font-bold">
            {['15:30', '16:00', '16:30', '17:00', '18:00'].map(t => <option key={t} value={t}>{fmtTime24(t)}</option>)}
          </select>} />
      </Card>

      <SectionTitle>Notificaciones</SectionTitle>
      <Card className="divide-y divide-slate-100">
        <Row icon={BellRing} title="Avisarme cuando pida ayuda" right={<Toggle on={settings.notifyHelp} onChange={v => setSettings(s => ({ ...s, notifyHelp: v }))} label="Avisar ayuda" />} />
        <Row icon={MessageCircle} title="Copia por WhatsApp" sub="+51 987 654 321" right={<Toggle on={settings.whatsapp} onChange={v => setSettings(s => ({ ...s, whatsapp: v }))} label="WhatsApp" />} />
        <Row icon={BellRing} title="Resumen diario a las 7:00 p. m." right={<Toggle on={settings.dailyReport} onChange={v => setSettings(s => ({ ...s, dailyReport: v }))} label="Resumen diario" />} />
      </Card>

      <SectionTitle>Reglas de EDU</SectionTitle>
      <Card className="p-4">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
          <div className="flex-1"><div className="flex items-center justify-between"><p className="text-[14px] font-extrabold text-slate-900">EDU nunca hace la tarea</p><Lock className="h-4 w-4 text-slate-400" /></div>
            <p className="mt-1 text-[13px] text-slate-600">Guía con preguntas y pistas, explica lo que pidió el docente y revisa lo que el niño hizo. No resuelve ejercicios ni dicta respuestas, aunque el niño o un adulto se lo pidan.</p></div></div>
      </Card>

      <SectionTitle>Prototipo</SectionTitle>
      <Card className="divide-y divide-slate-100">
        <Row icon={RefreshCcw} title="Reiniciar la demo" sub="Vuelve a las 3:55 p. m., antes de la hora de tareas" onClick={resetDemo} />
        <Row icon={Trash2} title="Ver la bienvenida otra vez" sub="Conectar plataformas y vincular la lámpara" onClick={restartOnboarding} />
      </Card>
    </div>
  );
};

export const ConnectionsSheet: React.FC = () => {
  const { overlay, setOverlay, connections, setConnections, notify } = useEdu();
  const [busy, setBusy] = useState<string | null>(null);
  const connect = (id: string) => {
    setBusy(id);
    window.setTimeout(() => {
      setConnections(cs => cs.map(c => c.id === id ? { ...c, connected: true, lastSync: 'ahora', itemsRead: id === 'correo' ? 9 : 4 } : c));
      setBusy(null);
      const c = connections.find(x => x.id === id);
      notify({ kind: 'nuevo', title: `${c?.name} conectado`, body: 'EDU ya está leyendo sus mensajes y los ordenará con lo demás.' });
    }, 1400);
  };
  return (
    <Sheet open={overlay?.kind === 'connections'} onClose={() => setOverlay(null)} title="Conexiones">
      <p className="mb-3 text-[13px] text-slate-600">EDU solo lee la información escolar de tus hijos. No publica nada ni cambia nada en estas plataformas.</p>
      <div className="space-y-2.5">
        {connections.map(c => (
          <Card key={c.id} className="flex items-center gap-3 p-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-[13px] font-black text-white" style={{ background: c.color }}>{c.initials}</span>
            <div className="min-w-0 flex-1"><p className="text-[14px] font-extrabold text-slate-900">{c.name}</p><p className="text-[12px] text-slate-500">{c.connected ? `Conectado · ${c.itemsRead} publicaciones leídas · ${c.lastSync}` : c.kind}</p></div>
            {c.connected ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">Conectado</span>
              : <button onClick={() => connect(c.id)} className="rounded-full bg-edu px-3 py-1.5 text-[12px] font-extrabold text-white">{busy === c.id ? 'Conectando…' : 'Conectar'}</button>}
          </Card>
        ))}
      </div>
    </Sheet>
  );
};

export const DeviceSheet: React.FC = () => {
  const { overlay, setOverlay, session, settings, setSettings } = useEdu();
  return (
    <Sheet open={overlay?.kind === 'device'} onClose={() => setOverlay(null)} title="Lámpara EDU de Mateo">
      <div className="flex justify-center rounded-3xl bg-gradient-to-b from-white to-slate-100 py-3"><EduDevice expr={session.expr} ring={session.ring} lampOn={session.lampOn} size={190} /></div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12px]">
        <Card className="p-2.5"><p className="font-black text-emerald-600">En línea</p><p className="text-slate-500">Wi-Fi casa</p></Card>
        <Card className="p-2.5"><p className="font-black text-slate-900">{session.lampOn ? 'Encendida' : 'En reposo'}</p><p className="text-slate-500">lámpara</p></Card>
        <Card className="p-2.5"><p className="font-black text-slate-900">{RING_LABEL[session.ring]}</p><p className="text-slate-500">anillo</p></Card>
      </div>
      <SectionTitle>Privacidad</SectionTitle>
      <Card className="divide-y divide-slate-100">
        <Row icon={Video} title="Transmisión en vivo" sub="Solo durante la hora de tareas · no se graba" right={<Toggle on={settings.liveStream} onChange={v => setSettings(s => ({ ...s, liveStream: v }))} label="Transmisión" />} />
        <Row icon={ShieldCheck} title="La cámara apunta al cuaderno" sub="No ve el rostro de Mateo. Tiene tapa deslizante y luz que avisa cuando está activa." />
        <Row icon={Lock} title="Interruptor de privacidad" sub="Atrás de la lámpara. Apaga cámara y micrófono por completo." />
      </Card>
    </Sheet>
  );
};

export const WorkshopsSheet: React.FC = () => {
  const { overlay, setOverlay, workshops, setWorkshops, childId } = useEdu();
  const [name, setName] = useState('Natación');
  const add = () => { if (!name.trim()) return; setWorkshops(ws => [...ws, { id: `w-${Date.now()}`, childId, name: name.trim(), place: 'Por definir', days: [5], time: '16:30', remindMin: 30, emoji: '⭐' }]); setName(''); };
  return (
    <Sheet open={overlay?.kind === 'workshops'} onClose={() => setOverlay(null)} title="Talleres y academias">
      <p className="mb-3 text-[13px] text-slate-600">EDU avisa al niño en la lámpara 30 minutos antes y te confirma que el aviso llegó.</p>
      <div className="space-y-2">
        {workshops.filter(w => w.childId === childId).map(w => (
          <Card key={w.id} className="flex items-center gap-3 p-3.5"><span className="text-2xl">{w.emoji}</span><div className="flex-1"><p className="text-[14px] font-extrabold">{w.name}</p><p className="text-[12px] text-slate-500">{w.days.map(d => ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][d]).join(' y ')} · {fmtTime24(w.time)} · {w.place}</p></div>
            <button onClick={() => setWorkshops(ws => ws.filter(x => x.id !== w.id))} aria-label="Quitar" className="text-slate-400"><Trash2 className="h-4 w-4" /></button></Card>
        ))}
      </div>
      <div className="mt-3 flex gap-2"><input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del taller" className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[14px] outline-none" /><button onClick={add} className="rounded-2xl bg-edu px-4 text-[14px] font-extrabold text-white">Agregar</button></div>
    </Sheet>
  );
};
