
'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, FileUp, FileX, Loader2, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { analyzeDocumentSide } from '@/ai/flows/analyze-document-flow';
import { fileToBase64, generateOptimizedPDF } from '@/lib/pdf-service';
import Image from 'next/image';

type DocSide = 'front' | 'back' | null;

interface DocFile {
  id: string;
  file: File;
  preview: string;
  detectedSide: DocSide;
  confidence: number;
  status: 'pending' | 'analyzing' | 'ready' | 'error';
}

export function DocumentProcessor() {
  const [front, setFront] = useState<DocFile | null>(null);
  const [back, setBack] = useState<DocFile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const base64 = await fileToBase64(file);
    
    const newDoc: DocFile = {
      id,
      file,
      preview: base64,
      detectedSide: null,
      confidence: 0,
      status: 'analyzing'
    };

    // Preliminary placement (can be overriden by AI)
    try {
      const analysis = await analyzeDocumentSide({ photoDataUri: base64 });
      newDoc.detectedSide = analysis.side === 'unknown' ? null : (analysis.side as DocSide);
      newDoc.confidence = analysis.confidence;
      newDoc.status = 'ready';

      if (analysis.side === 'front') setFront(newDoc);
      else if (analysis.side === 'back') setBack(newDoc);
      else {
        // Fallback: put in first empty slot
        if (!front) setFront(newDoc);
        else setBack(newDoc);
      }
    } catch (error) {
      newDoc.status = 'error';
      toast({
        variant: 'destructive',
        title: 'Error de análisis',
        description: 'No pudimos procesar la imagen automáticamente.'
      });
      if (!front) setFront(newDoc); else setBack(newDoc);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => processFile(file));
  }, [front, back]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
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
      toast({
        title: 'PDF Generado',
        description: 'Tu documento se ha descargado correctamente.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo generar el PDF.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const Slot = ({ title, doc, onRemove, type }: { title: string, doc: DocFile | null, onRemove: () => void, type: 'front' | 'back' }) => (
    <div className={`relative group border-2 border-dashed rounded-xl p-4 transition-all ${doc ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{title}</h3>
        {doc && (
          <button onClick={onRemove} className="text-destructive hover:bg-destructive/10 p-1 rounded-full">
            <FileX size={18} />
          </button>
        )}
      </div>

      {!doc ? (
        <div {...getRootProps()} className="h-48 flex flex-col items-center justify-center cursor-pointer">
          <input {...getInputProps()} capture="environment" />
          <div className="bg-secondary p-3 rounded-full mb-2">
            <Camera size={24} className="text-primary" />
          </div>
          <p className="text-xs text-center text-muted-foreground">Toca para capturar<br/>o arrastra aquí</p>
        </div>
      ) : (
        <div className="relative h-48 w-full rounded-lg overflow-hidden border shadow-sm">
          <Image src={doc.preview} alt={title} fill className="object-contain bg-black/5" />
          {doc.status === 'analyzing' && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-primary mb-2" />
              <span className="text-xs font-medium">Analizando...</span>
            </div>
          )}
          {doc.status === 'ready' && (
            <div className="absolute bottom-2 right-2">
              <CheckCircle2 size={20} className="text-green-500 fill-white" />
            </div>
          )}
        </div>
      )}
      
      {doc && (
        <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
          <span>{(doc.file.size / 1024 / 1024).toFixed(2)} MB</span>
          <span className="uppercase">{doc.file.type.split('/')[1]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Scanner Inteligente</h1>
        <p className="text-muted-foreground">Digitaliza tu documento en segundos. Captura ambos lados y genera tu PDF.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Slot title="Frente del Documento" doc={front} onRemove={() => setFront(null)} type="front" />
        <Slot title="Dorso del Documento" doc={back} onRemove={() => setBack(null)} type="back" />
      </div>

      <div className="flex flex-col items-center gap-4 pt-6">
        <Button 
          size="lg" 
          className="w-full md:w-auto px-12 h-14 text-lg font-bold shadow-xl shadow-primary/20"
          disabled={!front || !back || isGenerating}
          onClick={handleGeneratePDF}
        >
          {isGenerating ? (
            <><Loader2 className="mr-2 animate-spin" /> Procesando...</>
          ) : (
            <><Download className="mr-2" /> Generar PDF Optimizado</>
          )}
        </Button>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle size={12} /> Las imágenes se procesan localmente para tu privacidad.
        </p>
      </div>
    </div>
  );
}
