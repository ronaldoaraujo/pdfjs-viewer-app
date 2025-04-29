import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";

export default function PdfViewer() {
  const outerContainerRef = useRef(null);
  const innerViewerRef = useRef(null);

  useEffect(() => {
    const DEFAULT_URL = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";
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
    });

    setTimeout(() => {
      const pageElements = innerViewerRef.current.querySelectorAll('.page');

      pageElements.forEach((pageElement, index) => {
        pageElement.addEventListener('click', (event) => {
          const rect = pageElement.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const pageNum = index + 1; 

          console.log(`Você clicou na Página ${pageNum} nas coordenadas X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
          alert(`Página: ${pageNum}\nX: ${x.toFixed(2)}\nY: ${y.toFixed(2)}`);
        });
      });
    }, 500);

  }, []);

  return (
    <div
      ref={outerContainerRef}
      className="customPdfViewerWrapper"
      style={{
        position: "absolute", 
        minHeight: "100vh",
        overflow: "auto",
        backgroundColor: "#808080",
        padding: "20px 20px 0 20px",
      }}
    >
      <div ref={innerViewerRef} className="pdfViewer singlePageView" />
    </div>
  );
}
