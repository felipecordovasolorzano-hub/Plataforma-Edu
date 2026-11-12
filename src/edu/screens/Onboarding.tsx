import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Lamp, Loader2, Lock, Plus, ShieldCheck } from 'lucide-react';
import { useEdu } from '../store';
import { EduDevice, EduFace } from '../ui';
import { PARENT_NAME, SCHOOL_PLATFORMS } from '../data';

const Btn: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; ghost?: boolean }> = ({ onClick, children, disabled, ghost }) => (
  <button onClick={onClick} disabled={disabled} className={`w-full rounded-2xl py-4 text-[16px] font-extrabold transition ${ghost ? 'text-slate-500' : 'bg-edu text-white shadow-lg shadow-edu/25 disabled:bg-slate-300 disabled:shadow-none'}`}>{children}</button>
);

export const Onboarding: React.FC = () => {
  const { finishOnboarding } = useEdu();
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<string | null>('sieweb');
  const [loginState, setLoginState] = useState<'form' | 'loading' | 'ok'>('form');
  const [scan, setScan] = useState(0);
  const [ws, setWs] = useState<string[]>(['⚽ Fútbol · mar y jue 5:00 p. m.']);
  const [code, setCode] = useState('');
  const [linking, setLinking] = useState(false);
  const pName = SCHOOL_PLATFORMS.find(p => p.id === platform)?.name ?? 'la plataforma';

  useEffect(() => { if (step === 3) { setScan(0); const id = window.setInterval(() => setScan(s => { if (s >= 4) { window.clearInterval(id); return s; } return s + 1; }), 650); return () => window.clearInterval(id); } }, [step]);

  const login = () => { setLoginState('loading'); window.setTimeout(() => { setLoginState('ok'); window.setTimeout(() => setStep(3), 700); }, 1500); };
  const link = () => { setLinking(true); window.setTimeout(() => { setLinking(false); setStep(6); }, 1300); };

  const screens = [
    // 0 Bienvenida
    <div key="0" className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="rounded-[34px] bg-slate-950 p-2 shadow-2xl shadow-edu/30"><EduFace expr="feliz" size={150} /></div>
        <h1 className="mt-8 text-[32px] font-black leading-tight text-slate-900">Hola, soy <span className="text-edu">EDU</span></h1>
        <p className="mt-3 max-w-[290px] text-[16px] text-slate-600">Me conecto a lo que el colegio ya usa y te digo <b>solo lo que necesitas saber</b> sobre tus hijos. Sin revisar curso por curso.</p>
      </div>
      <Btn onClick={() => setStep(1)}>Empezar</Btn>
      <button onClick={finishOnboarding} className="mt-2 py-2 text-[13px] font-bold text-slate-400">Saltar y ver la demo</button>
    </div>,
    // 1 Elegir plataforma
    <div key="1" className="flex h-full flex-col">
      <p className="text-[13px] font-extrabold uppercase tracking-wide text-edu">Paso 1 de 4</p>
      <h1 className="mt-1 text-[26px] font-black leading-tight text-slate-900">¿Qué plataforma usa el colegio?</h1>
      <p className="mt-2 text-[14px] text-slate-600">No cambias nada: sigues usando la del colegio. EDU solo la lee por ti.</p>
      <div className="mt-5 space-y-2.5">
        {SCHOOL_PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)} className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-3.5 text-left ${platform === p.id ? 'border-edu' : 'border-transparent'}`}>
            <span className="grid h-11 w-11 place-items-center rounded-xl text-[13px] font-black text-white" style={{ background: p.color }}>{p.initials}</span>
            <span className="flex-1 text-[15px] font-extrabold text-slate-900">{p.name}</span>
            {platform === p.id && <span className="grid h-6 w-6 place-items-center rounded-full bg-edu text-white"><Check className="h-4 w-4" /></span>}
          </button>
        ))}
      </div>
      <div className="mt-auto pt-4"><Btn onClick={() => { setLoginState('form'); setStep(2); }} disabled={!platform}>Continuar</Btn></div>
    </div>,
    // 2 Iniciar sesión
    <div key="2" className="flex h-full flex-col">
      <p className="text-[13px] font-extrabold uppercase tracking-wide text-edu">Paso 1 de 4</p>
      <h1 className="mt-1 text-[26px] font-black leading-tight text-slate-900">Conecta {pName}</h1>
      <p className="mt-2 text-[14px] text-slate-600">Usa el mismo usuario que te dio el colegio.</p>
      <div className="mt-5 space-y-3 rounded-3xl bg-white p-4">
        <label className="block"><span className="text-[12px] font-bold text-slate-500">Usuario</span><input defaultValue="carolina.cordova" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-[15px] outline-none focus:border-edu" /></label>
        <label className="block"><span className="text-[12px] font-bold text-slate-500">Contraseña</span><input type="password" defaultValue="demo1234" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-[15px] outline-none focus:border-edu" /></label>
      </div>
      <p className="mt-3 flex items-start gap-2 text-[12px] text-slate-500"><Lock className="mt-0.5 h-4 w-4 shrink-0" />EDU solo tiene permiso de lectura. No publica, no responde ni cambia nada en {pName}.</p>
      <div className="mt-auto pt-4">
        <Btn onClick={login} disabled={loginState !== 'form'}>{loginState === 'form' ? 'Conectar' : loginState === 'loading' ? <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Conectando…</span> : <span className="inline-flex items-center gap-2"><Check className="h-5 w-5" />Conectado</span>}</Btn>
      </div>
    </div>,
    // 3 Lectura y orden
    <div key="3" className="flex h-full flex-col">
      <p className="text-[13px] font-extrabold uppercase tracking-wide text-edu">Paso 2 de 4</p>
      <h1 className="mt-1 text-[26px] font-black leading-tight text-slate-900">{scan < 4 ? 'Estoy leyendo todo por ti…' : 'Listo, ya lo ordené'}</h1>
      <div className="mt-5 flex justify-center"><div className="rounded-[26px] bg-slate-950 p-1.5"><EduFace expr={scan < 4 ? 'escucha' : 'meta'} size={100} /></div></div>
      <div className="mt-6 space-y-2.5">
        {[['31 publicaciones de 8 cursos', 'mensajes, clases, materiales e instrumentos'], ['6 tareas y 2 evaluaciones', 'ordenadas por fecha de entrega'], ['4 materiales por llevar', 'con el día en que se necesitan'], ['1 cambio de fecha', 'Ciencia: la planta pasó al lunes 16']].map(([a, b], i) => (
          <motion.div key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: scan > i ? 1 : 0.25, y: 0 }} className="flex items-center gap-3 rounded-2xl bg-white p-3.5">
            <span className={`grid h-8 w-8 place-items-center rounded-full ${scan > i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{scan > i ? <Check className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}</span>
            <div><p className="text-[15px] font-extrabold text-slate-900">{a}</p><p className="text-[12px] text-slate-500">{b}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="mt-auto pt-4"><Btn onClick={() => setStep(4)} disabled={scan < 4}>Continuar</Btn></div>
    </div>,
    // 4 Talleres
    <div key="4" className="flex h-full flex-col">
      <p className="text-[13px] font-extrabold uppercase tracking-wide text-edu">Paso 3 de 4</p>
      <h1 className="mt-1 text-[26px] font-black leading-tight text-slate-900">¿Tiene talleres fuera del colegio?</h1>
      <p className="mt-2 text-[14px] text-slate-600">Le aviso 30 minutos antes para que se aliste, y te confirmo que el aviso llegó.</p>
      <div className="mt-5 space-y-2">
        {ws.map(w => <div key={w} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 text-[15px] font-bold text-slate-900"><Check className="h-5 w-5 text-emerald-500" />{w}</div>)}
        {['🎨 Pintura · sáb 10:00 a. m.', '🏊 Natación', '🎹 Piano'].filter(x => !ws.includes(x)).map(w => (
          <button key={w} onClick={() => setWs(s => [...s, w])} className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-3.5 text-left text-[15px] font-bold text-slate-500"><Plus className="h-5 w-5" />{w}</button>
        ))}
      </div>
      <div className="mt-auto pt-4"><Btn onClick={() => setStep(5)}>Continuar</Btn></div>
    </div>,
    // 5 Vincular la lámpara
    <div key="5" className="flex h-full flex-col">
      <p className="text-[13px] font-extrabold uppercase tracking-wide text-edu">Paso 4 de 4</p>
      <h1 className="mt-1 text-[26px] font-black leading-tight text-slate-900">Vincula la lámpara EDU</h1>
      <p className="mt-2 text-[14px] text-slate-600">Enciéndela en el escritorio de tu hijo. En su pantalla aparecerá un código.</p>
      <div className="mt-3 flex justify-center"><EduDevice expr="escucha" ring="escucha" lampOn size={150} /></div>
      <div className="mx-auto mt-2 flex gap-2">
        {[0, 1, 2, 3].map(i => <div key={i} className={`grid h-14 w-12 place-items-center rounded-2xl border-2 bg-white text-[24px] font-black ${code.length > i ? 'border-edu text-slate-900' : 'border-slate-200'}`}>{code[i] ?? ''}</div>)}
      </div>
      <input aria-label="Código de la lámpara" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="Escribe el código: 4821" className="mx-auto mt-3 w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-[14px] outline-none" />
      <button onClick={() => setCode('4821')} className="mx-auto mt-1 text-[12px] font-bold text-edu">Usar el código de la demo</button>
      <div className="mt-auto pt-4">
        <Btn onClick={link} disabled={code.length < 4 || linking}>{linking ? <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Vinculando…</span> : 'Vincular'}</Btn>
        <Btn ghost onClick={() => setStep(6)}>Lo haré después</Btn>
      </div>
    </div>,
    // 6 Listo
    <div key="6" className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="rounded-[30px] bg-slate-950 p-2"><EduFace expr="meta" size={130} /></div>
        <h1 className="mt-6 text-[28px] font-black text-slate-900">¡Todo listo, {PARENT_NAME}!</h1>
        <p className="mt-2 max-w-[300px] text-[15px] text-slate-600">Cada día verás qué tiene tu hijo, qué debe llevar y qué cambió. Cuando use la lámpara, sabrás cómo le va.</p>
        <div className="mt-5 flex items-start gap-2 rounded-2xl bg-emerald-50 p-3.5 text-left text-[13px] text-emerald-900"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" /><span><b>Una promesa:</b> EDU guía a tu hijo paso a paso, pero nunca le hace la tarea.</span></div>
      </div>
      <Btn onClick={finishOnboarding}><span className="inline-flex items-center gap-2"><Lamp className="h-5 w-5" />Ir a mi resumen de hoy</span></Btn>
    </div>,
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50 px-5 pb-6 pt-3">
      <div className="h-9">{step > 0 && step < 6 && <button onClick={() => setStep(s => (s === 3 ? 1 : s - 1))} aria-label="Atrás" className="grid h-9 w-9 place-items-center rounded-full bg-white"><ArrowLeft className="h-4 w-4" /></button>}</div>
      <AnimatePresence mode="wait">
        <motion.div key={step} className="flex-1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>{screens[step]}</motion.div>
      </AnimatePresence>
    </div>
  );
};
