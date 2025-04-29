import { useState } from "react";

export default function SignatureSelect({setSignUser}) {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setSignUser(opcaoSelecionada)
    console.log(`Você selecionou: ${opcaoSelecionada}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Escolha uma opção:
        <select
          value={opcaoSelecionada}
          onChange={(e) => setSignUser(e.target.value)}
        >
          <option value="">-- Selecione --</option>
          <option value="ronaldo">Ronaldo</option>
          <option value="bruno">Bruno</option>
        </select>
      </label>
      {/* <br />
      <button type="submit">Enviar</button> */}
    </form>
  )
}