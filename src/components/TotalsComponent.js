import React from 'react';

const TotalsComponent = () => {
  // static data, need to fetch from api
  const totalsData = [
    { type: 'Total Crime', previous: 24876, current: 20487 },
    { type: 'All Violent Crime', previous: 3926, current: 2569 },
    { type: 'Homicide', previous: 194, current: 139 },
    { type: 'Sex Abuse', previous: 133, current: 118 },
    { type: 'Assault w/Dangerous Weapon', previous: 1064, current: 780 },
    { type: 'Robbery', previous: 2535, current: 1532 },
    { type: 'All Property Crime', previous: 20950, current: 17918 },
    { type: 'Burglary', previous: 790, current: 701 },
    { type: 'Theft f/Auto', previous: 5639, current: 4640 },
    { type: 'Theft/Other', previous: 9304, current: 9003 },
    { type: 'Motor Vehicle Theft', previous: 5208, current: 3561 },
    { type: 'Arson', previous: 9, current: 4 },
  ];

  return (
    <div>
      <h2>Totals</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Previous Period</th>
            <th>Current Period</th>
          </tr>
        </thead>
        <tbody>
          {totalsData.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.previous.toLocaleString()}</td>
              <td>{item.current.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TotalsComponent;
