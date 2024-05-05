import React, { useState } from 'react';
import './agenda.css'; // Importa o arquivo CSS

// Componente da Agenda
const Agenda: React.FC = () => {
  // Estado para armazenar as reservas
  const [reservas, setReservas] = useState<{ data: string, horario: string, churrasqueira: boolean, goleiro: boolean, juiz: boolean }[]>([]);
  // Estado para armazenar a data selecionada
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  // Estado para armazenar o horário selecionado
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  // Estado para armazenar as opções de churrasqueira selecionadas para cada horário
  const [churrasqueiraSelecionadaPorHorario, setChurrasqueiraSelecionadaPorHorario] = useState<{ [horario: string]: boolean }>({});
  // Estado para armazenar as opções de goleiro selecionadas para cada horário
  const [goleiroSelecionadoPorHorario, setGoleiroSelecionadoPorHorario] = useState<{ [horario: string]: boolean }>({});
  // Estado para armazenar as opções de juiz selecionadas para cada horário
  const [juizSelecionadoPorHorario, setJuizSelecionadoPorHorario] = useState<{ [horario: string]: boolean }>({});
  // Estado para armazenar o total a pagar por cada horário selecionado
  const [totalAPagarPorHorario, setTotalAPagarPorHorario] = useState<{ [horario: string]: number }>({});
  // Estado para armazenar o total geral a pagar
  const [totalGeral, setTotalGeral] = useState<number>(0);
  // Estado para armazenar a forma de pagamento selecionada
  const [formaPagamento, setFormaPagamento] = useState<string>('');
  // Estado para armazenar o número de parcelas escolhido
  const [parcelamento, setParcelamento] = useState<number>(1);

  // Estados para os campos do formulário de pagamento com cartão de crédito
  const [numeroCartao, setNumeroCartao] = useState<string>('');
  const [nomeTitular, setNomeTitular] = useState<string>('');
  const [dataValidade, setDataValidade] = useState<string>('');
  const [bandeiraCartao, setBandeiraCartao] = useState<string>('');
  const [codigoSeguranca, setCodigoSeguranca] = useState<string>('');

  // Estados para os campos do formulário de pagamento PIX
  const [chavePix, setChavePix] = useState<string>('');
  const [nomePix, setNomePix] = useState<string>('');
  const [cpfPix, setCpfPix] = useState<string>('');

  // Estado para armazenar a porcentagem de juros progressivos
  const [jurosProgressivos, setJurosProgressivos] = useState<number>(3); // Inicialmente, 3%

  // Constantes para os preços
  const precoQuadra = 80; // Preço da quadra
  const precoChurrasqueira = 30; // Preço da churrasqueira
  const precoGoleiro = 30; // Preço do goleiro
  const precoJuiz = 30; // Preço do juiz

  // Lista de horários disponíveis (presumindo que seja fornecida)
  const horariosDisponiveis = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    // Adicione mais horários conforme necessário
  ];

  // Função para lidar com a seleção de uma data
  const selecionarData = (data: string) => {
    // Define a data selecionada
    setDataSelecionada(data);
    // Limpa o horário selecionado
    setHorarioSelecionado(null);
  };

  // Função para lidar com a seleção de um horário
  const selecionarHorario = (horario: string) => {
    // Define o horário selecionado
    setHorarioSelecionado(horario);
  };

  // Função para lidar com a seleção da opção de churrasqueira para um horário específico
  const selecionarChurrasqueira = (horario: string) => {
    setChurrasqueiraSelecionadaPorHorario({
      ...churrasqueiraSelecionadaPorHorario,
      [horario]: !churrasqueiraSelecionadaPorHorario[horario] // Inverte o valor atual da opção de churrasqueira para o horário específico
    });
  };

  // Função para lidar com a seleção da opção de goleiro para um horário específico
  const selecionarGoleiro = (horario: string) => {
    setGoleiroSelecionadoPorHorario({
      ...goleiroSelecionadoPorHorario,
      [horario]: !goleiroSelecionadoPorHorario[horario] // Inverte o valor atual da opção de goleiro para o horário específico
    });
  };

  // Função para lidar com a seleção da opção de juiz para um horário específico
  const selecionarJuiz = (horario: string) => {
    setJuizSelecionadoPorHorario({
      ...juizSelecionadoPorHorario,
      [horario]: !juizSelecionadoPorHorario[horario] // Inverte o valor atual da opção de juiz para o horário específico
    });
  };

  // Função para lidar com a reserva de um horário
  const reservarHorario = () => {
    // Verifica se a data e o horário foram selecionados
    if (dataSelecionada && horarioSelecionado) {
      // Verifica se o horário já está reservado
      const horarioJaReservado = reservas.some(reserva => reserva.data === dataSelecionada && reserva.horario === horarioSelecionado);
      if (horarioJaReservado) {
        alert('Este horário já está reservado.');
      } else {
        // Calcula o total a pagar para o horário selecionado
        const totalAPagar = calcularTotalPorHorarioSelecionado();
        // Adiciona a reserva ao estado
        setReservas([...reservas, { data: dataSelecionada, horario: horarioSelecionado, churrasqueira: churrasqueiraSelecionadaPorHorario[horarioSelecionado] || false, goleiro: goleiroSelecionadoPorHorario[horarioSelecionado] || false, juiz: juizSelecionadoPorHorario[horarioSelecionado] || false }]);
        // Atualiza o total a pagar para o horário selecionado
        setTotalAPagarPorHorario({ ...totalAPagarPorHorario, [horarioSelecionado]: totalAPagar });
        // Atualiza o total geral a pagar
        setTotalGeral(totalGeral + totalAPagar); // Adiciona o total do horário ao total geral
        // Limpa os checkboxes
        setChurrasqueiraSelecionadaPorHorario({ ...churrasqueiraSelecionadaPorHorario, [horarioSelecionado]: false });
        setGoleiroSelecionadoPorHorario({ ...goleiroSelecionadoPorHorario, [horarioSelecionado]: false });
        setJuizSelecionadoPorHorario({ ...juizSelecionadoPorHorario, [horarioSelecionado]: false });
        // Limpa o horário selecionado
        setHorarioSelecionado(null);
        alert('Reserva realizada com sucesso!');
      }
    } else {
      alert('Por favor, selecione uma data e um horário antes de confirmar a reserva.');
    }
  };

  // Função para limpar as reservas
  const limparReservas = () => {
    setReservas([]);
    setTotalAPagarPorHorario({});
    setTotalGeral(0); // Limpa o total geral a pagar
    alert('Reservas limpas com sucesso!');
  };

  // Calcula o total a pagar para o horário selecionado
  const calcularTotalPorHorarioSelecionado = () => {
    let total = precoQuadra; // Valor inicial do horário

    if (churrasqueiraSelecionadaPorHorario[horarioSelecionado || '']) {
      total += precoChurrasqueira; // Adiciona o valor da churrasqueira
    }

    if (goleiroSelecionadoPorHorario[horarioSelecionado || '']) {
      total += precoGoleiro; // Adiciona o valor do goleiro
    }

    if (juizSelecionadoPorHorario[horarioSelecionado || '']) {
      total += precoJuiz; // Adiciona o valor do juiz
    }

    return total;
  };

  // Função para calcular o valor da parcela com base no número de parcelas escolhido
  const calcularValorParcela = () => {
    let valorParcela = totalGeral / parcelamento;
    
    // Aplica juros progressivos se o número de parcelas for maior que 4
    if (parcelamento > 4) {
      const juros = (totalGeral * jurosProgressivos) / 100; // Calcula o valor dos juros
      valorParcela += (juros / parcelamento); // Adiciona a parcela dos juros em cada parcela
    }

    return valorParcela.toFixed(2);
  };

  // Função para lidar com o envio do formulário de pagamento
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Verifica se a forma de pagamento foi selecionada
    if (!formaPagamento) {
      alert('Por favor, selecione a forma de pagamento.');
      return;
    }
    // Verifica se os campos do formulário correspondentes à forma de pagamento escolhida foram preenchidos
    if ((formaPagamento === 'cartao' && !(numeroCartao && nomeTitular && dataValidade && bandeiraCartao && codigoSeguranca)) ||
        (formaPagamento === 'pix' && !(chavePix && nomePix && cpfPix))) {
      alert('Por favor, preencha todos os campos do formulário de pagamento.');
      return;
    }
    // Aqui você pode lidar com o envio do formulário
    alert('Formulário de pagamento enviado!');
  };

  // Renderização dos horários disponíveis para a data selecionada
  const renderizarHorariosDisponiveis = () => {
    if (dataSelecionada) {
      // Extrai o ano da data selecionada
      const anoSelecionado = new Date(dataSelecionada).getFullYear();
      // Verifica se o ano selecionado está dentro do intervalo permitido
      if (anoSelecionado < 2024 || anoSelecionado > 2025) {
        return <p>Por favor, selecione um ano entre 2024 e 2025.</p>;
      }

      // Renderiza os horários disponíveis
      return (
        <div>
          <h2>Horários Disponíveis para {dataSelecionada}</h2>
          <p>Total de Horários Reservados: {reservas.length}</p> {/* Total de Horários Reservados */}
          <ul>
            {horariosDisponiveis.map(horario => (
              // Verifica se o horário já está reservado
              <li key={horario} onClick={() => selecionarHorario(horario)}>
                <span>{horario}</span>
                <span> - Locação Quadra: R$ {precoQuadra}</span> {/* Preço da Quadra */}
                <input
                  type="checkbox"
                  className="checkbox1"
                  checked={churrasqueiraSelecionadaPorHorario[horario] || false}
                  onChange={() => selecionarChurrasqueira(horario)}
                />
                <label>Churrasqueira - R$ {precoChurrasqueira}</label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={goleiroSelecionadoPorHorario[horario] || false}
                  onChange={() => selecionarGoleiro(horario)}
                />
                <label>Goleiro - R$ {precoGoleiro}</label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={juizSelecionadoPorHorario[horario] || false}
                  onChange={() => selecionarJuiz(horario)}
                />
                <label>Juiz - R$ {precoJuiz}</label>
              </li>
            ))}
          </ul>
          {/* Botões para confirmar a reserva e limpar as reservas */}
          <div>
            {horarioSelecionado && (
              <button className="confirm-button" onClick={reservarHorario}>Confirmar Reserva</button>
            )}
            <button className="clear-button" onClick={limparReservas}>Limpar Reservas</button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container">
      <h1>Agenda de Reservas</h1>
      <div className="calendar-section">
        {/* Calendário */}
        <h2>Calendário</h2>
        <p>Selecione uma data entre 2024 e 2025:</p>
        <input type="date" min="2024-01-01" max="2025-12-31" onChange={(e) => selecionarData(e.target.value)} />
      </div>
      {/* Renderiza os horários disponíveis para a data selecionada */}
      {renderizarHorariosDisponiveis()}
      {/* Renderiza os detalhes da reserva */}
      {reservas.length > 0 && (
        <div className="reservation-details">
          <h2>Detalhes da Reserva</h2>
          <ul>
            {reservas.map((reserva, index) => (
               <li key={index}>Reserva para {reserva.data} às {reserva.horario} {reserva.churrasqueira ? '/com churrasqueira' : '/sem churrasqueira'} {reserva.goleiro ? '/com goleiro' : '/sem goleiro'} {reserva.juiz ? '/com juiz' : '/sem juiz'} 
               {totalAPagarPorHorario[reserva.horario] && <span> - Total: R$ {totalAPagarPorHorario[reserva.horario]}</span>}</li>
            ))}
          </ul>
          <p>Total Geral a Pagar: R$ {totalGeral}</p>
        </div>
      )}
      {/* Formulário de pagamento */}
      {dataSelecionada && ( // Verifica se uma data válida foi selecionada antes de exibir o formulário de pagamento
        <form className="payment-form" onSubmit={handleSubmit}>
          <h2 className="payment-title">Formas de Pagamento</h2>
          {/* Dropdown para selecionar a forma de pagamento */}
          <select className="payment-input" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
            <option value="">Selecione a Forma de Pagamento</option>
            <option value="cartao">Cartão de Crédito</option>
            <option value="pix">PIX</option>
          </select>
          {/* Campos do formulário de pagamento com cartão de crédito */}
          {formaPagamento === 'cartao' && (
            <>
              <input type="text" className="payment-input" placeholder="Número do Cartão de Crédito" value={numeroCartao} onChange={(e) => setNumeroCartao(e.target.value)} />
              <input type="text" className="payment-input" placeholder="Nome do Titular do Cartão" value={nomeTitular} onChange={(e) => setNomeTitular(e.target.value)} />
              <input type="text" className="payment-input" placeholder="Data de Validade (MM/AAAA)" value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} />
              <select className="payment-input" value={parcelamento} onChange={(e) => setParcelamento(parseInt(e.target.value))}>
                {[...Array(12)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>{index + 1}x</option>
                ))}
              </select>
              <select className="payment-input" value={bandeiraCartao} onChange={(e) => setBandeiraCartao(e.target.value)}>
                <option value="">Selecione a Bandeira do Cartão</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
              </select>
              <input type="text" className="payment-input" placeholder={`Total Pagar: R$ ${totalGeral}`} readOnly />
              <input type="text" className="payment-input" placeholder={`Valor Parcelado: R$ ${calcularValorParcela()}`} readOnly />
            </>
          )}
          {/* Campos do formulário de pagamento PIX */}
          {formaPagamento === 'pix' && (
            <>
              <input type="text" className="payment-input" placeholder="Chave PIX" value={chavePix} onChange={(e) => setChavePix(e.target.value)} />
              <input type="text" className="payment-input" placeholder="Nome Completo" value={nomePix} onChange={(e) => setNomePix(e.target.value)} />
              <input type="text" className="payment-input" placeholder="CPF" value={cpfPix} onChange={(e) => setCpfPix(e.target.value)} />
              <input type="text" className="payment-input" placeholder={`Valor a Pagar: R$ ${totalGeral}`} readOnly />
              {/* Campo específico do PIX, não mostra o valor parcelado */}
            </>
          )}
          {/* Botão para efetuar o pagamento */}
          <button type="submit" className="payment-button">Efetuar Pagamento</button>
        </form>
      )}
    </div>
  );
}

export default Agenda;










