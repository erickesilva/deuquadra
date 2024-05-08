import React, { useState } from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import { Link, useNavigate } from 'react-router-dom';

export function ChooseDateStep() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const navigate = useNavigate();
  const pricePerReservation = 80; // Preço por reserva

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset selected time slot when date changes
  };

  const handleScheduleEvent = () => {
    if (selectedDate && selectedTimeSlot) {
      const eventName = window.prompt('Nome do evento:');
      if (eventName) {
        const newEvent = { date: selectedDate, time: selectedTimeSlot, name: eventName, price: pricePerReservation };
        setScheduledEvents([...scheduledEvents, newEvent]);
        setSelectedTimeSlot(null);
        alert(`Evento "${eventName}" reservado para ${selectedDate.format('DD/MM/YYYY')} às ${selectedTimeSlot}`);
      }
    }
  };

  const isTimeSlotAvailable = (time) => {
    return !scheduledEvents.some(event => event.date.isSame(selectedDate, 'day') && event.time === time);
  };

  const totalPrice = scheduledEvents.reduce((acc, event) => acc + event.price, 0);

  const [formaPagamento, setFormaPagamento] = useState<string>('');
  const [parcelamento, setParcelamento] = useState<number>(1);
  const [numeroCartao, setNumeroCartao] = useState<string>('');
  const [nomeTitular, setNomeTitular] = useState<string>('');
  const [dataValidade, setDataValidade] = useState<string>('');
  const [bandeiraCartao, setBandeiraCartao] = useState<string>('');

  const calcularValorParcela = () => {
    let valorParcela = totalPrice / parcelamento;
    return valorParcela.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Verifica se a forma de pagamento foi selecionada
    if (!formaPagamento) {
      alert('Por favor, selecione a forma de pagamento.');
      return;
    }
    // Verifica se os campos do formulário correspondentes à forma de pagamento escolhida foram preenchidos
    if ((formaPagamento === 'cartao' && !(numeroCartao && nomeTitular && dataValidade && bandeiraCartao)) ||
        (formaPagamento === 'pix')) {
      alert('Por favor, preencha todos os campos do formulário de pagamento.');
      return;
    }
    // Aqui você pode lidar com o envio do formulário
    alert('Formulário de pagamento enviado!');
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mb-3">
      <h2 className="text-center mb-4">Escolha a Data da sua Reserva</h2>
      <div className="flex justify-center">
        <Calendar onSelect={handleDateSelect} />
      </div>
      {selectedDate && (
        <div>
          <p className="text-center mt-4">{selectedDate.format('DD/MM/YYYY')}</p>
          <h3 className="text-center mb-2">Horários Disponíveis</h3>
          <div className="flex justify-center">
            <div className="flex flex-wrap">
              {['08:00', '09:00'].map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTimeSlot(time)}
                  className={`p-2 rounded-md ${isTimeSlotAvailable(time) ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-400 cursor-not-allowed'}`}
                  disabled={!isTimeSlotAvailable(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap">
              {['10:00'].map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTimeSlot(time)}
                  className={`p-2 rounded-md ${isTimeSlotAvailable(time) ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-400 cursor-not-allowed'}`}
                  disabled={!isTimeSlotAvailable(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          {selectedTimeSlot && (
            <div className="text-center mt-4">
              <button onClick={handleScheduleEvent} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Reservar</button>
            </div>
          )}
        </div>
      )}
      {scheduledEvents.length > 0 && (
        <div className="mt-4">
          <h3 className="text-center">Detalhe da Reserva </h3>
          <br/>
          <ul>
            {scheduledEvents.map((event, index) => (
              <li key={index} className="text-center">
               {event.date.format('DD/MM/YYYY')}, às {event.time}, <strong> Evento:</strong> {event.name}, <strong> Preço:</strong> R$ {event.price}
              </li>
            ))}
          </ul>
          <br/>
          <p className="text-center">Total a pagar: R$ {totalPrice}</p>
          <form className="payment-form" onSubmit={handleSubmit}>
            <h2 className="payment-title">Formas de Pagamento</h2>
            <div className="payment-row">
              <select className="payment-input" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                <option value="">Selecione a Forma de Pagamento</option>
                <option value="cartao">Cartão de Crédito</option>
                <option value="pix">PIX</option>
              </select>
            </div>
            {formaPagamento === 'cartao' && (
              <>
                <div className="payment-row">
                  <br/>
                  <input type="text" className="payment-input " placeholder="Número do Cartão" value={numeroCartao} onChange={(e) => setNumeroCartao(e.target.value)} />
                </div>
                <div className="payment-row ">
                <br/>
                  <input type="text" className="payment-input " placeholder="Nome do Titular" value={nomeTitular} onChange={(e) => setNomeTitular(e.target.value)} />
                </div>
                <div className="payment-row ">
                <br/>
                  <input type="text" className="payment-input " placeholder="Validade(MM/AAAA)" value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} />
                </div>
                <div className="payment-row">
                <br/>
                  <select className="payment-input" value={parcelamento} onChange={(e) => setParcelamento(parseInt(e.target.value))}>
                    {[...Array(12)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>{index + 1}x</option>
                    ))}
                  </select>
                </div>
                <div className="payment-row">
                <br/>
                  <select className="payment-input" value={bandeiraCartao} onChange={(e) => setBandeiraCartao(e.target.value)}>
                    <option value="">Selecione a Bandeira do Cartão</option>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <br/>
                  </select>
                </div>
                <div className="payment-row">
                <br/>
                  <input type="text" className="payment-input" placeholder={`Total Pagar: R$ ${totalPrice}`} readOnly />
                </div>
                <div className="payment-row">
                <br/>
                  <input type="text" className="payment-input" placeholder={`Valor Parcelado: R$ ${calcularValorParcela()}`} readOnly />
                </div>
              </>
            )}
            {formaPagamento === 'pix' && (
              <>
                <div className="payment-row">
                <br/>
                  <input type="text" className="payment-input" placeholder="deuquadra@gmail.com"readOnly/>
                </div>
                <div className="payment-row">
                <br/>
                  <input type="text" className="payment-input" placeholder="Nome Completo" />
                </div>
                <div className="payment-row">
                <br/>
                  <input type="text" className="payment-input" placeholder="CPF" />
                </div>
                <div className="payment-row">
                <br/>
                  <input type="text" className="payment-input" placeholder={`Valor a Pagar: R$ ${totalPrice}`} readOnly />
                </div>
              </>
            )}
            <br/>
            <button type="submit" className="payment-button bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Efetuar Pagamento</button>
          </form>
        </div>
      )}
      <div className="mt-4 flex justify-between">
        <Link to="/" className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Voltar</Link>
        <button onClick={() => navigate('/empresa/1')} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Próximo</button>
      </div>
    </div>
  );
}

