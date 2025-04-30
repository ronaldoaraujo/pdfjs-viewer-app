import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef, useState } from "react";

export default function Viewer({signUser, url}) {
  const outerContainerRef = useRef(null);
  const innerViewerRef = useRef(null);

  const [rubricas, setRubricas] = useState([]); // 🎯 Guarda todas as rubricas

  useEffect(() => {
    const DEFAULT_URL = url;
    const SCALE = 1.0;

    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const eventBus = new pdfjsViewer.EventBus();

    const pdfViewer = new pdfjsViewer.PDFViewer({
      container: outerContainerRef.current,
      viewer: innerViewerRef.current,
      eventBus,
      textLayerMode: 0,
      annotationMode: 0,
    });

    eventBus.on("pagesinit", function () {
      pdfViewer.currentScaleValue = SCALE;
    });

    const loadingTask = pdfjsLib.getDocument({
      url: DEFAULT_URL,
      enableXfa: true,
    });
    loadingTask.promise.then((pdfDocument) => {
      pdfViewer.setDocument(pdfDocument);

        const pageElements = innerViewerRef.current.querySelectorAll('.page');

        pageElements.forEach((pageElement, pageIndex) => {
          pageElement.addEventListener('click', (event) => {
            const rect = pageElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const pageNum = pageIndex + 1;

            const newRubrica = {
              id: Date.now(), // id único
              page: pageNum,
              x,
              y,
              width: 100,
              height: 50,
            };

            setRubricas((prev) => [...prev, newRubrica]);

          });
        });
    });
  }, []);

  // 🎯 Função para mover uma rubrica
  const handleDrag = (id, e) => {
    const deltaX = e.movementX;
    const deltaY = e.movementY;
    console.log("handleDrag", id)
    setRubricas((prev) =>
      prev.map((rubrica) =>
        rubrica.id === id
          ? { ...rubrica, x: rubrica.x + deltaX, y: rubrica.y + deltaY }
          : rubrica
      )
    );
  };

  // 🎯 Função para deletar uma rubrica
  const handleDelete = (id) => {
    setRubricas((prev) => prev.filter((rubrica) => rubrica.id !== id));
  };

  return (
    <div
      ref={outerContainerRef}
      className="w-full h-screen overflow-auto bg-gray-200"
      style={{
        position: 'absolute'
      }}
    >
      <div ref={innerViewerRef} className="pdfViewer singlePageView" />

      {/* 🎯 Renderizar as rubricas */}
      {/* {console.log("rubricas antes do map", rubricas)} */}
      {rubricas.map((rubrica) => (
        <div
          key={rubrica.id}
          className="cursor-move group"
          id={`${Date.now()}`}
          style={{
            top: `${rubrica.y}px`,
            left: `${rubrica.x}px`,
            width: `${rubrica.width}px`,
            height: `${rubrica.height}px`,
            position: 'absolute',
            zIndex: 20,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const move = (eMove) => handleDrag(rubrica.id, eMove);
            const stop = () => {
              window.removeEventListener('mousemove', move);
              window.removeEventListener('mouseup', stop);
            };
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', stop);
          }}
        >
          <img
            src='https://ibdt.org.br/site/wp-content/uploads/2022/03/assinatura-ricardo.png'
            alt="Rubrica"
            className="w-full h-full object-contain pointer-events-none"
          />
          {/* Botão de excluir */}
          <button
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hidden group-hover:flex items-center justify-center"
            onClick={() => handleDelete(rubrica.id)}
          >
            ×
          </button>
        </div>
      ))}
 </div>
);
}