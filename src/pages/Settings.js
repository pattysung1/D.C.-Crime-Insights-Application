import React from 'react';

function Settings() {
    const themeButtons = [
        { name: 'default', label: 'Classic Blue', color: '#2c3e50' },
        { name: 'orange', label: 'Sunset Orange', color: '#fe9a43' },
        { name: 'purple', label: 'Royal Purple', color: '#9b59b6' },
        { name: 'green', label: 'Forest Green', color: '#2ecc71' },
        { name: 'ocean', label: 'Ocean Blue', color: '#3498db' },
        { name: 'dark', label: 'Dark Mode', color: '#2c3e50' },
        { name: 'pink', label: 'Cherry Blossom', color: '#ff7979' },
        { name: 'gray', label: 'Modern Gray', color: '#95a5a6' },
        { name: 'warm', label: 'Warm Autumn', color: '#e17055' }
    ];

    const changeTheme = (themeName) => {
        document.documentElement.setAttribute('data-theme', themeName);
    };

    return (
        <div>
            <h2>Theme Settings</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {themeButtons.map((theme) => (
                    <button
                        key={theme.name}
                        onClick={() => changeTheme(theme.name)}
                        className="theme-button"
                        style={{
                            backgroundColor: theme.color,
                            color: 'white'
                        }}
                    >
                        {theme.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Settings;