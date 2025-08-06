document.addEventListener("DOMContentLoaded", function () {
  const options = {
      bottom: '32px',
      right: '15px',
      left: 'unset',
      time: '0.3s',
      mixColor: '#fff',
      backgroundColor: '#fff',
      buttonColorDark: '#100f2c',
      buttonColorLight: '#fff',
      saveInCookies: true,
      label: '🌙',
      autoMatchOsTheme: true
  };

  const darkmode = new Darkmode(options);
  darkmode.showWidget();
});
