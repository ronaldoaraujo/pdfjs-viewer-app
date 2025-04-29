import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef } from "react";

// import { assinatura } from '../../public/assinatura.png';


export default function PdfViewer({signUser, url}) {
  const outerContainerRef = useRef(null);
  const innerViewerRef = useRef(null);

  const closeElement = (e) => {
    console.log("fechar elemento", e)
  }

  const getClick = () => {
    const pageElements = innerViewerRef.current.querySelectorAll('.page');

      pageElements.forEach((pageElement, index) => {
        pageElement.addEventListener('click', (event) => {
          const rect = pageElement.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const pageNum = index + 1;

          const hasDiv = document.getElementById(signUser);
          if(hasDiv) {
            console.log('div ja existe')
          } else {
            const rubricaDiv = document.createElement('div');
            rubricaDiv.id = signUser;
            rubricaDiv.style.position = 'absolute';
            rubricaDiv.style.left = `${x}px`;
            rubricaDiv.style.top = `${y}px`;
            rubricaDiv.style.width = '200px';
            rubricaDiv.style.height = '60px';
            rubricaDiv.style.backgroundColor = '#cf0a0a';
            rubricaDiv.style.zIndex = 999999;

            const close = document.createElement('button');
            close.innerHTML = 'X';
            close.style.position = 'relative';
            close.style.top = '-20px';
            close.style.color = '#000000';
            rubricaDiv.appendChild(close)

            const spanElement = document.createElement('span');
            spanElement.innerHTML = `Assinatura do ${signUser}`;
            rubricaDiv.appendChild(spanElement);

            const rubricaImg = document.createElement('img');
            rubricaImg.src = 'https://ibdt.org.br/site/wp-content/uploads/2022/03/assinatura-ricardo.png';
            rubricaImg.style.width = '100%';
            rubricaImg.style.height = '100%';
            rubricaImg.style.objectFit = 'contain';
            rubricaDiv.appendChild(rubricaImg);

            pageElement.appendChild(rubricaDiv);
          }

          console.log(`Você clicou na Página ${pageNum} nas coordenadas X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
          // alert(`Página: ${pageNum}\nX: ${x.toFixed(2)}\nY: ${y.toFixed(2)}`);
        });
      });
  }
  console.log("signUser", signUser)
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
    });

  }, []);

  return (
    <>

      <div
        ref={outerContainerRef}
        className="customPdfViewerWrapper"
        onClick={getClick}
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
    </>
  );
}
