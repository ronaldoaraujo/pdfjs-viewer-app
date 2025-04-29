import { useState } from "react";
import "./App.css";
import PdfViewer from "./components/PdfViewer";
import SignatureSelect from "./components/signatureSelect";

function App() {
  const [signUser, setSignUser] = useState()
  return (
    <>
    <div className="flex items-center justify-center w-full h-screen bg-gray-200">
      <SignatureSelect setSignUser={setSignUser} />
      <PdfViewer signUser={signUser} url="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" />

    </div>
    </>
  );
}

export default App;
