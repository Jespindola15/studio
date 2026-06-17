
'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, FileUp, FileX, Loader2, Download, CheckCircle2, RefreshCw, ArrowLeftRight, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fileToBase64, generateOptimizedPDF } from '@/lib/pdf-service';
import Image from 'next/image';
import * as pdfjs from 'pdfjs-dist';

// Configuración del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

type DocSide = 'front' | 'back';

interface DocFile {
  id: string;
  file: File | Blob;
  preview: string;
  name: string;
  size: number;
}

export function DocumentProcessor() {
  const [front, setFront] = useState<DocFile | null>(null);
  const [back, setBack] = useState<DocFile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetSlot, setTargetSlot] = useState<DocSide | null>(null);
  const { toast } = useToast();

  const processFile = async (file: File | Blob, slot: DocSide) => {
    setIsProcessing(true);
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
          base64 = canvas.toDataURL('image/png');
        }
      } else {
        base64 = await fileToBase64(file as File);
      }

      const newDoc: DocFile = {
        id,
        file,
        preview: base64,
        name: fileName,
        size: fileSize
      };

      if (slot === 'front') setFront(newDoc);
      else setBack(newDoc);

    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo procesar el archivo.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && targetSlot) {
      processFile(acceptedFiles[0], targetSlot);
      setTargetSlot(null);
    }
  }, [targetSlot]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
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

      // Convert data URI to Blob
      const res = await fetch(pdfDataUri);
      const blob = await res.blob();
      const filename = `documento_escaneado_${Date.now()}.pdf`;

      // If Web Share API with files is available (mobile), use it
      try {
        if (navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: blob.type })] })) {
          await (navigator as any).share({ files: [new File([blob], filename, { type: blob.type })], title: filename });
          toast({ title: 'Compartido', description: 'Abre el archivo desde tu dispositivo.' });
        } else {
          // Fallback: use blob URL and trigger download
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          // For iOS/Safari where download attribute is unreliable, open in new tab
          const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
          if (isIOS) window.open(url, '_blank');
          else link.click();
          // Cleanup
          setTimeout(() => URL.revokeObjectURL(url), 10000);
          toast({ title: '¡Listo!', description: 'Tu PDF está listo — se ha iniciado la descarga o se abrió en una nueva pestaña.' });
        }
      } catch (shareErr) {
        // If share fails, fallback to blob URL download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
        if (isIOS) window.open(url, '_blank');
        else link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        toast({ title: '¡Listo!', description: 'Tu PDF está listo — se ha iniciado la descarga o se abrió en una nueva pestaña.' });
      }

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
          <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2 shadow-xl animate-in zoom-in duration-500">
            <CheckCircle2 size={18} className="text-white" />
          </div>
        </div>
      )}
      
      {doc && (
        <div className="mt-6 flex items-center justify-between px-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {doc.file.type === 'application/pdf' ? <FileText size={12} className="text-red-500" /> : <ImageIcon size={12} className="text-primary" />}
              <span className="text-[10px] font-bold text-slate-900 truncate max-w-[150px]">{doc.name}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 uppercase">{(doc.size / 1024).toFixed(0)} KB</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div {...getRootProps()} className="max-w-4xl mx-auto space-y-12 py-8 outline-none">
      <input {...getInputProps()} />
      
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
           Espindola Developer
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">DocScanner</h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
          Sube el frente y el dorso para generar tu PDF <br className="hidden md:block" />
          optimizado al instante.
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
        {isProcessing && (
          <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
            <Loader2 className="animate-spin" size={20} />
            <span>PROCESANDO ARCHIVO...</span>
          </div>
        )}
        <Button 
          size="lg" 
          className="w-full md:w-auto min-w-[340px] h-20 text-xl font-black rounded-[2rem] shadow-[0_20px_50px_rgba(var(--primary),0.2)] transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-30 disabled:grayscale"
          disabled={!front || !back || isGenerating || isProcessing}
          onClick={handleGeneratePDF}
        >
          {isGenerating ? (
            <><Loader2 className="mr-3 animate-spin" size={24} /> GENERANDO PDF...</>
          ) : (
            <><Download className="mr-3" size={24} /> DESCARGAR PDF</>
          )}
        </Button>
      </div>

      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-2xl flex flex-col items-center justify-center text-white p-12 text-center animate-in fade-in duration-300">
          <div className="bg-white/10 p-12 rounded-[4rem] mb-8 border border-white/20">
            <FileUp size={100} className="animate-bounce" />
          </div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter">¡Suéltalo aquí!</h2>
          <p className="text-2xl opacity-80 font-bold uppercase tracking-widest">Añadiendo documento</p>
        </div>
      )}
    </div>
  );
}
