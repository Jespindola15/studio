'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, FileUp, FileX, Loader2, Download, CheckCircle2, Scissors, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeDocumentSide } from '@/ai/flows/analyze-document-flow';
import { fileToBase64, generateOptimizedPDF, cropImage } from '@/lib/pdf-service';
import Image from 'next/image';

type DocSide = 'front' | 'back';

interface DocFile {
  id: string;
  file: File;
  preview: string;
  status: 'analyzing' | 'cropping' | 'ready' | 'error';
}

export function DocumentProcessor() {
  const [front, setFront] = useState<DocFile | null>(null);
  const [back, setBack] = useState<DocFile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    let base64 = '';
    
    try {
      base64 = await fileToBase64(file);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo leer el archivo.' });
      return;
    }

    const newDoc: DocFile = {
      id,
      file,
      preview: base64,
      status: 'analyzing'
    };

    // Sequential placement
    if (!front) setFront(newDoc);
    else if (!back) setBack(newDoc);
    else {
      toast({ title: 'Límite alcanzado', description: 'Ya tienes ambos lados.' });
      return;
    }

    try {
      const analysis = await analyzeDocumentSide({ photoDataUri: base64 });
      
      let finalPreview = base64;
      
      // Auto crop if AI detected a document
      if (analysis.boundingBox) {
        try {
          // Update status to cropping to show feedback
          const croppingDoc: DocFile = { ...newDoc, status: 'cropping' };
          if (front?.id === id) setFront(croppingDoc);
          else if (back?.id === id) setBack(croppingDoc);

          finalPreview = await cropImage(base64, analysis.boundingBox);
        } catch (cropError) {
          console.error('Crop error:', cropError);
        }
      }

      const updatedDoc: DocFile = { 
        ...newDoc, 
        preview: finalPreview,
        status: 'ready' 
      };

      if (analysis.side === 'front') {
        setFront(updatedDoc);
        setBack(prev => prev?.id === id ? null : prev);
      } else if (analysis.side === 'back') {
        setBack(updatedDoc);
        setFront(prev => prev?.id === id ? null : prev);
      } else {
        if (front?.id === id) setFront(updatedDoc);
        else if (back?.id === id) setBack(updatedDoc);
      }
    } catch (error) {
      console.error('AI Error:', error);
      const readyDoc: DocFile = { ...newDoc, status: 'ready' };
      if (front?.id === id) setFront(readyDoc);
      else if (back?.id === id) setBack(readyDoc);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => processFile(file));
  }, [front, back]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    noClick: true,
    multiple: true
  });

  const handleGeneratePDF = async () => {
    if (!front || !back) return;
    setIsGenerating(true);
    try {
      const pdfDataUri = await generateOptimizedPDF(front.preview, back.preview);
      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = `documento_optimizado_${Date.now()}.pdf`;
      link.click();
      toast({ title: 'PDF Generado', description: 'El documento se ha descargado.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo generar el PDF.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const Slot = ({ title, doc, onRemove, type }: { title: string, doc: DocFile | null, onRemove: () => void, type: DocSide }) => (
    <div className={`relative group border-2 border-dashed rounded-2xl p-6 transition-all min-h-[300px] flex flex-col ${doc ? 'border-primary/40 bg-primary/[0.02] shadow-inner' : 'border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/[0.01]'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">{title}</h3>
        {doc && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={open} className="h-8 w-8 rounded-full">
              <RefreshCw size={14} className="text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
              <FileX size={14} />
            </Button>
          </div>
        )}
      </div>

      {!doc ? (
        <div onClick={open} className="flex-1 flex flex-col items-center justify-center cursor-pointer space-y-4">
          <div className="bg-primary/10 p-5 rounded-full text-primary group-hover:scale-110 transition-transform">
            <Camera size={32} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">Toca para capturar</p>
            <p className="text-xs text-muted-foreground mt-1">Sube el {type === 'front' ? 'frente' : 'dorso'}</p>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 rounded-xl overflow-hidden border bg-white shadow-sm transition-all duration-500">
          <Image src={doc.preview} alt={title} fill className="object-contain" />
          
          {(doc.status === 'analyzing' || doc.status === 'cropping') && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[4px] flex flex-col items-center justify-center z-10">
              <div className="relative">
                <Loader2 className="animate-spin text-primary" size={32} />
                {doc.status === 'cropping' && (
                  <Scissors className="absolute inset-0 m-auto text-primary animate-pulse" size={16} />
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-3">
                {doc.status === 'analyzing' ? 'Detectando con AI' : 'Recortando...'}
              </span>
            </div>
          )}
          
          {doc.status === 'ready' && (
            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-lg animate-in zoom-in duration-300">
              <CheckCircle2 size={16} className="text-white" />
            </div>
          )}
        </div>
      )}
      
      {doc && (
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[120px]">{doc.file.name}</span>
            <span className="text-[10px] text-muted-foreground/60 uppercase">{(doc.file.size / 1024).toFixed(0)} KB • AI Optimizada</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div {...getRootProps()} className="max-w-4xl mx-auto space-y-10 py-6 outline-none">
      <input {...getInputProps()} />
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <Scissors size={14} /> Recorte automático con IA
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">DocScanner AI</h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">Captura tus documentos. Nuestra IA detectará los bordes, recortará el exceso y creará un PDF perfecto.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 px-2">
        <Slot title="Frente del Documento" doc={front} onRemove={() => setFront(null)} type="front" />
        <Slot title="Dorso del Documento" doc={back} onRemove={() => setBack(null)} type="back" />
      </div>

      <div className="flex flex-col items-center gap-6 pt-4">
        <Button 
          size="lg" 
          className="w-full md:w-auto min-w-[300px] h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          disabled={!front || !back || isGenerating || front.status !== 'ready' || back.status !== 'ready'}
          onClick={handleGeneratePDF}
        >
          {isGenerating ? (
            <><Loader2 className="mr-3 animate-spin" /> GENERANDO PDF...</>
          ) : (
            <><Download className="mr-3" /> DESCARGAR PDF OPTIMIZADO</>
          )}
        </Button>
        
        <div className="flex items-center gap-8 text-muted-foreground/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Procesamiento Local</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Auto-Recorte</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Gemini Vision</span>
          </div>
        </div>
      </div>

      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center text-white p-12 text-center animate-in fade-in duration-300">
          <div className="bg-white/10 p-8 rounded-[3rem] mb-6">
            <FileUp size={80} className="animate-bounce" />
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter">¡Suéltalo aquí!</h2>
          <p className="text-xl opacity-80 font-medium">DocScanner aplicará magia AI instantáneamente</p>
        </div>
      )}
    </div>
  );
}
