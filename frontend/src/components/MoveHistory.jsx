import React from 'react';

export default function MoveHistory({ history }) {
  // Gom 2 nước đi (Trắng - Đen) thành 1 lượt (Turn) để hiển thị
  const groupedHistory = [];
  for (let i = 0; i < history.length; i += 2) {
    const whiteMove = history[i];
    const blackMove = history[i + 1];

    groupedHistory.push({
      turn: Math.floor(i / 2) + 1,
      // Ghép vị trí from và to lại với nhau, ví dụ: "e2-e4"
      white: whiteMove ? `${whiteMove.from}-${whiteMove.to}` : '',
      black: blackMove ? `${blackMove.from}-${blackMove.to}` : ''
    });
  }

  return (
    <div style={{ width: '250px', height: '500px', overflowY: 'auto', backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '8px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Lịch sử nước đi</h3>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '5px' }}>#</th>
            <th>Trắng</th>
            <th>Đen</th>
          </tr>
        </thead>
        <tbody>
          {groupedHistory.map((row, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '5px', color: '#666' }}>{row.turn}.</td>
              <td style={{ fontWeight: 'bold', color: '#1d4ed8' }}>{row.white}</td>
              <td style={{ fontWeight: 'bold', color: '#b91c1c' }}>{row.black}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}