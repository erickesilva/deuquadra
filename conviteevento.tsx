import React, { useState, useEffect } from 'react';
import './ConviteEvento.css';

interface Convidado {
  nome: string;
  cpf?: string;
  email: string;
}

const ConviteEvento: React.FC = () => {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [nome, setNome] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [horario, setHorario] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [local, setLocal] = useState<string>('');
  const [convitesGerados, setConvitesGerados] = useState<{ [key: string]: string }>({});
  const [mostrarListaConvidados, setMostrarListaConvidados] = useState<boolean>(false);

  const formatarNome = (texto: string) => {
    const palavras = texto.toLowerCase().split(' ');
    const nomeFormatado = palavras.map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1)).join(' ');
    return nomeFormatado;
  };

  const formatarMensagemPersonalizada = (nome: string, horario: string, data: string, local: string) => {
    let mensagem = `Olá, ${nome}! Esse é um convite do deuQuadra!`;

    if (local.trim() !== '') {
      mensagem += ` Você foi escalado para ser titular do seu time. Compareça dia ${data} às ${horario} no endereço ${local}.`;
    } else {
      mensagem += '.';
    }

    mensagem += ` Só está faltando você para a escalação ficar completa! Venha competir e interagir entre amigos! Esperamos por você, não vai perder essa chance!`;

    return mensagem;
  };

  const handleAdicionarConvidado = () => {
    if (nome.trim() !== '' && email.trim() !== '') {
      const novoConvidado = { nome: formatarNome(nome), cpf, email };
      setConvidados([...convidados, novoConvidado]);
      setNome('');
      setCpf('');
      setEmail('');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleRemoverConvidado = (nomeConvidado: string) => {
    const novosConvidados = convidados.filter(convidado => convidado.nome !== nomeConvidado);
    setConvidados(novosConvidados);
    const novosConvites = { ...convitesGerados };
    delete novosConvites[nomeConvidado];
    setConvitesGerados(novosConvites);
  };

  const handleGerarConvite = () => {
    if (nome.trim() !== '' && email.trim() !== '') {
      
      let convite = `Olá, ${nome}! Esse é um convite do deuQuadra!`;

      if (local.trim() !== '') {
        convite += ` Você foi escalado para ser titular do seu time. Compareça dia ${data} às ${horario} no endereço ${local}.`;
      } else {
        convite += '.';
      }

      convite += ` Só está faltando você para a escalação ficar completa! Venha competir e interagir entre amigos! Esperamos por você, não vai perder essa chance!`;

      setConvitesGerados({ ...convitesGerados, [nome]: convite });
      const novoConvidado = { nome: formatarNome(nome), cpf, email };
      setConvidados([...convidados, novoConvidado]);
      setNome('');
      setCpf('');
      setEmail('');
      setData('');
      setHorario('');
      setLocal('');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  useEffect(() => {
    const dados = localStorage.getItem('dados');
    if (dados) {
      const carregados = JSON.parse(dados);
      setConvidados(carregados.convidados);
      setConvitesGerados(carregados.convites);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dados', JSON.stringify({ convidados, convites: convitesGerados }));
  }, [convidados, convitesGerados]);

  const handleMostrarListaConvidados = () => {
    const listaConvidados = convidados.map((convidado) => `Nome: ${convidado.nome}, CPF: ${convidado.cpf || 'Não informado'}, Email: ${convidado.email}`).join('\n');
    alert(listaConvidados);
  };

  const handleImprimirListaConvidados = () => {
    const listaConvidados = convidados.map((convidado, index) => `${index + 1}. Nome: ${convidado.nome}, CPF: ${convidado.cpf || 'Não informado'}, Email: ${convidado.email}`).join('\n');
    const windowContent = `
      <html>
        <head>
          <title>Lista de Convidados</title>
        </head>
        <body>
          <pre>${listaConvidados}</pre>
        </body>
      </html>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(windowContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() === '') {
      alert('Por favor, preencha o campo de e-mail.');
      return;
    }
    handleAdicionarConvidado();
  };

  const handleEnviarConvites = () => {
    // Aqui você pode adicionar a lógica para enviar os convites usando Formspree
    alert('Convites enviados com sucesso!');
  };

  const handleVerMensagemPersonalizada = (nome: string) => {
    const convitePersonalizado = formatarMensagemPersonalizada(nome, horario, data, local);
    alert(convitePersonalizado);
  };

  return (
    <div>
      {convidados.map((convidado, index) => (
        <div key={index} className="convidado-container">
          <div className="info-container">
            <input
              type="text"
              value={convidado.nome}
              readOnly
              className="input-info"
            />
            <input
              type="text"
              value={convidado.cpf || 'Não informado'}
              readOnly
              className="input-info"
            />
            <input
              type="text"
              value={convidado.email}
              readOnly
              className="input-info"
            />
            <button onClick={() => handleRemoverConvidado(convidado.nome)}>Remover</button>
          </div>
        </div>
      ))}
      <form action="https://formspree.io/f/moqgrnjq" method="POST" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input-info"
            required
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="input-info"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-info"
            required
          />
        </div>
        <div className="input-container">
          <label>
            Horário do Evento:
            <input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="input-info"
            />
          </label>
          <label>
            Data do Evento:
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="input-info"
            />
          </label>
        </div>
        <div className="input-container">
          <label>
            Local do Evento:
            <input
              type="text"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="input-info"
            />
          </label>
        </div>
        <div className="button-container">
          <button type="submit">Adicionar convidado</button>
        </div>
        <div className="button-container">
          <button onClick={handleGerarConvite}>Gerar Convite</button>
        </div>
        <div className="button-container">
          <button onClick={handleMostrarListaConvidados}>Lista de Convidados</button>
        </div>
        <div className="button-container">
          <button onClick={handleImprimirListaConvidados}>Imprimir Lista de Convidados</button>
        </div>
        <div className="button-container">
          <button type="button" onClick={handleEnviarConvites}>Enviar Convites</button>
        </div>
      </form>
      {Object.entries(convitesGerados).map(([nome, convite], index) => (
        <div key={index} className="convite-container">
          <a href="#" onClick={() => handleVerMensagemPersonalizada(nome)}>{nome} foi convidado:</a>
          <div className="button-wrapper">
            <button onClick={() => handleVerMensagemPersonalizada(nome)}>Ver mensagem</button>
            <button onClick={() => handleRemoverConvidado(nome)}>Remover convidado</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConviteEvento;



