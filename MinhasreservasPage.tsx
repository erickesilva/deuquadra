import React, { useState } from 'react';
import { SimplePage } from '../SimplePage';
import imagemQuadra from '@src/assets/imagem_quadra.jpg';
import Navbar from '@components/Navbar/Navbar';
import './minhasReservas.css'; // Importando o arquivo CSS

export function MinhasreservasPage() {
  const [reservas, setReservas] = useState([
    {
      nomeQuadra: 'Quadra A',
      imagemQuadra: imagemQuadra,
      enderecoQuadra: 'Endereço da Quadra A',
      dataLocacao: '16/05/2024',
      avaliacoes: [],
    },
    {
      nomeQuadra: 'Quadra B',
      imagemQuadra: imagemQuadra,
      enderecoQuadra: 'Endereço da Quadra B',
      dataLocacao: '16/05/2024',
      avaliacoes: [],
    },
    // outras reservas...
  ]);
  const adicionarAvaliacao = (index: number, avaliacao: number) => {
    const novasReservas = [...reservas];
    novasReservas[index].avaliacoes.push(avaliacao);
    setReservas(novasReservas);
  };

  const calcularMediaAvaliacoes = (avaliacoes: number[]) => {
    if (avaliacoes.length === 0) return 0;
    const somaAvaliacoes = avaliacoes.reduce((total, atual) => total + atual);
    return somaAvaliacoes / avaliacoes.length;
  };


  return (
    <SimplePage>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <Navbar />
      </div>
      <div className="minhas-reservas-wrapper"> {/* Adicionando a classe do CSS */}
        <h1>Minhas Reservas</h1>
        <div className="minhas-reservas">
          {reservas.map((reserva, index) => (
            <div key={index} className="quadra">
              <img src={reserva.imagemQuadra} alt={reserva.nomeQuadra} className="imagem-quadra" />
              <div className="dados-quadra">
                <p className="nome-quadra">{reserva.nomeQuadra}</p>
                <p className="endereco">Endereço: {reserva.enderecoQuadra}</p>
                <p className="data-locacao">Data de Locação: {reserva.dataLocacao}</p>
                <p className="avaliacao-media">Avaliação Média: {calcularMediaAvaliacoes(reserva.avaliacoes)}</p>
                <div className="botoes-avaliacao">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <button
                      key={`${reserva.nomeQuadra}-${estrela}`}
                      onClick={() => adicionarAvaliacao(index, estrela)}
                      style={{ color: estrela <= calcularMediaAvaliacoes(reserva.avaliacoes) ? 'gold' : 'gray' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimplePage>
  );
}
