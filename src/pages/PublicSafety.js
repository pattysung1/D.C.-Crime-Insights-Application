import React from 'react';

const PublicSafety = () => {
    return (
        <div>
            <h2>Public Safety Resources</h2>
            <p>Here are some important public safety resources for Washington, DC:</p>

            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Organization</th>
                        <th>Contact Information</th>
                        <th>Website</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Metropolitan Police Department (MPD)</td>
                        <td>Emergency: 911<br />Non-emergency: (202) 727-9099<br />Text tips: 50411</td>
                        <td><a href="https://mpdc.dc.gov" target="_blank" rel="noopener noreferrer">mpdc.dc.gov</a></td>
                    </tr>
                    <tr>
                        <td>Office of the Deputy Mayor for Public Safety and Justice</td>
                        <td>(202) 673-6566<br />John A. Wilson Building, 1350 Pennsylvania Avenue NW, Suite 533, Washington, DC 20004</td>
                        <td><a href="https://dmpsj.dc.gov" target="_blank" rel="noopener noreferrer">dmpsj.dc.gov</a></td>
                    </tr>
                    <tr>
                        <td>Fire and Emergency Medical Services (EMS)</td>
                        <td>Find station: [Fire and EMS Locator](https://dcgis.maps.arcgis.com)</td>
                        <td><a href="https://fems.dc.gov" target="_blank" rel="noopener noreferrer">fems.dc.gov</a></td>
                    </tr>
                    <tr>
                        <td>Office of the Attorney General for DC</td>
                        <td>(202) 727-3400<br />400 6th Street, NW, Washington, DC 20001</td>
                        <td><a href="https://oag.dc.gov" target="_blank" rel="noopener noreferrer">oag.dc.gov</a></td>
                    </tr>
                    <tr>
                        <td>Public Safety Camera Incentive Program</td>
                        <td>Visit website for details</td>
                        <td><a href="https://ovsjg.dc.gov" target="_blank" rel="noopener noreferrer">ovsjg.dc.gov</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PublicSafety;
