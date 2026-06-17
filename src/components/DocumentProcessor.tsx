'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, FileUp, FileX, Loader2, Download, CheckCircle2, Scissors, RefreshCw, ArrowLeftRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeDocumentSide } from '@/ai/flows/analyze-document-flow';
import { fileToBase64, generateOptimizedPDF } from '@/lib/pdf-service';
import Image from 'next/image';
import * as pdfjs from 'pdfjs-dist';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

type DocSide = 'front' | 'back';

interface DocFile {
  id: string;
  file: File | Blob;
  preview: string;
  status: 'analyzing' | 'ready' | 'error';
  name: string;
  size: number;
}

export function DocumentProcessor() {
  const [front, setFront] = useState<DocFile | null>(null);
  const [back, setBack] = useState<DocFile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetSlot, setTargetSlot] = useState<DocSide | null>(null);
  const { toast } = useToast();

  const processFile = async (file: File | Blob, slotHint?: DocSide) => {
    const id = Math.random().toString(36).substr(2, 9);
    const fileName = (file as File).name || 'documento.png';
    const fileSize = file.size;
    let base64 = '';
    
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          base64 = canvas.toDataURL('image/jpeg', 0.9);
        }
      } else {
        base64 = await fileToBase64(file as File);
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo procesar el archivo.' });
      return;
    }

    const newDoc: DocFile = {
      id,
      file,
      preview: base64,
      status: 'analyzing',
      name: fileName,
      size: fileSize
    };

    // Initial assignment
    if (slotHint === 'front') setFront(newDoc);
    else if (slotHint === 'back') setBack(newDoc);
    else if (!front) setFront(newDoc);
    else if (!back) setBack(newDoc);
    else {
      toast({ title: 'Límite alcanzado', description: 'Usa el botón de reemplazo o elimina un archivo.' });
      return;
    }

    // AI Analysis & Isolation
    try {
      const result = await analyzeDocumentSide({ photoDataUri: base64 });
      
      const readyDoc: DocFile = { 
        ...newDoc, 
        preview: result.croppedPhotoDataUri || base64,
        status: 'ready' 
      };

      if (result.side === 'front') {
        setFront(prev => (prev?.id === id || !prev ? readyDoc : prev));
        // If it was forced into back but is front, and we have space in front, move it
        if (slotHint === 'back') {
          setBack(prev => prev?.id === id ? null : prev);
          setFront(prev => !prev || prev.id === id ? readyDoc : prev);
        } else {
          setBack(prev => (prev?.id === id ? null : prev));
        }
      } else if (result.side === 'back') {
        setBack(prev => (prev?.id === id || !prev ? readyDoc : prev));
        if (slotHint === 'front') {
          setFront(prev => prev?.id === id ? null : prev);
          setBack(prev => !prev || prev.id === id ? readyDoc : prev);
        } else {
          setFront(prev => (prev?.id === id ? null : prev));
        }
      } else {
        // Unknown: stay where assigned
        setFront(prev => (prev?.id === id ? readyDoc : prev));
        setBack(prev => (prev?.id === id ? readyDoc : prev));
      }
    } catch (error) {
      const readyDoc: DocFile = { ...newDoc, preview: base64, status: 'ready' };
      setFront(prev => (prev?.id === id ? readyDoc : prev));
      setBack(prev => (prev?.id === id ? readyDoc : prev));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0], targetSlot || undefined);
      setTargetSlot(null);
    }
  }, [front, back, targetSlot]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    noClick: true,
    multiple: false
  });

  const handleSwap = () => {
    const temp = front;
    setFront(back);
    setBack(temp);
    toast({ title: 'Lados intercambiados', description: 'Se ha cambiado el orden de los documentos.' });
  };

  const handleGeneratePDF = async () => {
    if (!front || !back) return;
    setIsGenerating(true);
    try {
      const pdfDataUri = await generateOptimizedPDF(front.preview, back.preview);
      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = `documento_escaneado_${Date.now()}.pdf`;
      link.click();
      toast({ title: '¡Listo!', description: 'Tu PDF optimizado se ha descargado.' });
      
      // Auto-reset state for next job
      setFront(null);
      setBack(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo generar el PDF.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const Slot = ({ title, doc, onRemove, type }: { title: string, doc: DocFile | null, onRemove: () => void, type: DocSide }) => (
    <div className={`relative group border-2 border-dashed rounded-[2.5rem] p-8 transition-all min-h-[350px] flex flex-col ${doc ? 'border-primary/40 bg-white shadow-xl' : 'border-slate-200 bg-slate-50/50 hover:border-primary/40 hover:bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-extrabold text-[10px] uppercase tracking-[0.3em] text-slate-400">{title}</h3>
        {doc && (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => { setTargetSlot(type); open(); }} className="h-9 w-9 rounded-full shadow-sm hover:text-primary">
              <RefreshCw size={14} />
            </Button>
            <Button variant="outline" size="icon" onClick={onRemove} className="h-9 w-9 rounded-full shadow-sm hover:bg-destructive/10 hover:text-destructive">
              <FileX size={14} />
            </Button>
          </div>
        )}
      </div>

      {!doc ? (
        <div onClick={() => { setTargetSlot(type); open(); }} className="flex-1 flex flex-col items-center justify-center cursor-pointer space-y-6 group/btn">
          <div className="bg-primary/5 p-8 rounded-[2rem] text-primary group-hover/btn:scale-110 group-hover/btn:bg-primary group-hover/btn:text-white transition-all duration-300">
            <Camera size={40} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">Seleccionar {type === 'front' ? 'frente' : 'dorso'}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Cámara, Galería o Archivos</p>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 rounded-[1.5rem] overflow-hidden border bg-slate-50 shadow-inner group/img">
          <Image src={doc.preview} alt={title} fill className="object-contain p-2" />
          
          {doc.status === 'analyzing' && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 text-center px-6">
              <div className="relative">
                 <Loader2 className="animate-spin text-primary mb-4" size={48} strokeWidth={1.5} />
                 <Scissors className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40" size={16} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                Aislando con IA...
              </span>
              <p className="text-[10px] text-slate-500 mt-2 font-medium leading-relaxed">
                Removiendo fondo y enderezando perspectiva
              </p>
            </div>
          )}
          
          {doc.status === 'ready' && (
            <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2 shadow-xl animate-in zoom-in duration-500">
              <CheckCircle2 size={18} className="text-white" />
            </div>
          )}
        </div>
      )}
      
      {doc && (
        <div className="mt-6 flex items-center justify-between px-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {doc.file.type === 'application/pdf' ? <FileText size={12} className="text-red-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              <span className="text-[10px] font-bold text-slate-900 truncate max-w-[150px]">{doc.name}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 uppercase">{(doc.size / 1024).toFixed(0)} KB • Escaneo Limpio</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div {...getRootProps()} className="max-w-4xl mx-auto space-y-12 py-8 outline-none">
      <input {...getInputProps()} capture="environment" />
      
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          <Scissors size={14} className="text-primary" /> Procesamiento Visión Artificial
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">DocScanner AI</h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
          Escaneo quirúrgico de documentos. <br className="hidden md:block" />
          Sin fondos, sin sombras, solo el documento.
        </p>
      </div>

      <div className="relative">
        {front && back && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <Button onClick={handleSwap} variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-2xl border-4 border-white hover:scale-110 transition-transform">
              <ArrowLeftRight size={20} className="text-primary" />
            </Button>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-8 px-4">
          <Slot title="Frente del Documento" doc={front} onRemove={() => setFront(null)} type="front" />
          <Slot title="Dorso del Documento" doc={back} onRemove={() => setBack(null)} type="back" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 pt-8 px-4">
        <Button 
          size="lg" 
          className="w-full md:w-auto min-w-[340px] h-20 text-xl font-black rounded-[2rem] shadow-[0_20px_50px_rgba(var(--primary),0.2)] transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-30 disabled:grayscale"
          disabled={!front || !back || isGenerating || front.status !== 'ready' || back.status !== 'ready'}
          onClick={handleGeneratePDF}
        >
          {isGenerating ? (
            <><Loader2 className="mr-3 animate-spin" size={24} /> ENSAMBLANDO PDF...</>
          ) : (
            <><Download className="mr-3" size={24} /> DESCARGAR PDF OPTIMIZADO</>
          )}
        </Button>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/40" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Gemini 2.5 Vision</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-400/40" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Sin Fondo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-400/40" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">PDF Optimizado</span>
          </div>
        </div>
      </div>

      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-2xl flex flex-col items-center justify-center text-white p-12 text-center animate-in fade-in duration-300">
          <div className="bg-white/10 p-12 rounded-[4rem] mb-8 border border-white/20">
            <FileUp size={100} className="animate-bounce" />
          </div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter">¡Suéltalo aquí!</h2>
          <p className="text-2xl opacity-80 font-bold uppercase tracking-widest">Iniciando análisis quirúrgico</p>
        </div>
      )}
    </div>
  );
}
